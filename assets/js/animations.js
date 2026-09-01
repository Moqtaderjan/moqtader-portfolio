/* animations.js — GSAP ScrollTrigger reveals + the hero hook-cycler.
   Loaded after GSAP/ScrollTrigger via CDN in index.html. Everything in
   here degrades gracefully: if GSAP fails to load, main.js's
   IntersectionObserver fallback still reveals content. */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    initScrollTimelines(prefersReducedMotion);
  }

  initHookCycler(prefersReducedMotion);
});

/* ---------- section-entrance timelines ---------- */
function initScrollTimelines(reduced) {
  if (reduced) {
    gsap.set(".reveal", { opacity: 1, y: 0 });
    return;
  }

  // Batch so cards inside dynamically-rendered grids (case study / best work)
  // still animate once main.js has injected them.
  const start = () => {
    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
        }),
      once: true,
    });
  };

  // Give main.js's fetch() a moment to inject case-study / work cards
  // before ScrollTrigger scans the DOM for .reveal targets.
  setTimeout(start, 300);

  gsap.utils.toArray(".flow").forEach((flow) => {
    gsap.from(flow, {
      scrollTrigger: {
        trigger: flow,
        start: "top 85%",
      },
      opacity: 0,
      y: 16,
      duration: 0.6,
      ease: "power2.out",
    });
  });
}

/* ---------- hero signature: phone mock cycling through HVAC hook styles ---------- */
function initHookCycler(reduced) {
  const hooks = [
    {
      tag: "PROBLEM HOOK",
      line: "Still paying for a heating system that's barely heating?",
    },
    {
      tag: "QUESTION HOOK",
      line: "What if your heating system is costing you more than it should?",
    },
    {
      tag: "BENEFIT HOOK",
      line: "Upgrade your heating system and save on energy costs.",
    },
    {
      tag: "BOLD TEXT HOOK",
      line: "YOUR OLD SYSTEM IS THE PROBLEM.",
    },
  ];

  const tagEl = document.querySelector("#hook-tag");
  const lineEl = document.querySelector("#hook-line");
  const progressEl = document.querySelector("#hook-progress");
  const strip = document.querySelectorAll("#hook-strip span");
  const timecodeEl = document.querySelector("#hook-timecode");

  if (!tagEl || !lineEl) return;

  let index = 0;
  const DURATION = 3200;

  function setActiveDot() {
    strip.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function showHook() {
    const hook = hooks[index];

    tagEl.textContent = hook.tag;
    lineEl.textContent = hook.line;

    setActiveDot();

    if (timecodeEl) {
      timecodeEl.textContent = `00:0${index}  /  00:${String(
        hooks.length - 1
      )}`;
    }

    if (window.gsap && !reduced) {
      gsap.fromTo(
        [tagEl, lineEl],
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.06,
        }
      );

      if (progressEl) {
        gsap.fromTo(
          progressEl,
          { width: "0%" },
          {
            width: "100%",
            duration: DURATION / 1000,
            ease: "none",
          }
        );
      }
    } else {
      tagEl.style.opacity = 1;
      lineEl.style.opacity = 1;

      if (progressEl) {
        progressEl.style.width = "100%";
      }
    }
  }

  // Show the first hook immediately.
  showHook();

  // Preserve the original phone-style cycling animation.
  if (!reduced) {
    setInterval(() => {
      index = (index + 1) % hooks.length;

      if (progressEl) {
        progressEl.style.width = "0%";
      }

      showHook();
    }, DURATION);
  }
}