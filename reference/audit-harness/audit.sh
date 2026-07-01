#!/usr/bin/env bash
# =============================================================================
# audit.sh — Recap Media static site audit
# Usage: bash reference/audit-harness/audit.sh
#        Run from the repo root (the directory containing index.html).
# Output: plain text report. Pipe to a file or straight into an AI prompt.
# Dependencies: bash, grep, awk, find, python3 (stdlib only).
# =============================================================================

set -eu

# ---------------------------------------------------------------------------
# Guard: must be run from the repo root
# ---------------------------------------------------------------------------
if [ ! -f "index.html" ]; then
  echo "ERROR: audit.sh must be run from the repo root (the directory containing index.html)." >&2
  exit 1
fi

REPO_ROOT="$(pwd)"
DIVIDER="────────────────────────────────────────────────────────────────"

echo "================================================================"
echo " RECAP MEDIA — SITE AUDIT"
echo " Repo: $REPO_ROOT"
echo " Date: $(date '+%Y-%m-%d %H:%M')"
echo "================================================================"
echo ""

# ---------------------------------------------------------------------------
# Collect HTML files (page files only — exclude reference/ and ghl-* templates)
# Works on bash 3.2 (macOS default) — no mapfile/readarray needed.
# ---------------------------------------------------------------------------
HTML_LIST_FILE="$(mktemp /tmp/audit_html_list.XXXXXX)"
find "$REPO_ROOT" -name "*.html" \
    -not -path "*/reference/*" \
    -not -path "*/.git/*" \
    -not -name "ghl-*.html" \
  | sort > "$HTML_LIST_FILE"

# Read into positional array via set --
IFS=$'\n' read -r -d '' -a HTML_FILES < "$HTML_LIST_FILE" || true
# Fallback for bash 3.2: use while loop if array read failed
if [ "${#HTML_FILES[@]}" -eq 0 ]; then
  HTML_FILES=()
  while IFS= read -r line; do
    HTML_FILES+=("$line")
  done < "$HTML_LIST_FILE"
fi
rm -f "$HTML_LIST_FILE"

PAGE_COUNT=${#HTML_FILES[@]}

echo "Pages found: $PAGE_COUNT"
for f in "${HTML_FILES[@]}"; do
  echo "  ${f#$REPO_ROOT/}"
done
echo ""

# ---------------------------------------------------------------------------
# SECTION 1: Schema inventory + JSON-LD validation
# ---------------------------------------------------------------------------
echo "$DIVIDER"
echo "SECTION 1 — JSON-LD SCHEMA INVENTORY"
echo "$DIVIDER"
echo ""

python3 - "$REPO_ROOT" "${HTML_FILES[@]}" <<'PYEOF'
import sys, re, json, os

repo_root = sys.argv[1]
html_files = sys.argv[2:]

for filepath in html_files:
    rel = os.path.relpath(filepath, repo_root)
    try:
        with open(filepath, encoding='utf-8') as fh:
            content = fh.read()
    except Exception as e:
        print(f"  [{rel}] ERROR reading file: {e}")
        continue

    # Extract all <script type="application/ld+json"> blocks
    blocks = re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        content, re.DOTALL | re.IGNORECASE
    )

    if not blocks:
        print(f"  [{rel}] NO JSON-LD found")
        continue

    types_found = []
    errors = []
    for i, block in enumerate(blocks):
        block = block.strip()
        try:
            data = json.loads(block)
            schema_type = data.get('@type', 'unknown')
            types_found.append(schema_type)
        except json.JSONDecodeError as e:
            errors.append(f"block {i}: INVALID JSON — {e}")

    status = "OK" if not errors else "ERRORS"
    types_str = ", ".join(types_found) if types_found else "none parsed"
    print(f"  [{rel}]  @types: {types_str}  [{status}]")
    for err in errors:
        print(f"    !! {err}")
PYEOF

echo ""

# ---------------------------------------------------------------------------
# SECTION 2: SEO signals per page
# ---------------------------------------------------------------------------
echo "$DIVIDER"
echo "SECTION 2 — SEO SIGNALS PER PAGE"
echo "$DIVIDER"
echo "(checks: <title>, meta description, canonical, OG tags, h1 count)"
echo ""

python3 - "$REPO_ROOT" "${HTML_FILES[@]}" <<'PYEOF'
import sys, re, os

repo_root = sys.argv[1]
html_files = sys.argv[2:]

def count_pattern(content, pattern, flags=re.IGNORECASE|re.DOTALL):
    return len(re.findall(pattern, content, flags))

def has_pattern(content, pattern, flags=re.IGNORECASE|re.DOTALL):
    return bool(re.search(pattern, content, flags))

for filepath in html_files:
    rel = os.path.relpath(filepath, repo_root)
    try:
        with open(filepath, encoding='utf-8') as fh:
            content = fh.read()
    except Exception as e:
        print(f"  [{rel}] ERROR reading: {e}")
        continue

    has_title       = has_pattern(content, r'<title[^>]*>[^<]+</title>')
    has_desc        = has_pattern(content, r'<meta\s[^>]*name=["\']description["\'][^>]*content=')
    has_canonical   = has_pattern(content, r'<link\s[^>]*rel=["\']canonical["\']')
    has_og_title    = has_pattern(content, r'property=["\']og:title["\']')
    has_og_desc     = has_pattern(content, r'property=["\']og:description["\']')
    has_og_image    = has_pattern(content, r'property=["\']og:image["\']')
    h1_count        = count_pattern(content, r'<h1[\s>]')

    issues = []
    if not has_title:     issues.append("MISSING <title>")
    if not has_desc:      issues.append("MISSING meta description")
    if not has_canonical: issues.append("MISSING canonical")
    if not has_og_title:  issues.append("MISSING og:title")
    if not has_og_desc:   issues.append("MISSING og:description")
    if not has_og_image:  issues.append("MISSING og:image")
    if h1_count == 0:     issues.append("NO <h1>")
    if h1_count > 1:      issues.append(f"MULTIPLE <h1> ({h1_count})")

    status = "OK" if not issues else "ISSUES"
    print(f"  [{rel}]  [{status}]  h1={h1_count}  title={'Y' if has_title else 'N'}  desc={'Y' if has_desc else 'N'}  canonical={'Y' if has_canonical else 'N'}  og={'Y' if (has_og_title and has_og_desc and has_og_image) else 'partial/N'}")
    for iss in issues:
        print(f"    !! {iss}")
PYEOF

echo ""

# ---------------------------------------------------------------------------
# SECTION 3: Price leak check
# ---------------------------------------------------------------------------
echo "$DIVIDER"
echo "SECTION 3 — PRICE LEAK CHECK"
echo "$DIVIDER"
echo "(grepping for: NOK, kr , ex-mva, priceCurrency, \"price\", priceSpecification)"
echo ""

PRICE_PATTERNS='NOK\|kr \|ex-mva\|priceCurrency\|"price"\|priceSpecification'
FOUND_PRICES=0

for f in "${HTML_FILES[@]}"; do
  rel="${f#$REPO_ROOT/}"
  # grep -n returns line:content; -i case-insensitive; -E extended
  hits=$(grep -niE 'NOK|kr |ex-mva|priceCurrency|"price"|priceSpecification' "$f" 2>/dev/null || true)
  if [ -n "$hits" ]; then
    echo "  !! [$rel] — price signal found:"
    while IFS= read -r line; do
      echo "     $line"
    done <<< "$hits"
    FOUND_PRICES=1
  fi
done

if [ "$FOUND_PRICES" -eq 0 ]; then
  echo "  OK — no price signals found in any page"
fi
echo ""

# ---------------------------------------------------------------------------
# SECTION 4: Perf static signals
# ---------------------------------------------------------------------------
echo "$DIVIDER"
echo "SECTION 4 — PERF STATIC SIGNALS"
echo "$DIVIDER"
echo ""

# 4a. CSS/JS asset sizes
echo "  Asset sizes:"
if [ -f "css/style.css" ]; then
  CSS_BYTES=$(wc -c < "css/style.css" | tr -d ' ')
  CSS_KB=$(python3 -c "print(f'{$CSS_BYTES/1024:.1f} KB')")
  echo "    css/style.css       : $CSS_KB ($CSS_BYTES bytes)"
else
  echo "    css/style.css       : NOT FOUND"
fi

if [ -f "js/main-v2.js" ]; then
  JS_BYTES=$(wc -c < "js/main-v2.js" | tr -d ' ')
  JS_KB=$(python3 -c "print(f'{$JS_BYTES/1024:.1f} KB')")
  echo "    js/main-v2.js       : $JS_KB ($JS_BYTES bytes)"
else
  echo "    js/main-v2.js       : NOT FOUND"
fi
echo ""

# 4b. Image signals (all page HTML files)
echo "  Image signals (across all pages):"
python3 - "$REPO_ROOT" "${HTML_FILES[@]}" <<'PYEOF'
import sys, re, os

repo_root = sys.argv[1]
html_files = sys.argv[2:]

total_imgs = 0
lazy_imgs = 0
wh_imgs = 0

for filepath in html_files:
    try:
        with open(filepath, encoding='utf-8') as fh:
            content = fh.read()
    except Exception:
        continue

    # Find all <img ...> tags
    img_tags = re.findall(r'<img\b[^>]*>', content, re.IGNORECASE | re.DOTALL)
    for tag in img_tags:
        total_imgs += 1
        if re.search(r'loading=["\']lazy["\']', tag, re.IGNORECASE):
            lazy_imgs += 1
        if re.search(r'\bwidth=', tag, re.IGNORECASE) and re.search(r'\bheight=', tag, re.IGNORECASE):
            wh_imgs += 1

eager_imgs = total_imgs - lazy_imgs
print(f"    Total <img> tags    : {total_imgs}")
print(f"    loading=lazy        : {lazy_imgs}  ({eager_imgs} eager/missing)")
print(f"    Has width+height    : {wh_imgs}  ({total_imgs - wh_imgs} missing dimensions)")
PYEOF

echo ""

# 4c. Videos without poster attribute
echo "  Videos missing poster attribute:"
python3 - "$REPO_ROOT" "${HTML_FILES[@]}" <<'PYEOF'
import sys, re, os

repo_root = sys.argv[1]
html_files = sys.argv[2:]

found_any = False
for filepath in html_files:
    rel = os.path.relpath(filepath, repo_root)
    try:
        with open(filepath, encoding='utf-8') as fh:
            content = fh.read()
    except Exception:
        continue

    video_tags = re.findall(r'<video\b[^>]*>', content, re.IGNORECASE | re.DOTALL)
    for tag in video_tags:
        if not re.search(r'\bposter=', tag, re.IGNORECASE):
            # Extract src for context
            src_match = re.search(r'\bsrc=["\']([^"\']+)["\']', tag, re.IGNORECASE)
            src_hint = src_match.group(1)[-60:] if src_match else "(no src attr)"
            print(f"    !! [{rel}] <video> missing poster — src: ...{src_hint}")
            found_any = True

if not found_any:
    print("    OK — all <video> tags have a poster attribute")
PYEOF

echo ""

# 4d. Script loading: sync vs defer/async
echo "  Script loading (sync vs defer/async):"
python3 - "$REPO_ROOT" "${HTML_FILES[@]}" <<'PYEOF'
import sys, re, os
from collections import defaultdict

repo_root = sys.argv[1]
html_files = sys.argv[2:]

sync_scripts = defaultdict(list)
deferred_scripts = defaultdict(list)

for filepath in html_files:
    rel = os.path.relpath(filepath, repo_root)
    try:
        with open(filepath, encoding='utf-8') as fh:
            content = fh.read()
    except Exception:
        continue

    script_tags = re.findall(r'<script\b[^>]*>', content, re.IGNORECASE | re.DOTALL)
    for tag in script_tags:
        # Skip inline scripts and ld+json
        if not re.search(r'\bsrc=', tag, re.IGNORECASE):
            continue
        if re.search(r'application/ld\+json', tag, re.IGNORECASE):
            continue

        src_match = re.search(r'\bsrc=["\']([^"\']+)["\']', tag, re.IGNORECASE)
        src = src_match.group(1) if src_match else "(unknown)"
        # Shorten long URLs
        src_short = src if len(src) <= 70 else "..." + src[-67:]

        has_defer = bool(re.search(r'\bdefer\b', tag, re.IGNORECASE))
        has_async = bool(re.search(r'\basync\b', tag, re.IGNORECASE))

        if has_defer or has_async:
            mode = "defer" if has_defer else "async"
            deferred_scripts[mode].append(f"{rel}: {src_short}")
        else:
            sync_scripts[rel].append(src_short)

total_sync = sum(len(v) for v in sync_scripts.values())
total_deferred = sum(len(v) for v in deferred_scripts.values())

print(f"    Sync (render-blocking): {total_sync}")
for page, srcs in sorted(sync_scripts.items()):
    for s in srcs:
        print(f"      [{page}]  {s}")

print(f"    defer/async: {total_deferred}")
for mode, srcs in sorted(deferred_scripts.items()):
    for s in srcs:
        print(f"      [{mode}]  {s}")
PYEOF

echo ""

# ---------------------------------------------------------------------------
# SECTION 5: Broken internal link check
# ---------------------------------------------------------------------------
echo "$DIVIDER"
echo "SECTION 5 — BROKEN INTERNAL LINKS"
echo "$DIVIDER"
echo "(checks href targets that look local — skips http/https/mailto/tel/# anchors)"
echo ""

python3 - "$REPO_ROOT" "${HTML_FILES[@]}" <<'PYEOF'
import sys, re, os

repo_root = sys.argv[1]
html_files = sys.argv[2:]

# Build set of existing paths relative to repo root
existing = set()
for dirpath, dirnames, filenames in os.walk(repo_root):
    # Skip .git and reference
    dirnames[:] = [d for d in dirnames if d not in ('.git',)]
    for fn in filenames:
        full = os.path.join(dirpath, fn)
        rel = os.path.relpath(full, repo_root)
        existing.add(rel)
        # Also index without .html extension (common href pattern)
        if rel.endswith('.html'):
            existing.add(rel[:-5])

broken_found = False

for filepath in html_files:
    rel_source = os.path.relpath(filepath, repo_root)
    source_dir = os.path.dirname(filepath)
    try:
        with open(filepath, encoding='utf-8') as fh:
            content = fh.read()
    except Exception:
        continue

    hrefs = re.findall(r'\bhref=["\']([^"\']+)["\']', content, re.IGNORECASE)
    for href in hrefs:
        # Skip external, mailto, tel, fragment-only
        if href.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', '//')):
            continue
        # Strip fragment
        href_clean = href.split('#')[0]
        if not href_clean:
            continue
        # Skip CSS/JS links with query strings — these are intentional cache-busting
        # params on local fallback links (CDN-served in production, local in dev)
        if re.search(r'\.(css|js)\?', href_clean):
            continue

        # Resolve relative to repo root (absolute paths) or source dir (relative)
        if href_clean.startswith('/'):
            candidate = href_clean.lstrip('/')
        else:
            candidate = os.path.normpath(os.path.join(os.path.relpath(source_dir, repo_root), href_clean))

        # Check as-is, with .html appended, and index.html inside a dir
        checks = [
            candidate,
            candidate + '.html',
            candidate + '/index.html',
        ]
        found = any(c in existing for c in checks)
        if not found:
            print(f"  !! [{rel_source}]  href='{href}'  → target not found")
            broken_found = True

if not broken_found:
    print("  OK — no broken internal links detected")
PYEOF

echo ""

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo "================================================================"
echo " AUDIT COMPLETE"
echo " Review sections above for !! flags."
echo " For live-URL perf + CrUX, see: reference/audit-harness/lighthouse.md"
echo "================================================================"
