document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.innerWidth <= 768;
  gsap.registerPlugin(ScrollTrigger);

  // Animate text on load (runs on all devices)
  gsap.to(".mcvdesign", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    delay: 1
  });

  // White circle hover effect
  const inquiryBtns = document.querySelectorAll('.navbar__inquiry, .navbar__email, .button-design');

  inquiryBtns.forEach(btn => {
    const toBlack = () => {
      const icon = btn.querySelector('.arrow-icon');
      gsap.killTweensOf([btn, icon]);
      gsap.to(btn, { color: 'black', duration: 0.4, ease: 'power2.inOut', overwrite: 'auto' });
      if (icon) gsap.to(icon, { color: 'black', duration: 0.4, ease: 'power2.inOut', overwrite: 'auto' });
      btn.style.setProperty('--circle-scale', 3);
    };

    const toWhite = () => {
      const icon = btn.querySelector('.arrow-icon');
      gsap.killTweensOf([btn, icon]);
      gsap.to(btn, { color: 'white', duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
      if (icon) gsap.to(icon, { color: 'white', duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
      btn.style.setProperty('--circle-scale', 0);
    };

    btn.addEventListener('pointerenter', toBlack);
    btn.addEventListener('pointerleave', toWhite);
    btn.addEventListener('pointercancel', toWhite);
  });

  // Ball animation (desktop only)
// ==========================
// BALL (desktop + mobile, resize-safe)
// ==========================
const mmBall = gsap.matchMedia();

mmBall.add(
  {
    isMobile: "(max-width: 768px)",
    isDesktop: "(min-width: 769px)"
  },
  (ctx) => {
    const { isMobile, isDesktop } = ctx.conditions;
    const ball = document.getElementById("draggableBall");
    if (!ball) return;

    // Prevent tiny horizontal scrollbar during rotation/scale
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    // Reset any previous tweens when switching modes
    gsap.killTweensOf(ball);
    gsap.set(ball, { clearProps: "x,y,scale,rotation" });
    gsap.set(ball, { transformOrigin: "50% 50%", scale: 1, force3D: true });

    // --------------------------
    // MOBILE: spin only
    // --------------------------
    if (isMobile) {
      const spin = gsap.to(ball, {
        rotation: "+=360",
        duration: 30,
        ease: "none",
        repeat: -1,
        overwrite: false
      });

      return () => {
        spin.kill();
        gsap.killTweensOf(ball);
        gsap.set(ball, { clearProps: "x,y,scale,rotation" });
      };
    }

    // --------------------------
    // DESKTOP: your original behavior + spin
    // --------------------------
    if (isDesktop) {
      let isReturning = false;
      let isDragging = false;
      let scrollLocked = false;
      const activationDistance = 300;
      const pushStrength = 5;

      gsap.from(ball, {
        scale: 0,
        opacity: 0,
        duration: 1.4,
        delay: 0.5,
        ease: "power3.out",
        overwrite: "auto"
      });

      // Spin (independent)
      const spin = gsap.to(ball, {
        rotation: "+=360",
        duration: 30,
        ease: "none",
        repeat: -1,
        overwrite: false
      });

      // Glow loop (same as before)
      const glow = gsap.timeline({ repeat: -1, yoyo: true })
        .to(".ball", { boxShadow: `0 0 20px #000, 0 0 40px #000, 0 0 60px #000`, duration: 2, ease: "sine.inOut" })
        .to(".ball", { boxShadow: `0 0 25px #000, 0 0 50px #000, 0 0 70px #000`, duration: 2, ease: "sine.inOut" });

      // Mouse repel (unchanged, just overwrite:auto)
      const onMove = (e) => {
        if (isDragging || scrollLocked) return;

        const rect = ball.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < activationDistance) {
          isReturning = false;
          const repelX = -dx / distance * (activationDistance - distance) * pushStrength;
          const repelY = -dy / distance * (activationDistance - distance) * pushStrength;

          gsap.to(ball, {
            x: repelX,
            y: repelY,
            scale: 0.92,
            duration: 60,
            ease: "power3.out",
            overwrite: "auto"
          });
        } else if (!isReturning) {
          isReturning = true;

          gsap.to(ball, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 18,
            ease: "elastic.out(1, 0.4)",
            overwrite: "auto"
          });
        }
      };

      const onScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 100 && !scrollLocked) {
          scrollLocked = true;

          // only kill x/y/scale (rotation continues)
          gsap.killTweensOf(ball, "x,y,scale");

          gsap.to(ball, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
        if (scrollY <= 50 && scrollLocked) scrollLocked = false;

        const moveY = Math.min(scrollY * 0.5, 600);
        const scaleFactor = 1 + Math.min(scrollY / 2000, 1);

        gsap.to(ball, {
          y: moveY,
          scale: scaleFactor,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto"
        });
      };

      document.addEventListener("mousemove", onMove);
      window.addEventListener("scroll", onScroll);

      return () => {
        document.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
        spin.kill();
        glow.kill();
        gsap.killTweensOf(ball);
        gsap.set(ball, { clearProps: "x,y,scale,rotation" });
      };
    }
  }
);

  // Horizontal scroll section
  window.addEventListener("load", () => {
    const track = document.querySelector(".image-track");
    if (!track) return;

    const updateScroll = () => {
      const isMobileNow = window.innerWidth <= 768;

      // ✅ Kill ONLY horizontal triggers we create (don't nuke everything)
      ScrollTrigger.getById("hs-track")?.kill();
      ScrollTrigger.getById("hs-title")?.kill();
      ScrollTrigger.getById("hs-ballfade")?.kill();

      // ✅ Mobile: no pinning, no transforms
      if (isMobileNow) {
        gsap.set(track, { clearProps: "all" });
        track.style.transform = "none";
        document.querySelector("#image-scroll")?.style.setProperty("padding-top", "0");
        gsap.set(".scroll-intro-title", { clearProps: "opacity,transform,filter" });
        ScrollTrigger.refresh();
        return;
      }

      const trackWidth = track.scrollWidth;

      gsap.set(track, { x: window.innerWidth });

      // Main pinned horizontal tween
      gsap.to(track, {
        x: -trackWidth,
        ease: "none",
        scrollTrigger: {
          id: "hs-track",
          trigger: "#image-scroll",
          start: "top top",
          end: "+=" + (trackWidth + window.innerWidth),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // Ensure title starts visible
      gsap.set(".scroll-intro-title", { opacity: 1, y: 0, filter: "blur(0px)" });

      // Title fade tied to horizontal progress
      ScrollTrigger.create({
        id: "hs-title",
        trigger: "#image-scroll",
        start: "top top",
        end: "+=" + (trackWidth + window.innerWidth),
        scrub: true,
        onUpdate: (self) => {
          const fadeStart = 0.03;
          const fadeEnd = 0.14;
          const t = gsap.utils.clamp(0, 1, (self.progress - fadeStart) / (fadeEnd - fadeStart));

          gsap.set(".scroll-intro-title", {
            opacity: 1 - t,
            y: -40 * t,
            filter: `blur(${6 * t}px)`
          });
        }
      });

      // Ball fade on horizontal scroll progress
      ScrollTrigger.create({
        id: "hs-ballfade",
        trigger: "#image-scroll",
        start: "top top",
        end: "+=" + (trackWidth + window.innerWidth),
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const fadeOutStart = 0.8;

          const opacity =
            progress < fadeOutStart
              ? 1
              : 1 - (progress - fadeOutStart) / (1 - fadeOutStart);

          gsap.killTweensOf("#draggableBall", "opacity");
          gsap.to("#draggableBall", {
            opacity,
            duration: 0.2,
            overwrite: "auto"
          });
        }
      });

      ScrollTrigger.refresh();
    };

    updateScroll();
    window.addEventListener("resize", updateScroll);
  });

  // Navbar scroll behavior
  let lastScrollY = window.scrollY;
  const navbar = document.querySelector('.navbar');

  const mobileMenuToggle =
    document.getElementById('mobile-menu') ||
    document.querySelector('.navbar__contact');

  const leftMenu = document.querySelector('.navbar__menu--left');
  const rightMenu = document.querySelector('.navbar__menu--right');

  const isMenuOpen = () => {
    return mobileMenuToggle?.classList.contains('is-active')
      || leftMenu?.classList.contains('active')
      || rightMenu?.classList.contains('active');
  };

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (y > lastScrollY && y > 200 && !isMenuOpen()) {
      navbar?.classList.add('nav--hidden');
    } else {
      navbar?.classList.remove('nav--hidden');
    }
    lastScrollY = y;
  });

  // Social button fade on scroll
  document.addEventListener("scroll", () => {
    const btnContainer = document.querySelector(".social-button-container");
    if (!btnContainer) return;
    const scrollY = window.scrollY;
    const newOpacity = Math.max(0.1, 1 - scrollY / 1000);
    btnContainer.style.opacity = newOpacity;
  });

  // Mobile toggle
  if (mobileMenuToggle && leftMenu && rightMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('is-active');
      leftMenu.classList.toggle('active');
      rightMenu.classList.toggle('active');
      if (isMenuOpen()) navbar?.classList.remove('nav--hidden');
    });
  }

  // Navigation dropdown
  const contactBtn = document.querySelector('.navbar__contact');
  const dropdownMenu = document.getElementById('navDropdown');
  const closeMenu = document.getElementById('closeMenu');

  contactBtn?.addEventListener('click', () => {
    dropdownMenu.offsetHeight;
    requestAnimationFrame(() => dropdownMenu?.classList.add('open'));
  });

  closeMenu?.addEventListener('click', () => {
    dropdownMenu?.classList.remove('open');
  });

  // Navbar link underline animation
  const links = document.querySelectorAll('.navbar__links');
  links.forEach(link => {
    const span = link.querySelector('.link-text');
    if (!span) return;

    link.addEventListener('mouseenter', () => {
      span.style.setProperty('--origin', 'left');
      span.classList.add('hovered');
    });

    link.addEventListener('mouseleave', () => {
      span.style.setProperty('--origin', 'right');
      span.classList.remove('hovered');
    });
  });
});

// === ROTATING TEXT (outside DOMContentLoaded as in your original) ===
const words = ["websites", "branding", "seo"];
const el = document.getElementById("swapWord");
let index = 0;

function animateWord(word) {
  if (!el) return;
  el.innerHTML = "";

  [...word].forEach((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch === " " ? "\u00A0" : ch;

    span.style.opacity = "0";
    span.style.transform = "translateY(10px)";
    span.style.filter = "blur(6px)";

    el.appendChild(span);

    requestAnimationFrame(() => {
      setTimeout(() => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
        span.style.filter = "blur(0)";
      }, i * 70);
    });
  });
}

setTimeout(() => {
  animateWord(words[index]);

  setInterval(() => {
    index = (index + 1) % words.length;
    animateWord(words[index]);
  }, 3600);

}, 2400);

