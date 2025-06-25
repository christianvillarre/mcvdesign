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
  const inquiryBtns = document.querySelectorAll('.navbar__inquiry, .navbar__email');
  inquiryBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.setProperty('--circle-scale', 3);
      gsap.to(btn.querySelector('.arrow-icon'), { color: 'black', duration: 0.6, ease: 'power2.inOut' });
      gsap.to(btn, { color: 'black', duration: 0.6, ease: 'power2.inOut' });
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--circle-scale', 0);
      gsap.to(btn.querySelector('.arrow-icon'), { color: 'white', duration: 0.5, ease: 'power2.inOut' });
      gsap.to(btn, { color: 'white', duration: 0.5, ease: 'power2.inOut' });
    });
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

  // ScrollTrigger animations (desktop only)
  if (!isMobile) {
    gsap.fromTo(".scroll-intro-title",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".scroll-intro",
          start: "top bottom",
          end: "top center",
          scrub: true
        }
      });

    gsap.to(".scroll-intro-title", {
      opacity: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: document.body,
        start: "top+=2000 top",
        end: "top+=2500 top",
        scrub: true
      }
    });

    gsap.to(".gradient-overlay", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top bottom",
        end: "top center",
        scrub: true
      }
    });

    gsap.fromTo(".scroll-intro-title",
      { opacity: 1 },
      {
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "top+=1999 top",
          scrub: true
        }
      });

    gsap.to(".background-fade", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top center",
        end: "bottom center",
        scrub: true
      }
    });
  }

  // Horizontal scroll section
  window.addEventListener("load", () => {
  const track = document.querySelector(".image-track");
  const isMobile = window.innerWidth <= 768;

  if (track) {
    const updateScroll = () => {
      // Kill all previous ScrollTriggers before re-initializing
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      if (isMobile) {
        // On mobile: remove transforms and pinning
        gsap.set(track, { clearProps: "all" });
        track.style.transform = "none";

        // Optionally remove top padding/margin if any
        document.querySelector("#image-scroll")?.style.setProperty("padding-top", "0");
        return;
      }

      // Desktop horizontal scroll setup
      const trackWidth = track.scrollWidth;
      gsap.set(track, { x: window.innerWidth });

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

      // Ball fade on horizontal scroll progress
      ScrollTrigger.create({
        trigger: "#image-scroll",
        start: "top top",
        end: "+=" + (trackWidth + window.innerWidth),
        scrub: true,
        onUpdate: (self) => {
          if (!isMobile) {
            const progress = self.progress;
            const fadeOutStart = 0.8;
            const opacity = progress < fadeOutStart
              ? 1
              : 1 - (progress - fadeOutStart) / (1 - fadeOutStart);
            gsap.to(".ball", {
              opacity,
              duration: 0.2,
              overwrite: true
            });
          }
        }
      });

      ScrollTrigger.refresh();
    };

    updateScroll();
    window.addEventListener("resize", updateScroll);
  }
});

  // Navbar scroll behavior
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

  // Navigation dropdown
const contactBtn = document.querySelector('.navbar__contact');
const dropdownMenu = document.getElementById('navDropdown');
const closeMenu = document.getElementById('closeMenu');

contactBtn?.addEventListener('click', () => {
  // Trigger layout read to force a reflow
  dropdownMenu.offsetHeight;

  // Force repaint via requestAnimationFrame
  requestAnimationFrame(() => {
    dropdownMenu?.classList.add('open');
  });
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

