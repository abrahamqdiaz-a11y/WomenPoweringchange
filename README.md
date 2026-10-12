# Women Powering Change Florida

Website for **Women Powering Change Florida** — *Fueling Women. Sparking Change.*

A fast, dependency-free static site (HTML + CSS + a little JavaScript). No build step: open `index.html` in a browser or deploy the folder as-is.

```
index.html              The one-page site
404.html                "Page not found" page
assets/css/styles.css   All styling (brand colors are CSS variables at the top)
assets/js/main.js       Link settings + mobile menu
assets/img/             Logo and favicon
```

## Before launch: what the client still needs to provide

| Item | Where to put it |
| --- | --- |
| Official logo file | Save it in `assets/img/` and change the two `assets/img/logo.svg` references in `index.html` (header + hero). The current logo is a stand-in in the brand colors. |
| Contact email | `email` in `SITE_CONFIG` (`assets/js/main.js`) |
| Zeffy vendor registration URL | `vendorRegistration` in `SITE_CONFIG` |
| Sponsorship / donation URL | `sponsorship` in `SITE_CONFIG` |
| Event registration links | `eventRegistration`, `communityEvent` in `SITE_CONFIG` |
| Supported-organization websites | `orgHaven`, `orgMothersHelpingMothers`, … in `SITE_CONFIG` |
| Board & volunteer names, titles, photos | `#team` section of `index.html`. Put photos in `assets/img/team/` and replace the `+` in an `.avatar` with `<img src="assets/img/team/name.jpg" alt="">`. |
| Event details (date, location, tickets) | `#events` section of `index.html` |

### How the link settings work

Every button that leads off-site has a `data-link="key"` attribute. `assets/js/main.js` fills in its URL from `SITE_CONFIG`:

```js
const SITE_CONFIG = {
  email: "hello@example.org",
  vendorRegistration: "https://www.zeffy.com/...",
  // ...
};
```

While a value is empty (`""`), its button shows a "Coming Soon" label and can't be clicked, and an organization's "Learn More" link stays hidden. Visitors never land on a broken link. External links open in a new tab.

## Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Any static host will work:

- **GitHub Pages:** Settings → Pages → deploy from branch, folder `/ (root)`.
- **Netlify / Cloudflare Pages / Vercel:** connect this repo, leave the build command empty, and set the publish directory to `/`.

`404.html` is picked up automatically by GitHub Pages, Netlify, and Cloudflare Pages.
