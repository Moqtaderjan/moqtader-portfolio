/* main.js — navigation, data loading, and card rendering.
   Animation timelines (GSAP/ScrollTrigger) live in animations.js. */

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initScrollReveal();
  initVideoFallbacks();
  loadProjectData();
});

/* ---------- mobile nav ---------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );
}

/* ---------- lightweight scroll reveal (fallback if GSAP fails to load) ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- pull project data from data/projects.json ---------- */
async function loadProjectData() {
  try {
    const res = await fetch("data/projects.json");
    const data = await res.json();
    renderCaseStudy(data.caseStudy);
    renderBestWork(data.bestWork);
  } catch (err) {
    console.warn("Could not load data/projects.json — check the path if running locally without a dev server.", err);
  }
}

function renderCaseStudy(caseStudy) {
  const grid = document.querySelector("#version-grid");
  if (!grid || !caseStudy) return;

  const timeline = document.querySelector("#timeline-strip");
  if (timeline) {
    timeline.innerHTML = caseStudy.versions
      .map((v) => `<span>${v.code} · ${v.timecode}</span>`)
      .join("");
  }

  grid.innerHTML = caseStudy.versions
    .map(
      (v) => `
    <article class="version-card reveal">
      <div class="work-media version-media" data-video="${v.file}" data-poster="${v.poster}">
        <span class="version-code">${v.code}</span>
        ${playGlyphSVG()}
      </div>
      <div class="version-body">
        <h4>${v.name}</h4>
        <span class="version-timecode">${v.timecode}</span>
        <p class="version-detail"><b>Opening:</b> ${v.opening}</p>
        <p class="version-detail"><b>Captions:</b> ${v.captions}</p>
        <p class="version-detail"><b>Pacing:</b> ${v.pacing}</p>
        <p class="version-why">${v.whyTest}</p>
      </div>
    </article>`
    )
    .join("");

  attachVideoHandlers(grid);
}

function renderBestWork(items) {
  const grid = document.querySelector("#work-grid");
  if (!grid || !items) return;
  // The Best Work section now has real, hand-written cards in index.html.
  // Don't overwrite them with placeholder JSON cards.
  if (grid.querySelector('.work-card')) return;

  grid.innerHTML = items
    .map(
      (item) => `
    <article class="work-card reveal">
      <div class="work-media" data-video="${item.video}" data-poster="${item.poster}">
        ${playGlyphSVG()}
      </div>
      <div class="work-body">
        <span class="work-tag">${item.type}</span>
        <h4>${item.title}</h4>
        <p class="work-role"><b>My role:</b> ${item.role}</p>
      </div>
    </article>`
    )
    .join("");

  attachVideoHandlers(grid);
}

function playGlyphSVG() {
  return `<span class="play-glyph" aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
  </span>`;
}

function initVideoFallbacks() {
  document.querySelectorAll("video").forEach((video) => {
    const media = video.closest(".work-media, .version-media");
    if (!media) return;

    if (!video.poster) {
      video.poster = "assets/images/video-placeholder.svg";
    }

    const fallback = document.createElement("div");
    fallback.className = "video-fallback";
    fallback.innerHTML = "Video unavailable<br>Media file missing";
    media.appendChild(fallback);

    video.addEventListener("error", () => {
      video.style.display = "none";
      media.classList.add("video-unavailable");
    });
  });
}

/* Click-to-play: keeps initial page load light — no autoplaying video tags.
   Only used now by the Featured Case Study placeholder cards, since Best
   Work uses real <video> tags directly in the HTML. */
function attachVideoHandlers(scope) {
  scope.querySelectorAll("[data-video]").forEach((cell) => {
    cell.addEventListener("click", () => {
      const src = cell.getAttribute("data-video");
      const poster = cell.getAttribute("data-poster") || "";
      const video = document.createElement("video");
      video.src = src;
      video.poster = poster;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.addEventListener("error", () => {
        cell.innerHTML = `<span style="font-family:var(--font-mono);font-size:11px;color:var(--text-faint);padding:0 16px;text-align:center;">
          Add file at<br>${src}
        </span>`;
      });
      cell.innerHTML = "";
      cell.appendChild(video);
    }, { once: true });
  });
}
