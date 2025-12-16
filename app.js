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
    gsap.killTweensOf([btn, icon]);              // stop in-flight tweens
    gsap.to(btn,  { color: 'black', duration: 0.4, ease: 'power2.inOut', overwrite: 'auto' });
    if (icon) gsap.to(icon, { color: 'black', duration: 0.4, ease: 'power2.inOut', overwrite: 'auto' });
    btn.style.setProperty('--circle-scale', 3);
  };

  const toWhite = () => {
    const icon = btn.querySelector('.arrow-icon');
    gsap.killTweensOf([btn, icon]);              // stop in-flight tweens
    gsap.to(btn,  { color: 'white', duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
    if (icon) gsap.to(icon, { color: 'white', duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
    btn.style.setProperty('--circle-scale', 0);
  };

  btn.addEventListener('pointerenter', toBlack);
  btn.addEventListener('pointerleave', toWhite);
  btn.addEventListener('pointercancel', toWhite);   // safety net on touch/drag cancel
});

  // Ball animation (desktop only)
  if (!isMobile) {
    const ball = document.getElementById("draggableBall");
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
      ease: "power3.out"
    });

    gsap.set(ball, { transformOrigin: "50% 50%", scale: 1 });

    // Glow loop
    gsap.timeline({ repeat: -1, yoyo: true })
      .to(".ball", { boxShadow: `0 0 20px #000, 0 0 40px #000, 0 0 60px #000`, duration: 2, ease: "sine.inOut" })
      .to(".ball", { boxShadow: `0 0 25px #000, 0 0 50px #000, 0 0 70px #000`, duration: 2, ease: "sine.inOut" });

    // Mouse repel
    document.addEventListener("mousemove", (e) => {
      if (isDragging || scrollLocked) return;
      const rect = ball.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < activationDistance) {
        isReturning = false;
        const repelX = -dx / distance * (activationDistance - distance) * pushStrength;
        const repelY = -dy / distance * (activationDistance - distance) * pushStrength;
        gsap.to(ball, { x: repelX, y: repelY, scale: 0.92, duration: 60, ease: "power3.out" });
      } else if (!isReturning) {
        isReturning = true;
        gsap.to(ball, { x: 0, y: 0, scale: 1, duration: 18, ease: "elastic.out(1, 0.4)" });
      }
    });

    // Scroll effects on ball
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      if (scrollY > 100 && !scrollLocked) {
        scrollLocked = true;
        gsap.killTweensOf(ball);
        gsap.to(ball, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
      }
      if (scrollY <= 50 && scrollLocked) scrollLocked = false;

      const moveY = Math.min(scrollY * 0.5, 600);
      const scaleFactor = 1 + Math.min(scrollY / 2000, 1);
      gsap.to(".ball", { y: moveY, scale: scaleFactor, duration: 0.4, ease: "power3.out" });
    });
  }
/*
  // Ball fade on scroll (mobile only)
if (isMobile) {
  const ball = document.querySelector(".ball");
  if (ball) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const fadeEnd = 150; // Adjust how fast it fades
      const opacity = Math.max(0, 1 - scrollY / fadeEnd);

      gsap.to(ball, {
        opacity: opacity,
        duration: 5.5,
        overwrite: true
      });
    });
  }
}
*/
  // ScrollTrigger animations (desktop only)


  // Horizontal scroll section
window.addEventListener("load", () => {
  const track = document.querySelector(".image-track");

  if (!track) return;

  const updateScroll = () => {
    const isMobile = window.innerWidth <= 768;

    // Kill all previous ScrollTriggers before re-initializing
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // ✅ Mobile: no pinning, no transforms
    if (isMobile) {
      gsap.set(track, { clearProps: "all" });
      track.style.transform = "none";
      document.querySelector("#image-scroll")?.style.setProperty("padding-top", "0");

      // Keep title visible on mobile
      gsap.set(".scroll-intro-title", { clearProps: "opacity,transform,filter" });
      ScrollTrigger.refresh();
      return;
    }

    // ✅ Desktop: horizontal scroll setup
    const trackWidth = track.scrollWidth;

    gsap.set(track, { x: window.innerWidth });

    // Main pinned horizontal tween
    gsap.to(track, {
      x: -trackWidth,
      ease: "none",
      scrollTrigger: {
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

    // ✅ Title fade tied to horizontal progress (NOT when approaching section)
    ScrollTrigger.create({
      trigger: "#image-scroll",
      start: "top top",
      end: "+=" + (trackWidth + window.innerWidth),
      scrub: true,
      onUpdate: (self) => {
        // Fade only AFTER horizontal motion begins
        const fadeStart = 0.03; // 3% into horizontal
        const fadeEnd   = 0.14; // 14% into horizontal
        const t = gsap.utils.clamp(0, 1, (self.progress - fadeStart) / (fadeEnd - fadeStart));

        gsap.set(".scroll-intro-title", {
          opacity: 1 - t,
          y: -40 * t,
          filter: `blur(${6 * t}px)`
        });
      }
    });

    // ✅ Ball fade on horizontal scroll progress (your original logic)
    ScrollTrigger.create({
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

        gsap.to(".ball", {
          opacity,
          duration: 0.2,
          overwrite: true
        });
      }
    });

    ScrollTrigger.refresh();
  };

  updateScroll();
  window.addEventListener("resize", updateScroll);
});

  // Navbar scroll behavior
  /*    OLD BEHAVIOR - LOGO STAYS NAV
  let lastScrollY = window.scrollY;
  const emailBtn = document.querySelector('.navbar__email');
  const inquiryBtn = document.querySelector('.navbar__inquiry');
  const logo = document.querySelector('.logo');

  if (logo) logo.style.transition = 'filter 0.5s ease';

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      emailBtn?.style.setProperty('transform', 'translateY(-100%)');
      inquiryBtn?.style.setProperty('transform', 'translateY(-100%)');
      emailBtn?.style.setProperty('opacity', '0');
      inquiryBtn?.style.setProperty('opacity', '0');
    } else if (currentScrollY < lastScrollY) {
      emailBtn?.style.setProperty('transform', 'translateY(0)');
      inquiryBtn?.style.setProperty('transform', 'translateY(0)');
      emailBtn?.style.setProperty('opacity', '1');
      inquiryBtn?.style.setProperty('opacity', '1');
    }

    logo?.style.setProperty('filter', currentScrollY < 50 ? 'none' : 'brightness(0) invert(1)');
    lastScrollY = currentScrollY;
  });

  // Social button fade on scroll
  document.addEventListener("scroll", () => {
    const btnContainer = document.querySelector(".social-button-container");
    if (!btnContainer) return;
    const scrollY = window.scrollY;
    const newOpacity = Math.max(0.1, 1 - scrollY / 1000);
    btnContainer.style.opacity = newOpacity;
  });

  // Navbar mobile toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const centerMenu = document.querySelector('.navbar__center');
  const rightMenu = document.querySelector('.navbar__right');

  if (mobileMenu && centerMenu && rightMenu) {
    mobileMenu.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-active');
      centerMenu.classList.toggle('active');
      rightMenu.classList.toggle('active');
    });
  }
    */

  let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

// Support either your previous #mobile-menu OR the circular .navbar__contact
const mobileMenuToggle =
  document.getElementById('mobile-menu') ||
  document.querySelector('.navbar__contact');

const leftMenu  = document.querySelector('.navbar__menu--left');
const rightMenu = document.querySelector('.navbar__menu--right');

const isMenuOpen = () => {
  // If you toggle a class on the toggle button, check it here:
  return mobileMenuToggle?.classList.contains('is-active')
    // Or, if you toggle the panels:
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


// === Mobile toggle (ensure navbar stays visible when open) ===
if (mobileMenuToggle && leftMenu && rightMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('is-active');
    leftMenu.classList.toggle('active');
    rightMenu.classList.toggle('active');

    // Keep bar visible while menu is open
    if (isMenuOpen()) navbar?.classList.remove('nav--hidden');
  });
}

  // Navigation dropdown
  function lockScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.height = "100vh";
}

function unlockScroll() {
  document.body.style.overflow = "";
  document.body.style.height = "";
}
const contactBtn = document.querySelector('.navbar__contact');
const dropdownMenu = document.getElementById('navDropdown');
const closeMenu = document.getElementById('closeMenu');

contactBtn?.addEventListener('click', () => {
  dropdownMenu.offsetHeight; // force reflow

  requestAnimationFrame(() => {
    dropdownMenu?.classList.add('open');
    lockScroll(); // 🔒 STOP SCROLL
  });
});

closeMenu?.addEventListener('click', () => {
  dropdownMenu?.classList.remove('open');
  unlockScroll(); // 🔓 RESTORE SCROLL
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



//RECENT CHANGES
//ROTATING TEXT WEBSITES, BRANDING, SEO

  const words = ["websites", "branding", "seo"];
  const el = document.getElementById("swapWord");

  let index = 0;

  function animateWord(word) {
    el.innerHTML = "";

    [...word].forEach((ch, i) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;

      // Initial hidden state
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

  // ⏳ WAIT before first animation
  setTimeout(() => {
    animateWord(words[index]);

    // 🔁 Normal loop AFTER first animation
    setInterval(() => {
      index = (index + 1) % words.length;
      animateWord(words[index]);
    }, 3600);

  }, 2400); // ⬅️ delay before first appearance

