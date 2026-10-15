# Women Powering Change Florida

Website for **Women Powering Change Florida** — *Fueling Women. Sparking Change.*

A fast, dependency-free static site (HTML + CSS + a little JavaScript). No build step: open `index.html` in a browser or deploy the folder as-is.

```
index.html              The one-page site
volunteer.html          Volunteer sign-up form
media-kit.html          Media kit / brand guidelines (logos, colors, fonts, messages, QR)
terra-tominelli.html    Board member bio + résumé (copy it for each new board member)
404.html                "Page not found" page
assets/css/styles.css   All styling (brand colors are CSS variables at the top)
assets/js/main.js       Link settings + mobile menu
assets/img/             Logo (full color + one-color navy/white), favicon, icon sprite, website QR code
assets/downloads/       Media kit PDF and print-size QR code PNG
assets/img/photos/      Section photos (see "Photos" below)
assets/fonts/           Self-hosted web fonts
```

## Before launch: what the client still needs to provide

| Item | Where to put it |
| --- | --- |
| Official logo file | Save it in `assets/img/` and change the `assets/img/logo.svg` references in the HTML pages. The current logo (and `logo-navy.svg` / `logo-white.svg`) is a stand-in in the brand colors, so replace those too and re-export the media kit PDF. |
| Terra Tominelli headshot | Save as `assets/img/team/terra-tominelli.jpg` (portrait, about 800×1000). It appears on the Team card, her bio page and the media kit. |
| Zeffy vendor registration URL | `vendorRegistration` in `SITE_CONFIG` |
| Sponsorship / donation URL | `sponsorship` in `SITE_CONFIG` |
| Event registration links | `eventRegistration`, `communityEvent` in `SITE_CONFIG` |
| Supported-organization websites | `orgHaven`, `orgMothersHelpingMothers`, … in `SITE_CONFIG` |
| Board & volunteer names, titles, photos | `#team` section of `index.html`. See "Photos" below. |
| Event details (date, location, tickets) | `#events` section of `index.html` |

## Volunteer sign-up form

`volunteer.html` collects: full name, address, telephone, email, business owner (yes/no, plus an optional business name), talents, interests, hobbies, hours per month, morning/evening preference, and "tell us about yourself". Required fields are checked in the browser with friendly error messages, and a hidden "honeypot" field filters out spam bots.

**Where submissions go:**

- **Hosted on Netlify (recommended):** nothing to set up. Netlify Forms detects the form on deploy. Submissions show under *Site → Forms → volunteer-signup*, and you can turn on email notifications under *Forms → Form notifications*. The free tier includes 100 submissions a month.
- **Any other host (GitHub Pages, etc.):** create a free form endpoint at a service like [Formspree](https://formspree.io) and paste its URL into `volunteerFormEndpoint` in `SITE_CONFIG` (`assets/js/main.js`). Submissions are then emailed to you.

If neither is set up, visitors see an error asking them to try again, so set one up before launch.

## Photos

The design has photo frames in four places. Until a photo file exists, each frame shows a branded gradient with an icon, so the site looks finished either way. To add photos, save a JPG with the matching name into `assets/img/photos/`:

| File | Where it appears | Suggested subject |
| --- | --- | --- |
| `hero-women.jpg` | Hero, large arched frame | A group of women together, smiling |
| `hero-volunteers.jpg` | Hero, top right | Volunteers sorting or packing donations |
| `hero-rescue.jpg` | Hero, bottom right | A woman with a rescue dog or cat |
| `give-together.jpg` | "Every woman has something valuable to give" | Women business owners collaborating |

Use landscape or square photos around 1600px on the long side, compressed to about 300 KB or less. Real photos from the organization's own events are best. Free stock options include [Unsplash](https://unsplash.com/license) and [Pexels](https://www.pexels.com/license/), which allow commercial use without attribution.

Board and volunteer photos: add `<img src="assets/img/team/name.jpg" alt="">` inside that person's `.photo` element in `index.html`.

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

## Credits

- Fonts: [Fraunces](https://github.com/undercasetype/Fraunces) and [Plus Jakarta Sans](https://github.com/tokotype/PlusJakartaSans), SIL Open Font License, self-hosted.
- Icons: [Lucide](https://lucide.dev), ISC License.


## Media kit

`media-kit.html` is the brand guide for partners, sponsors and press. Its "Download Media Kit (PDF)" button serves `assets/downloads/wpc-media-kit.pdf`. After changing the page, re-export the PDF: open `media-kit.html` in Chrome, then Print → Save as PDF, Letter, default margins, **Background graphics on**, Scale 72%. That gives 2 pages.

The website QR code (`assets/img/qr-website.svg`, `assets/downloads/wpc-qr-website.png`) points to `https://womenpoweringchange.netlify.app/`. If the site moves to its own domain, regenerate both so printed flyers stay correct.

## QR info page (`/info`)

`info.html` is a one-screen, phone-first page for people who scan a flyer. The QR code `assets/img/qr-info.svg` / `assets/downloads/wpc-qr-info.png` points to `https://womenpoweringchange.netlify.app/info`, which `_redirects` serves from `info.html` on Netlify. When the full site is ready, change the rule in `_redirects` to `/info  /  302`: every printed QR code then opens the full site, with no reprinting.
