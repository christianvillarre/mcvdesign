

// === REVEAL LAYERS (on page load) ===

// First layer slides up and removes itself
gsap.to(".reveal-layer.first", {
  y: "-100%",
  duration: 1.5,
  ease: "power4.inOut",
  delay: 0.1,
  onComplete: () => {
    document.querySelector('.reveal-layer.first')?.remove();
  }
});

// Second layer follows
gsap.to(".reveal-layer.second", {
  y: "-100%",
  duration: 1.5,
  ease: "power4.inOut",
  delay: 0.45,
  onComplete: () => {
    document.querySelector('.reveal-layer.second')?.remove();
  }
});

// === TEXT ENTRANCE EFFECTS ===

gsap.fromTo(".text-creative", 
  { opacity: 0, y: 40, rotateX: -90 },
  { opacity: 1, y: 0, rotateX: 0, duration: 1.5, ease: "expo.out", delay: 1 }
);

gsap.fromTo(".text-visual", 
  { 
    opacity: 0, 
    y: 40, 
    rotateX: 70, 
    letterSpacing: "0.5em"   // ⬅️ more spacing to start
  },
  { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    letterSpacing: "0em",    // ⬅️ end at normal spacing
    duration: 2, 
    ease: "expo.out", 
    delay: 1 
  }
);

gsap.fromTo(".text-designs", 
  { opacity: 0, y: 40, rotateX: -90 },
  { opacity: 1, y: 0, rotateX: 0, duration: 1.5, ease: "expo.out", delay: 1 }
);

// === SCROLL PARALLAX EFFECTS ===

let scrollY = window.scrollY;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

function animateScrollEffects() {
  const creativeOffset = scrollY * -0.1;
  const designsOffset = scrollY * 0.1;
  const visualOffset = scrollY * 0.1;

  gsap.set(".text-creative", { x: creativeOffset });
  gsap.set(".text-designs", { x: designsOffset });
  gsap.set(".text-visual", { x: visualOffset });

  requestAnimationFrame(animateScrollEffects);
}

animateScrollEffects(); // start loop








gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const scrollContainer = document.querySelector("[data-scroll-container]");

  const scroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true
  });

  // Link Locomotive with GSAP ScrollTrigger
  ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
      return arguments.length
        ? scroll.scrollTo(value, 0, 0)
        : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    pinType: scrollContainer.style.transform ? "transform" : "fixed"
  });

  scroll.on("scroll", ScrollTrigger.update);
  ScrollTrigger.addEventListener("refresh", () => scroll.update());
  ScrollTrigger.refresh();

  const wrappers = document.querySelectorAll(".img-wrapper");

  // Z-index assignment
  wrappers.forEach((wrapper, index) => {
    const reversedZ = 3 - index;
    wrapper.style.zIndex = reversedZ;
    wrapper.dataset.originalZ = reversedZ;
  });

  // Trigger animations when services section enters view
  ScrollTrigger.create({
    trigger: ".services-about-us",
    scroller: scrollContainer,
    start: "top 90%",
    once: true,
    onEnter: () => {
      setupInitialTransforms();
      setupScrollAnimations();
    }
  });

  function setupInitialTransforms() {
    const isMobile = window.innerWidth < 768;

    const transforms = [
      { x: isMobile ? 0 : -40, rotate: -15, y: isMobile ? 0 : -50 },
      { x: 0, rotate: -10, y: isMobile ? -20 : -60 },
      { x: isMobile ? 0 : 45, rotate: -5, y: isMobile ? -40 : -60 }
    ];

    wrappers.forEach(wrapper => {
      const index = parseInt(wrapper.dataset.index);
      const img = wrapper.querySelector(".stacked-img");
      const t = transforms[index];

      gsap.set(img, {
        xPercent: t.x,
        rotate: t.rotate,
        y: t.y
      });
    });
  }

  function setupScrollAnimations() {
    wrappers.forEach((wrapper, index) => {
      const img = wrapper.querySelector(".stacked-img");

      ScrollTrigger.create({
        trigger: wrapper,
        scroller: scrollContainer,
        start: "top 120%",
        end: "bottom -100%",
        scrub: true,
        onUpdate: self => {
          const progress = self.progress;
          const isMobile = window.innerWidth < 768;
          const shiftTo = progress * (isMobile ? 5 : 60);   // ⬅️ Reduce horizontal movement
          const rotateTo = progress * (isMobile ? 6 : 12);  // ⬅️ Maintain smooth rotation

          gsap.set(wrapper, {
            x: shiftTo,
            rotate: rotateTo
          });
        }
      });

      // Hover interaction
      wrapper.addEventListener("mouseenter", () => {
        wrapper.style.zIndex = 10;

        wrappers.forEach(w => {
          const wImg = w.querySelector(".stacked-img");
          if (w !== wrapper) {
            gsap.to(wImg, {
              opacity: 0.4,
              filter: "grayscale(100%) brightness(0.6)",
              duration: 0.3,
              ease: "power2.out",
              overwrite: true
            });
            w.style.zIndex = w.dataset.originalZ;
          }
        });

        gsap.to(img, {
          opacity: 1,
          filter: "grayscale(0%) brightness(1)",
          duration: 0.2,
          ease: "power2.out",
          overwrite: true
        });
      });

      wrapper.addEventListener("mouseleave", () => {
        wrappers.forEach(w => {
          const wImg = w.querySelector(".stacked-img");
          gsap.to(wImg, {
            opacity: 1,
            filter: "grayscale(100%) brightness(0.7)",
            duration: 0.4,
            ease: "power2.out",
            overwrite: true
          });
          w.style.zIndex = w.dataset.originalZ;
        });
      });
    });
  }
});


// Fade "We are a forward-thinking design lab" when first card slides over it
gsap.ticker.add(() => {
  const title = document.querySelector(".scroll-intro-title");
  const firstCard = document.querySelector(".image-card");

  if (!title || !firstCard) return;

  // Only do this when the whole image-scroll section is in view
  const section = document.getElementById("image-scroll");
  if (!section) return;

  const sectionRect = section.getBoundingClientRect();
  const inView = sectionRect.bottom > 0 && sectionRect.top < window.innerHeight;
  if (!inView) return;

  const titleRect = title.getBoundingClientRect();
  const cardRect = firstCard.getBoundingClientRect();

  // How much the card has moved into the title horizontally
  const overlap = titleRect.right - cardRect.left;

  // When overlap <= 0 → no fade
  // When overlap >= title width → fully faded
  const fadeStart = 0;
  const fadeEnd = titleRect.width; // you can tweak, e.g. *0.7 to fade faster

  let t = (overlap - fadeStart) / (fadeEnd - fadeStart);
  t = gsap.utils.clamp(0, 1, t);

  const targetOpacity = 1 - t;

  gsap.to(title, {
    opacity: targetOpacity,
    duration: 0.15,
    ease: "power2.out",
    overwrite: true
  });
});