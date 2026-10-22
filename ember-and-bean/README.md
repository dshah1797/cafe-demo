# Ember & Bean: Café Website Demo

A static, premium café website concept built by **Netra Dynamics** to show café owners in Vadodara what a professional website can look like.

> **Disclosure:** Ember & Bean is a **fictional café**. The menu, prices, hours, address, contact details and testimonials are **placeholders**. The reservation form is a **demonstration** and sends nothing. Photography is from [Unsplash](https://unsplash.com).

Stack: HTML5, CSS3, vanilla JavaScript, Google Fonts. No framework, no backend, no database, no paid service.

## Folder structure

```
ember-and-bean/
├── index.html    page content and SEO metadata
├── style.css     design tokens and all styling
├── script.js     CONFIG block, menu tabs, form validation, WhatsApp, lightbox
└── README.md
```

## Run locally

Option 1: double-click `index.html`. It works from the file system.

Option 2 (closer to production), from inside the `ember-and-bean` folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. On a phone on the same Wi-Fi, open `http://<your-computer-ip>:8000`.

An internet connection is needed for the fonts and photos.

## Deploy to Vercel via GitHub

1. Create a new GitHub repository (for example `ember-and-bean-demo`).
2. From inside the `ember-and-bean` folder:
   ```bash
   git init
   git add .
   git commit -m "Ember & Bean demo"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ember-and-bean-demo.git
   git push -u origin main
   ```
3. Go to <https://vercel.com>, sign in with GitHub and click **Add New → Project**.
4. Import the repository. Leave **Framework Preset** as `Other`, and leave Build Command and Output Directory empty.
5. Click **Deploy**. You get a URL like `https://ember-and-bean-demo.vercel.app`.

Every `git push` to `main` redeploys automatically. GitHub Pages also works: **Settings → Pages → Deploy from branch → main / root**.

## Customising

### Café name
Search and replace `Ember & Bean` / `Ember &amp; Bean` in `index.html` (page title, meta tags, logo, footer, ribbon), and `cafeName` in `script.js`. The logo is plain text and CSS (`.logo` in `style.css`), with the monogram in `.logo__mark`.

### Colours and fonts
Edit the variables at the top of `style.css` (`--cream`, `--espresso`, `--olive`, `--ember`, `--serif`, `--sans`). If you change fonts, update the Google Fonts `<link>` in `index.html`.

### Menu items and prices
In `index.html`, find the `<article class="dish">` blocks inside each `panel-…` section. Edit the `<h4>` (name), `<span class="dish__price">` (price) and `<p>` (description). Copy a whole `<article>` to add an item.

### Images
Each image is an Unsplash URL like `https://images.unsplash.com/photo-<ID>?...&w=800`. To use the client's own photos, drop files into an `images/` folder and replace the `src` (and remove `srcset`/`sizes`, or provide resized copies). Keep descriptive `alt` text. Use JPG or WebP, around 1600px wide for large images and 800px for others. If an image fails to load, a neutral monogram tile appears in its place.

### WhatsApp number, maps and social links
All in the `CONFIG` block at the top of `script.js`:

| Setting | Format | Effect |
| --- | --- | --- |
| `whatsappNumber` | digits only with country code, e.g. `"919876543210"` | Opens `wa.me` with the enquiry prefilled. While it is the placeholder, WhatsApp opens with the message ready and lets you choose a contact. |
| `mapsUrl` | a verified Google Maps link | Activates the "Get Directions" button. Empty means the button stays inactive and explains why. |
| `netraUrl` | the real Netra Dynamics URL | Shows the "Talk to Netra Dynamics" button and links the footer credit. Empty means they stay hidden or unlinked. |
| `social` | profile URLs | Activates footer social links. |
| `firstSlot` / `lastSlot` / `bookAheadDays` | `"08:00"`, `"22:30"`, `60` | Reservation time slots and date range. |

### Address, phone, email, hours
Search `index.html` for `[Café address placeholder]`, `XXXXX`, `yourcafe.example` and `demo` to find every placeholder (Visit Us section and footer). Remove the "demo" labels, ribbon and sample flags when turning this into a real client's site.

### Search indexing
`index.html` contains `<meta name="robots" content="noindex, nofollow">` because this is a fictional demo. **Delete that line** for a real client site, and add a canonical URL plus real Open Graph image and LocalBusiness structured data.

## Testing checklist

**Links and buttons**
- [ ] Logo, Menu, Our Story, Gallery, Visit Us and Reserve a Table scroll to the right sections.
- [ ] "Explore Our Menu" goes to the menu, "Find Us" to Visit Us.
- [ ] Footer quick links all work. Placeholder social links look inactive.
- [ ] "Get Directions" shows the "not linked yet" note (or opens your Maps link once configured).
- [ ] Back-to-top button appears after scrolling and returns to the top.

**Mobile navigation**
- [ ] Hamburger opens and closes a full-screen menu; selecting a link closes it; Esc closes it.
- [ ] Page behind the open menu does not scroll.

**Menu**
- [ ] All four category tabs switch content; arrow keys move between tabs.
- [ ] Every dish has an image, name, description and ₹ price.

**Gallery**
- [ ] Each photo opens in the viewer; clicking outside or the × closes it.

**Reservation form**
- [ ] Submitting empty shows errors for name, phone, date, time and guests, and focuses the first.
- [ ] Phone rejects fewer than 10 digits or numbers not starting 6–9; accepts `98765 43210` and `+91 98765 43210`.
- [ ] Past dates are blocked; choosing today with a time already passed shows an error.
- [ ] A valid submission shows the "demo, nothing sent" summary, not a confirmation.
- [ ] "Enquire on WhatsApp" opens WhatsApp with the prefilled message (form details if valid, general enquiry if not).

**Responsiveness** (browser dev tools, then a real phone)
- [ ] 360, 390, 768, 1024 and 1440 px: no horizontal scrolling, no overlapping text, hero fits the first screen.
- [ ] Buttons and form fields are comfortable to tap.

**Images and performance**
- [ ] All photos load (block `images.unsplash.com` in dev tools to confirm the monogram fallback appears).
- [ ] Turn on "Reduce motion" in OS settings: reveal and zoom animations stop.
- [ ] Run Lighthouse (mobile) and check Performance, Accessibility and SEO.

## Credits

Photography via Unsplash. Fonts: Cormorant Garamond and DM Sans (Google Fonts).
