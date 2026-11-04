# Sanjeet Kumar - Portfolio

A static website (HTML, CSS, JavaScript). No build step and no installs.

## Run it in VS Code
1. Unzip the folder and open it in VS Code (File > Open Folder).
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**.

You can also just double-click `index.html` to open it in a browser.
An internet connection is needed for the Google Fonts (Archivo, Instrument Sans, IBM Plex Mono).

## Files
- `index.html` - page content (all sections, text, links)
- `style.css` - design tokens, layout and animations
- `script.js` - preloader, spoken introduction, scroll animations, data story, quick-jump menu
- `assets/` - portrait, certificate images and the looping background video (`hero-bg.mp4`)

## Easy edits
- **Text, links, email, phone:** `index.html` (search for the text you want to change).
- **Walking video / your own recorded voice:** at the top of `script.js` set
  `var MEDIA = { video: "assets/walk.mp4", image: "", audio: "assets/intro.mp3" };`
  and put the files in `assets/`. The video plays unmirrored; the audio replaces the browser voice.
- **Spoken introduction text:** `INTRO_TEXT` in `script.js`.
- **Colours:** the `:root` block at the top of `style.css`.

## Notes
- The browser voice depends on the visitor's device. A recorded audio file gives the same voice everywhere.
- Quick-jump menu: press Ctrl+K (Cmd+K on Mac).
- To publish for free: upload this folder to GitHub and enable GitHub Pages, or drag it into Netlify.

## Background video
`assets/hero-bg.mp4` is an 8-second looping animation (data lines, nodes and bars) shown behind the hero.
To use your own video, replace that file with another short, muted MP4 (keep it under about 2 MB).

---

# Added features (v2)

Everything below was ADDED. `style.css` and `script.js` are byte-for-byte unchanged, and `index.html` only gained lines.
New code lives in `features/` (`features.css`, `features.js`, `config.js`, `data/`), plus `404.html`, `robots.txt`, `_headers`, `scripts/`.

| # | Feature | Where / how |
|---|---------|-------------|
| 1 | Resume view and download | "Resume" section (preview opens in the existing viewer, View PDF, Download PDF). File: `assets/Sanjeet_Kumar_Resume.pdf` (replace it to update) |
| 2 | GitHub live statistics | Under Projects. Public GitHub API, no token, cached 30 min. Username: `GITHUB_USERNAME` |
| 3 | Power BI dashboard gallery | Section appears only when `features/data/dashboards.js` has real entries (format documented in that file) |
| 4 | Project filters and search | Toolbar at the top of Projects |
| 5 | Project case studies | "Read the case study" under each project (only facts from the CV and the live site) |
| 6 | Portfolio assistant | "Ask about Sanjeet" button. Answers come from `features/data/facts.js`; it says so when something is not documented. Optional `ASSISTANT_ENDPOINT` |
| 7 | Contact form | Validated; sends to `FORM_ENDPOINT` if set, otherwise opens the visitor's email app (mailto) |
| 8 | Skills explorer | "Skills in practice": shows where each skill is evidenced. No self-rated percentages |
| 9 | Certificate verification | "Verify credentials" under Certifications (Credly, Sunstone, Codec) |
| 10 | Recruiter section | "For recruiters". Availability shows only what you set in `AVAILABILITY_STATUS` |
| 11 | Portfolio QR code | Appears when `SITE_URL` is set or the site is served over https; PNG/SVG download |
| 12 | Visitor analytics | Off by default. Plausible, Umami or GA4 via env vars. Respects Do Not Track / Global Privacy Control |
| 13 | Testimonials | Section appears only when `features/data/testimonials.js` has real entries |
| 14 | Scroll progress | The red top bar already existed; the new back-to-top button adds a progress ring |
| 15 | Back to top | Appears after scrolling |
| 16 | SEO and Open Graph | Generated into `<head>`; set `SITE_URL` for absolute URLs, sitemap and canonical |
| 17 | Accessibility | Skip link, labelled form with live errors, focus return and trap in dialogs, "(opens in a new tab)" hints, reduced-motion support |
| 18 | Performance | Scripts deferred, GitHub data and QR library load only when scrolled near, hero image preload, async image decoding, cache headers |
| 19 | 404 page | `404.html` (works on GitHub Pages, Netlify, Cloudflare Pages) |

## Configure (optional)
```
cp .env.example .env      # fill in only what you need
node scripts/configure.mjs
```
This rewrites `features/config.js`, the SEO block in `index.html`, `robots.txt`, `sitemap.xml` and the 404 home link.
Only public values go in. Never put API keys in this project: if you add an AI endpoint, keep its key on that server.

## Add real content later
- Dashboards: add screenshots to `assets/dashboards/` and entries to `features/data/dashboards.js`.
- Testimonials: add real, permitted quotes to `features/data/testimonials.js`.
- Assistant knowledge: edit `features/data/facts.js`.
