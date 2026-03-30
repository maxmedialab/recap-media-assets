import re

with open('index-standalone.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Match the first <style>...</style> content
css_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if css_match:
    css_content = css_match.group(1).strip()
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(css_content)
    # Replace the style block
    html = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="css/style.css">', html, flags=re.DOTALL)

# Match the custom <script>...</script> block before </body>
# We look for a <script> block that doesn't have a src attribute
# and appears near the end (after external GSAP/Lenis scripts).
# A reliable way: simply search for a script that contains '(() => {'
script_match = re.search(r'<script>\s*\(\(\) => \{(.*?)</script>', html, re.DOTALL)
if script_match:
    script_full = script_match.group(0)
    # The actual JS content is just script_full without <script> tags
    script_code = re.sub(r'</?script>', '', script_full).strip()
    with open('js/script.js', 'w', encoding='utf-8') as f:
        f.write(script_code)
    # Replace it
    html = html.replace(script_full, '<script src="js/script.js"></script>\n')

with open('index-standalone.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Split index-standalone.html successfully.")
