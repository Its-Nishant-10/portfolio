# nishant nahar — portfolio

> Built from scratch. No frameworks. No templates. Just me, a browser, and too much coffee.

---

## what is this?

My personal portfolio — a place where I put my work, my story, and my contact info together in one spot. I built the whole thing from zero using vanilla HTML, CSS, and JavaScript because I wanted to actually _understand_ what I was building, not just copy a template.

The design follows **Neobrutalism** — thick borders, hard shadows, bold typography, yellow accents. It looks a little raw on purpose. That's the point.

---

## stuff it does

- **Typewriter intro** — cycles through phrases about how I think about building things
- **Project cards** — image carousels on hover, filter by category (Web / Automation / FOSS), links to live demos and GitHub
- **Infinite tech marquee** — scrolling ticker of my stack, pauses on hover, each icon has its actual brand color
- **About section** — photo, sticky notes, a bit about who I actually am
- **Skill bars** — animated on scroll, per-skill icon colors
- **Toolbox** — every tool I actually use, hover to see the brand color
- **Live coding stats** — GitHub contribution calendar + activity graph pulled live, LeetCode stats from a public API (real numbers, updated automatically)
- **Contact form** — fully validated, sends via Formspree, no refresh
- **Responsive** — works on every screen size from a wide desktop down to a tiny phone

---

## tech used

```text
HTML5 + CSS3 + vanilla JavaScript  (that's literally it)
├── Google Fonts — Space Grotesk, DM Sans, IBM Plex Mono
├── FontAwesome 6 — icons
├── Formspree — contact form backend
├── ghchart.rshah.org — GitHub contribution calendar image
├── github-readme-activity-graph — GitHub activity graph
└── leetcode-api-faisalshohag.vercel.app — LeetCode stats
```

Zero npm. Zero webpack. Zero build step. Open `index.html` and it works.

---

## running it locally

```bash
git clone https://github.com/Its-Nishant-10/portfolio.git
cd portfolio
```

Open `index.html` directly in your browser, or use VS Code Live Server.  
That's genuinely all there is to it.

---

## folder layout

```text
portfolio/
├── contents/
│   ├── pfp.png              ← profile photo
│   ├── netflix_1.jpg        ← project screenshots
│   ├── netflix_4.jpg
│   ├── pdf_2.jpg
│   ├── pdf_3.jpg
│   ├── diet_1.jpg
│   └── diet_2.jpg
├── index.html               ← the whole site
├── style.css                ← all the styling
├── script.js                ← all the JS
└── README.md                ← you are here
```

---

## deploying

It's a static site. Drag it anywhere.

**GitHub Pages** → Settings → Pages → select `main` branch → done.  
**Vercel** → import repo → it auto-detects as static → deploy.  
**Netlify** → drag the folder into their UI → done.

No build settings needed for any of them.

---

## if you want to fork this

Go for it, but please swap out my name/photo/links before putting it online. It's not hard — everything personal is in `index.html`:

- Name, tagline, location in the hero and about sections
- Project cards in `.projects_grid`
- GitHub username in the calendar/graph image URLs
- LeetCode API URL (`/its_nishant_10` → your username)
- Formspree endpoint in `script.js` (`formspree_url`)
- Social links in the contact section and footer
- CV link (currently points to my Google Drive)

---

## a few edge cases worth knowing

- The LeetCode API (`leetcode-api-faisalshohag.vercel.app`) is a free third-party wrapper. If it's down, the stats panel just keeps the fallback numbers from the HTML — it doesn't crash anything.
- The GitHub graphs are external images — if they take a second to load on slow connections, that's expected.
- The contact form uses Formspree's free tier (50 submissions/month). If you're forking this for heavy use, sign up for your own endpoint.
- The marquee animation is paused when `prefers-reduced-motion` would normally kill it — I made a specific exclusion so it still scrolls, since it's purely decorative and content-informational.

---

## contact

- **Email** — [nishantnahar2006@gmail.com](mailto:nishantnahar2006@gmail.com)
- **LinkedIn** — [nishantnahar2006](https://www.linkedin.com/in/nishantnahar2006)
- **GitHub** — [Its-Nishant-10](https://github.com/Its-Nishant-10)
- **X** — [@yours_nishant](https://x.com/yours_nishant)

---

&nbsp;  
_Nishant Nahar — 2025_
