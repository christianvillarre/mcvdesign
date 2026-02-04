gsap.registerPlugin(ScrollTrigger);

/* -----------------------------------------
   LETTER ANIMATION
----------------------------------------- */
function animateLetters(container, opts = {}) {
  const spans = container.querySelectorAll("span");
  return gsap.to(spans, {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: opts.duration ?? 0.75,
    ease: "power3.out",
    stagger: opts.stagger ?? 0.05
  });
}

/* -----------------------------------------
   INTRO (fade + lift)
----------------------------------------- */
function introBox(box, opts = {}) {
  const shapes = box.querySelectorAll(".shape");
  const word   = box.querySelector(".word, .mini-word");

  gsap.set(shapes, { opacity: 0, scale: 0.82, y: 22, rotate: -8 });
  if (word) {
    gsap.set(word.querySelectorAll("span"), {
      opacity: 0,
      y: 16,
      filter: "blur(6px)"
    });
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(shapes, { opacity: 1, duration: 0.6, stagger: 0.08 }, 0);
  tl.to(shapes, { scale: 1, y: 0, rotate: 0, duration: 1.0, stagger: 0.08 }, 0);
  if (word) tl.add(animateLetters(word, opts), 0.18);

  return tl;
}

/* -----------------------------------------
   MODE: DESIGN — Orbit + Breathe
----------------------------------------- */
function runMorph(shapes, strength = 1) {
  shapes.forEach((el, i) => {
    gsap.killTweensOf(el);

    const drift = (8 + i * 2) * strength;

    gsap.to(el, {
      x: (i % 2 ? drift : -drift),
      y: (i % 3 ? -drift : drift),
      duration: 3.2 + i * 0.3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(el, {
      rotate: i % 2 ? 10 : -10,
      duration: 4.5 + i * 0.35,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(el, {
      scale: 1.05 - i * 0.01,
      duration: 2.4 + i * 0.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(el, {
      opacity: 0.75,
      duration: 2.8 + i * 0.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });
  });
}

/* -----------------------------------------
   DESIGN — SYSTEM DOT (BOUNCING)
----------------------------------------- */
function runSystemDot(box) {
  const dot = box.querySelector(".sys-dot");
  if (!dot || dot._tick) return;

  // dot size (so we can hit edges correctly)
  const size = () => ({
    w: dot.offsetWidth || 10,
    h: dot.offsetHeight || 10
  });

  let vx = gsap.utils.random(0.6, 1.1) * (Math.random() > 0.5 ? 1 : -1);
  let vy = gsap.utils.random(0.6, 1.1) * (Math.random() > 0.5 ? 1 : -1);

  // start anywhere inside the box (top-left based coords)
  const rect0 = box.getBoundingClientRect();
  const s0 = size();
  let x = gsap.utils.random(0, Math.max(0, rect0.width  - s0.w));
  let y = gsap.utils.random(0, Math.max(0, rect0.height - s0.h));

  gsap.set(dot, { x, y, opacity: 0 });
  gsap.to(dot, { opacity: 1, duration: 0.6, ease: "power2.out" });

  function tick() {
    const rect = box.getBoundingClientRect();
    const s = size();

    x += vx;
    y += vy;

    // LEFT / RIGHT (hit the edge exactly)
    if (x <= 0) {
      x = 0;
      vx *= -1;
      gsap.to(dot, { scale: 1.35, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
    } else if (x >= rect.width - s.w) {
      x = rect.width - s.w;
      vx *= -1;
      gsap.to(dot, { scale: 1.35, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
    }

    // TOP / BOTTOM
    if (y <= 0) {
      y = 0;
      vy *= -1;
      gsap.to(dot, { scale: 1.35, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
    } else if (y >= rect.height - s.h) {
      y = rect.height - s.h;
      vy *= -1;
      gsap.to(dot, { scale: 1.35, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
    }

    gsap.set(dot, { x, y });
  }

  gsap.ticker.add(tick);
  dot._tick = tick;
}

/* -----------------------------------------
   MODE RUNNER
----------------------------------------- */
function runMode(box, opts = {}) {
  const mode = box.dataset.mode || "morph";
  const shapes = box.querySelectorAll(".shape");

  const tl = introBox(box, {
    duration: 0.7,
    stagger: opts.letterStagger ?? 0.05
  });

  tl.call(() => {
    if (mode === "morph") {
      runMorph(shapes, opts.morphStrength ?? 1);
      runSystemDot(box);
    }
  }, null, ">");

  return tl;
}

/* -----------------------------------------
   HERO
----------------------------------------- */
runMode(document.querySelector("#designBox"), {
  letterStagger: 0.06,
  morphStrength: 1.1
});

/* -----------------------------------------
   MINI BOXES (SCROLL)
----------------------------------------- */
document.querySelectorAll(".mini-box").forEach(box => {
  ScrollTrigger.create({
    trigger: box,
    start: "top 78%",
    once: true,
    onEnter: () => runMode(box, { morphStrength: 0.95 })
  });
});



(() => {
  const box = document.querySelector('.mode-squarepath');
  if (!box) return;

  const svg    = box.querySelector('.track-svg');
  const path   = box.querySelector('.track-path');
  const runner = box.querySelector('.runner');
  if (!svg || !path || !runner) return;

  const length = path.getTotalLength();
  const state  = { t: 0 };

  // ✅ solid line (NO dash animation)
  gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });

  // ✅ get runner size so we can center it on the path point
  const r = () => runner.getBoundingClientRect();
  const half = () => ({ hw: r().width / 2, hh: r().height / 2 });

  // helper: position runner on path at 0..1
  function placeRunner(t){
    const p = path.getPointAtLength(t * length);

    const svgRect = svg.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    const { hw, hh } = half();

    // viewBox is 0..100 x 0..150
    const x = (p.x / 100) * svgRect.width  + (svgRect.left - boxRect.left) - hw;
    const y = (p.y / 150) * svgRect.height + (svgRect.top  - boxRect.top) - hh;

    gsap.set(runner, { x, y });
  }

  // ✅ place at start immediately
  placeRunner(0);

  // ✅ continuous travel exactly on the path
  gsap.to(state, {
    t: 1,
    duration: 3.2,
    ease: "none",
    repeat: -1,
    onUpdate: () => placeRunner(state.t)
  });

  // optional: subtle pulse is fine (doesn't move off the line now)
  gsap.to(runner, {
    scale: 1.18,
    duration: 0.55,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  // ✅ on resize, re-place runner (keeps it aligned)
  window.addEventListener("resize", () => placeRunner(state.t));
})();