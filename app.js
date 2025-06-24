
document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.innerWidth <= 768;
  gsap.registerPlugin(ScrollTrigger);


   // Animate .text-designs
 gsap.to(".mcvdesign", {
  y: 0,
  opacity: 1,
  duration: 1.2,
  ease: "power3.out",
  delay: 1
});

//WHITE CIRCLE HOVER EFFECT

const inquiryBtns = document.querySelectorAll('.navbar__inquiry, .navbar__email');

inquiryBtns.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.setProperty('--circle-scale', 3);

    gsap.to(btn.querySelector('.arrow-icon'), {
      color: 'black',
      duration: 0.6,
      ease: 'power2.inOut'
    });

    gsap.to(btn, {
      color: 'black',
      duration: 0.6,
      ease: 'power2.inOut'
    });
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.setProperty('--circle-scale', 0);

    gsap.to(btn.querySelector('.arrow-icon'), {
      color: 'white',
      duration: 0.5,
      ease: 'power2.inOut'
    });

    gsap.to(btn, {
      color: 'white',
      duration: 0.5,
      ease: 'power2.inOut'
    });
  });
});

  // Animate ball on page load
if (!isMobile) {
  // Animate ball on page load
  const ball = document.getElementById("draggableBall");

  gsap.from(ball, {
    scale: 0,
    opacity: 0,
    duration: 1.4,
    delay: 0.5,
    ease: "power3.out"
  });

  gsap.set(ball, { transformOrigin: "50% 50%", scale: 1 });

  // Glow animation loop
  const glowTimeline = gsap.timeline({ repeat: -1, yoyo: true });
  glowTimeline
    .to(".ball", {
      boxShadow: `0 0 20px #000, 0 0 40px #000, 0 0 60px #000`,
      duration: 2,
      ease: "sine.inOut"
    })
    .to(".ball", {
      boxShadow: `0 0 25px #000, 0 0 50px #000, 0 0 70px #000`,
      duration: 2,
      ease: "sine.inOut"
    });

  // Mouse repel effect
  document.addEventListener("mousemove", (e) => {
    if (isDragging || scrollLocked) return;

    const rect = ball.getBoundingClientRect();
    const ballX = rect.left + rect.width / 2;
    const ballY = rect.top + rect.height / 2;

    const dx = e.clientX - ballX;
    const dy = e.clientY - ballY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < activationDistance) {
      isReturning = false;

      const dirX = dx / distance;
      const dirY = dy / distance;

      const repelX = -dirX * (activationDistance - distance) * pushStrength;
      const repelY = -dirY * (activationDistance - distance) * pushStrength;

      gsap.to(ball, {
        x: repelX,
        y: repelY,
        scale: 0.92,
        duration: 60,
        ease: "power3.out"
      });
    } else if (!isReturning) {
      isReturning = true;

      gsap.to(ball, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 18,
        ease: "elastic.out(1, 0.4)"
      });
    }
  });
//BALL LOWERS ON SCREEN AND SCALES ON SCROLL
  window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const maxShift = 600; // Max downward movement
  const moveY = Math.min(scrollY * 0.5, maxShift); // Y movement factor

  const maxScale = 2;
  const scaleFactor = 1 + Math.min(scrollY / 2000, maxScale - 1); // Smooth scale from 1 to 1.2

  gsap.to(".ball", {
    y: moveY,
    scale: scaleFactor,
    duration: 0.4,
    ease: "power3.out"
  });
});
}




  // Draggable ball
  /*
  Draggable.create(ball, {
    type: "x,y",
    inertia: true,
    allowContextMenu: true,
    zIndexBoost: false,
    onPress() {
      gsap.to(this.target, {
        scale: 0.92,
        duration: 0.2,
        overwrite: "auto",
        ease: "power1.out"
      });
    },
    onRelease() {
      gsap.to(this.target, {
        x: 0,
        y: 0,
        duration: 12,
        ease: "power2.out"
      });
      gsap.to(this.target, {
        scale: 1,
        duration: 2,
        overwrite: "auto",
        ease: "elastic.out(1, 0.4)"
      });
    }
  });
*/
  // Cursor repel effect on hover proximity - extended & slower
let isReturning = false;
let isDragging = false;
let scrollLocked = false;
const activationDistance = 300;
const pushStrength = 5;

// Assume ball already exists
// const ball = document.getElementById("draggableBall");

// Listen for scroll to disable repel
window.addEventListener("scroll", () => {
  if (window.scrollY > 100 && !scrollLocked) {
    scrollLocked = true;

    // Kill any active animations
    gsap.killTweensOf(ball);

    // Reset position & scale
    gsap.to(ball, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  }

  // Optional: re-enable if scroll returns to top
  if (window.scrollY <= 50 && scrollLocked) {
    scrollLocked = false;
  }
});

//TEXT BEFORE HORIZONTAL SCROLL EFFECTS
// GSAP intro animation on load
gsap.fromTo(
  ".scroll-intro-title",
  { opacity: 0, scale: 0.9 },
  {
    opacity: 1,
    scale: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scroll-intro",     // ✅ Not .image-track
      start: "top bottom",          // When .scroll-intro enters
      end: "top center",            // Fully visible by midpoint
      scrub: true
    }
  }
);
//CARD MAKES TEXT FADE OUT
// Fade out on scroll down
gsap.to(".scroll-intro-title", {
  opacity: 0,
  ease: "power2.out",
  scrollTrigger: {
    trigger: document.body,
    start: "top+=2000 top", // Start fading out at 2000px scroll
    end: "top+=2500 top",   // Fully faded by 2500px
    scrub: true
  }
});


//CONTACT SECTION GRADIENT
gsap.to(".gradient-overlay", {
  opacity: 1,
  scrollTrigger: {
    trigger: ".contact-section",
    start: "top bottom",
    end: "top center",
    scrub: true
  }
});

gsap.fromTo(
  ".scroll-intro-title",
  { opacity: 1 },
  {
    opacity: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "top+=1999 top", // Keep opacity at 1 up to 1999px
      scrub: true
    }
  }
);

  // Horizontal image scroll



window.addEventListener("load", () => {
  const track = document.querySelector(".image-track");

  if (track) {
    const updateScroll = () => {
      const isMobile = window.innerWidth <= 768;

      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Clean up old triggers

      if (isMobile) {
        gsap.set(track, { clearProps: "all" }); // Reset GSAP effects
        track.style.transform = "none";
        return; // Skip ScrollTrigger setup
      }

      const trackWidth = track.scrollWidth;
      const scrollDistance = trackWidth - window.innerWidth;
      const clampedDistance = Math.max(scrollDistance, 100);

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

      ScrollTrigger.create({
        trigger: "#image-scroll",
        start: "top top",
        end: "+=" + (trackWidth + window.innerWidth),
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const fadeOutStart = 0.8;
          const opacity = progress < fadeOutStart
            ? 1
            : 1 - (progress - fadeOutStart) / (1 - fadeOutStart);
          gsap.to(".ball", {
            opacity: opacity,
            duration: 0.2,
            overwrite: true
          });
        }
      });

      ScrollTrigger.refresh();
    };

    updateScroll();
    window.addEventListener("resize", updateScroll);
  }
});



//outro title



//BACKGROUND FADE
gsap.to(".background-fade", {
  opacity: 1,
  scrollTrigger: {
    trigger: ".contact-section",
    start: "top center",
    end: "bottom center",
    scrub: true
  }
});


//NAVIGATION SCREEN
const contactBtn = document.querySelector('.navbar__contact');
const dropdownMenu = document.getElementById('navDropdown');
const closeMenu = document.getElementById('closeMenu');

contactBtn.addEventListener('click', () => {
  dropdownMenu.classList.add('open');
});

closeMenu.addEventListener('click', () => {
  dropdownMenu.classList.remove('open');
});

// Sticky hide/show navbar on scroll
let lastScrollY = window.scrollY;
const emailBtn = document.querySelector('.navbar__email');
const inquiryBtn = document.querySelector('.navbar__inquiry');
const logo = document.querySelector('.logo');

if (logo) {
  logo.style.transition = 'filter 0.5s ease';
}

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // 👉 Scroll down — hide buttons
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    emailBtn?.style.setProperty('transform', 'translateY(-100%)');
    emailBtn?.style.setProperty('opacity', '0');
    emailBtn?.style.setProperty('transition', 'transform 0.6s ease, opacity 0.6s ease');

    inquiryBtn?.style.setProperty('transform', 'translateY(-100%)');
    inquiryBtn?.style.setProperty('opacity', '0');
    inquiryBtn?.style.setProperty('transition', 'transform 0.6s ease, opacity 0.6s ease');
  }

  // 👉 Scroll up — show buttons
  if (currentScrollY < lastScrollY) {
    emailBtn?.style.setProperty('transform', 'translateY(0)');
    emailBtn?.style.setProperty('opacity', '1');

    inquiryBtn?.style.setProperty('transform', 'translateY(0)');
    inquiryBtn?.style.setProperty('opacity', '1');
  }

  // 👉 Only reset logo when you're back at the top
  if (currentScrollY < 50) {
    logo?.style.setProperty('filter', 'none');
  } else {
    logo?.style.setProperty('filter', 'brightness(0) invert(1)');
  }

  lastScrollY = currentScrollY;
});


/*

let lastScrollY = window.scrollY;
const emailBtn = document.querySelector('.navbar__email');
const inquiryBtn = document.querySelector('.navbar__inquiry');
const logo = document.querySelector('.logo');

// Apply transition to logo (only once)
if (logo) {
  logo.style.transition = 'filter 0.5s ease';
}

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Scroll down: hide buttons and fade logo white
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    emailBtn?.style.setProperty('transform', 'translateY(-100%)');
    emailBtn?.style.setProperty('opacity', '0');
    emailBtn?.style.setProperty('transition', 'transform 0.6s ease, opacity 0.6s ease');

    inquiryBtn?.style.setProperty('transform', 'translateY(-100%)');
    inquiryBtn?.style.setProperty('opacity', '0');
    inquiryBtn?.style.setProperty('transition', 'transform 0.6s ease, opacity 0.6s ease');

    logo?.style.setProperty('filter', 'brightness(0) invert(1)'); // fade to white
  }

  // Scroll near top: restore buttons and logo
  if (currentScrollY < 50) {
    emailBtn?.style.setProperty('transform', 'translateY(0)');
    emailBtn?.style.setProperty('opacity', '1');

    inquiryBtn?.style.setProperty('transform', 'translateY(0)');
    inquiryBtn?.style.setProperty('opacity', '1');

    logo?.style.setProperty('filter', 'none'); // fade back to original
  }

  lastScrollY = currentScrollY;
});

*/


//SOCIAL CONTAINER BUTTONS FADE ON SCROLL
document.addEventListener("scroll", () => {
  const btnContainer = document.querySelector(".social-button-container");
  if (!btnContainer) return;

  const scrollY = window.scrollY;
  const maxScroll = 1000; // adjust based on how fast you want the fade

  // Calculate opacity: 1 (at top) to 0.1 (at maxScroll)
  const newOpacity = Math.max(0.1, 1 - scrollY / maxScroll);
  btnContainer.style.opacity = newOpacity;
});



  // Mobile menu toggle
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

  // Link hover underline animation
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

