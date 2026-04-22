# Nishant Nahar — Portfolio

> Built from scratch. No frameworks. No templates. Just me, a browser, and a lot of coffee.

---

## ⚡ What is this?

My personal portfolio — a place to showcase my work, my background, and my live coding statistics. I built the entire application from zero using **vanilla HTML, CSS, and JavaScript** because I wanted absolute control over the design and to truly understand every line of code without relying on bloated templates or heavy build steps.

The design strictly follows a premium **Neobrutalism** aesthetic — thick borders, high-contrast black and white, bold typography, stark shadows, and vibrant yellow accents. It's raw, it's fast, and it performs incredibly well.

---

## 🛠️ Features & Highlights

- **Interactive Hero JSON Terminal** — A fully typable, interactive `contenteditable` code block modeled after a VS Code Dark Theme.
- **Dynamic GitHub Repositories** — Automatically fetches, sorts, and displays my top 3 starred public repositories in a sleek, parallel neo-brutalist grid using the GitHub API.
- **Live LeetCode Activity** — Pulls my recent LeetCode submissions via the `alfa-leetcode-api` and maps them to custom difficulty badges.
- **Infinite Tech Marquee** — A smooth, CSS-only scrolling ticker of my technology stack that pauses on hover.
- **Project Showcase** — Filterable project cards (Web / Automation / FOSS) with high-contrast hover interactions.
- **"Currently" Pill Layout** — A space-optimized flex layout displaying what I'm learning, building, and vibing to.
- **Custom UI Details** — Includes custom brutalist scrollbars, vibrant text-selection highlighting, and bespoke 3D text-shadow animations.
- **Contact Form** — Fully validated, sends via Formspree without page reloads.
- **Responsive Design** — Flawlessly adapts to any screen size from ultrawide monitors down to mobile devices.

---

## 💻 Tech Stack

```text
HTML5 + CSS3 + Vanilla JavaScript (That's literally it)
├── Google Fonts — Outfit, Space Grotesk, JetBrains Mono, Caveat
├── FontAwesome 6 — Icons
├── Formspree — Contact form backend
├── GitHub API — Fetches top-starred repositories dynamically
├── ghchart.rshah.org — GitHub contribution calendar rendering
└── alfa-leetcode-api.onrender.com — Live LeetCode recent submissions
```

Zero `npm`. Zero `webpack`. Zero build step. Open `index.html` and it works instantly.

---

## 🚀 Running it Locally

```bash
git clone https://github.com/Its-Nishant-10/portfolio.git
cd portfolio
```

Open `index.html` directly in your browser, or use VS Code Live Server.  
That is genuinely all there is to it.

---

## 📂 Folder Structure

```text
portfolio/
├── contents/
│   ├── pfp.png              ← Profile photo
│   └── (project images...)  ← Various project screenshots
├── index.html               ← The entire HTML structure
├── style.css                ← All styling (CSS Grid, Flexbox, variables, animations)
├── script.js                ← All interactivity (APIs, filtering, typewriter)
└── README.md                ← You are here
```

---

## 🌐 Deploying

It's a pure static site. You can deploy it anywhere instantly:

- **GitHub Pages** → Settings → Pages → select `main` branch → Done.  
- **Vercel** → Import repo → Auto-detects as static → Deploy.  
- **Netlify** → Drag the folder into their UI → Done.

No build commands or configuration files needed.

---

## 🤝 Forking & Customization

Feel free to fork this project! Just remember to swap out my personal details before hosting it. Everything is easily accessible in `index.html` and `script.js`:

- Update the Hero, About, and Contact details in `index.html`.
- Swap the project cards in `.projects_grid`.
- Update the GitHub API usernames in `script.js` to fetch your own repos.
- Update the LeetCode API URL (`/its_nishant/` → your username) in `script.js`.
- Replace the `formspree_url` endpoint in `script.js`.
- Replace social links and CV download links.

---

## 📬 Contact

- **Email** — [nishantnahar2006@gmail.com](mailto:nishantnahar2006@gmail.com)
- **LinkedIn** — [nishantnahar2006](https://www.linkedin.com/in/nishantnahar2006)
- **GitHub** — [Its-Nishant-10](https://github.com/Its-Nishant-10)
- **X (Twitter)** — [@yours_nishant](https://x.com/yours_nishant)

---

&nbsp;  
*Nishant Nahar — 2026*
