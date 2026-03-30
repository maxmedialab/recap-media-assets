# Website SOP: Hybrid Architecture (AI + GitHub + GHL)

Type: Resource
Archived: No
Projects: Month 1: Recap Media — Website Fix & SEO Foundation (https://www.notion.so/Month-1-Recap-Media-Website-Fix-SEO-Foundation-2a2bd2294b00800e83d4ddc990c188ac?pvs=21), RecapMedia SOPs & Outsourcing  (https://www.notion.so/RecapMedia-SOPs-Outsourcing-317bd2294b0080d1abeec19738cc73a1?pvs=21)

# 📌 1. The Core Strategy

This website utilizes a **Hybrid Global Workflow**. We leverage AI ("vibe-coding") to quickly generate premium, custom-coded designs (HTML/CSS/JS) that bypass GoHighLevel's rigid drag-and-drop builder.

However, to keep GHL's powerful CRM, automations, and tracking intact, we host the frontend logic externally on GitHub and inject it into GHL using a CDN.

**The Golden Rule:**

- **Global Styles (CSS) & Logic (JS)** live in GitHub.
- **Structural Content (HTML)** and **Lead Capture Forms** live in GoHighLevel.

---

# 🔗 2. The Source of Truth (Links & Assets)

- **GitHub Repository:** `maxmedialab/recap-media-assets`
- **Live CSS CDN Link:** `https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets/css/style.css`
- **Live JS CDN Link:** `https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets/js/main-v2.js`
- *(Note: To bypass browser caching when testing new code immediately, you can append a version string to your JS link inside GHL, e.g., `main-v2.js?v=3`)*

---

# 🛠 3. How to Make Edits (The Workflow)

## Scenario A: Changing Colors, Fonts, Animations, or Global Styling

Do **not** open GoHighLevel.

1. Open your project in your IDE (Cursor/VS Code).
2. Edit `style.css` or `main-v2.js`.
3. Push the changes to your public GitHub repository.
4. The live website will automatically update via the jsDelivr CDN.

## Scenario B: Changing Text, Images, or Adding a New Page

1. Use your AI to generate the pure HTML for the new section.
2. Open GoHighLevel and navigate to the specific page.
3. Open the **Custom HTML/JavaScript** element.
4. Paste the updated HTML inside the `<main>...</main>` tags.
5. Hit Save in GHL.

---

# 🧩 4. GoHighLevel Architecture Setup

## A. Global Tracking Codes (The Injection)

To ensure every page receives your custom styling and logic, your CDN links must be injected at the site level.

- **Location:** GHL > Sites > Websites > Recap Media > Settings
- **Head Tracking Code:** `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets/css/style.css">`
- **Body/Footer Tracking Code:** `<script src="https://cdn.jsdelivr.net/gh/maxmedialab/recap-media-assets/js/main-v2.js"></script>`

## B. Global Sections (Nav & Footer)

To avoid copy-pasting your header and footer across 10 different pages:

1. Create your `<nav>` HTML inside a Custom HTML block in GHL.
2. Save that GHL Section as a **Global Section** named "Global Header".
3. Do the same for your `<footer>` HTML and save it as "Global Footer".
4. Drag and drop these Global Sections onto any new page you create. Updating the Global Section once will update the navbar/footer site-wide.

---

# 🛡 5. The Core Workarounds (The "Secret Sauce")

Because GoHighLevel tries to force everything into its own layout, we employ three critical workarounds to make the custom code function perfectly.

## Workaround 1: The GHL Bulletproof Breakout

**The Problem:** GHL wraps custom code in invisible ~1140px containers, causing white pillars on the sides of the site.

**The Fix:** This code is permanently housed at the top of your `style.css` file in GitHub. It forces your `<main>` tag to rip through GHL's constraints and snap to the edges of the monitor.

```css
/* GHL BULLETPROOF BREAKOUT */
body { overflow-x: hidden !important; }

main, footer.footer {
    width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    margin: 0 !important;
    max-width: none !important;
}
```

*Note: In GHL's UI, you must still ensure the Section and Row holding your custom code have their padding/margins set to 0.*

## Workaround 2: The FOUC Preloader

**The Problem:** Because GHL loads HTML instantly but takes a millisecond to fetch your CSS from GitHub, the site "flashes" unstyled, broken content before snapping into place.

**The Fix:** A pure inline HTML/CSS/JS preloader placed at the very top of your **Global Header** in GHL. It covers the screen in dark `#0C0A10` with an ember spinner, fading out only when the CDN finishes loading.

```html
<style>
  #recap-preloader { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #0C0A10; z-index: 999999; display: flex; justify-content: center; align-items: center; transition: opacity 0.4s ease; }
  .recap-spinner { width: 48px; height: 48px; border: 3px solid rgba(255, 255, 255, 0.05); border-top-color: #E8593C; border-radius: 50%; animation: recap-spin 1s linear infinite; }
  @keyframes recap-spin { to { transform: rotate(360deg); } }
</style>
<div id="recap-preloader"><div class="recap-spinner"></div></div>
<script>
  window.addEventListener('load', function() {
    var preloader = document.getElementById('recap-preloader');
    if (preloader) { preloader.style.opacity = '0'; setTimeout(function() { preloader.style.display = 'none'; }, 400); }
  });
</script>
```

## Workaround 3: The Hidden Form Bridge

**The Problem:** Custom HTML forms do not natively trigger GHL automations, add tags, or create contacts in the CRM.

**The Fix:**

1. Build a beautiful custom form in your HTML. Give every input a specific ID (e.g., `id="visible-first-name"`).
2. Create a standard GHL form. Drop it onto the page inside a `<div class="ghl-form-hidden">` (which hides it via CSS).
3. The `form-bridge.js` script (located in your `main-v2.js` file on GitHub) listens for keystrokes in your beautiful custom form and maps them instantly to the hidden GHL form.
4. When the user clicks "Submit" on your custom form, the script artificially clicks "Submit" on the hidden GHL form, securely passing the data to your CRM and triggering your workflows.

---

# 🤖 6. AI Prompt Template for Future Edits

When you want to update your site using an AI (like Cursor), feed it this prompt alongside your request so it understands your architecture:

> *"I need to update my website. The frontend is fully custom and injected into GoHighLevel. The CSS and JS are hosted externally on GitHub. The HTML is pasted directly into GoHighLevel.*
> 

> 
> 

> *My request: [INSERT WHAT YOU WANT TO CHANGE]*
> 

> 
> 

> *Rules:*
> 

> *1. If this requires styling or animation changes, output ONLY the CSS/JS to be updated in my `style.css` or `main-v2.js` files.*
> 

> *2. If this requires structure/text changes, output ONLY the pure HTML snippet I need to paste into GoHighLevel.*
> 

> *3. Do NOT provide inline `<style>` or `<script>` tags unless explicitly asked. Maintain the separation of concerns."*
>