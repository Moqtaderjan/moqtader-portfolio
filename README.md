# Video Editor Portfolio — Varsity Heating & Cooling Application

A single-page, static portfolio built to apply for the Part-Time Video
Editor & Content Assistant role. Pure HTML/CSS/JS — no build step, no
server, deploys directly to GitHub Pages for free.

## Structure

```
index.html                  Single-page site
assets/css/style.css        Layout, components, design tokens
assets/css/animations.css   Keyframes and hover/scroll transition rules
assets/js/main.js           Nav, JSON-driven case-study rendering, click-to-play video
assets/js/animations.js     GSAP ScrollTrigger reveals + hero hook-cycler
assets/videos/              Your real video files go directly in this folder
assets/videos/case-study/   (unused) placeholder clips — featured case study currently uses two variations
assets/thumbnails/case-study/  Poster images for the case-study placeholders
data/projects.json          Content for the case-study rendering; edit only if you add or change case-study files
                             (Best Work cards are now hand-written in index.html)
```

## Current status

- **Best Work section (4 real videos):** done. `entrepreneurship-talking.mp4`,
  `life-without-social-media.mp4`, `media-key.mp4`, and
  `varsity-hvac-style-study.mp4` all load directly from `assets/videos/`.
  Drop the actual files in there with those exact names and they'll play.
**Featured Case Study:** The featured case-study section currently uses two curated variations from the same source footage. If you later add more variations, update `data/projects.json` or drop files into `assets/videos/` and reference them from the JSON.

## Before you publish — replace these placeholders

- [ ] `assets/images/logo-transp.png` — the nav now expects a real logo file here
- [ ] `assets/images/favicon.png` (optional)
-- [ ] If you add additional case-study variations, update `data/projects.json` or add files to `assets/videos/` and reference them from the JSON.
- [ ] Add any other editing tools you actually use to the Tools section

Name, email, and the four Best Work videos are already filled in with your
real information — nothing else to swap there.

**One thing to watch for on Windows:** always use forward slashes in file
paths inside `index.html` and `projects.json` (`assets/videos/name.mp4`),
even though Windows Explorer shows backslashes. Backslash paths work on
your own machine but break once pushed to GitHub Pages.

## Run it locally

You can just double-click `index.html` — but the `fetch("data/projects.json")`
call in `main.js` needs an actual server context in most browsers (it won't
work over a bare `file://` path in Chrome). Easiest fix, from this folder:

```bash
# Python (already on most machines)
python3 -m http.server 8000
# then open http://localhost:8000
```

Or use the VS Code "Live Server" extension and click "Go Live."

## Deploy to GitHub Pages (free)

1. Create a new GitHub repo and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Source → Deploy from a branch → `main` / `root`**.
3. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

No server, no database, no build pipeline — everything runs client-side.
