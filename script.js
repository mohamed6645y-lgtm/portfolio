/**
 * Mohamed Mahmoud Portfolio — Main Script
 * Handles: Loading, Theme, Navigation, Scroll Effects, Slider
 */

(function () {
  'use strict';

  /* ==========================================================
     DOM REFERENCES
     ========================================================== */
  const loader = document.getElementById('loader');
  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('theme-toggle');
  const sliderTrack = document.getElementById('slider-track');
  const sliderDots = document.getElementById('slider-dots');
  const experienceTimeline = document.getElementById('experience-timeline');
  const revealElements = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section[id]');

  const THEME_KEY = 'portfolio-theme';
  const SLIDER_INTERVAL = 5000;

  /* ==========================================================
     LOADING SCREEN
     ========================================================== */
  function initLoader() {
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        triggerInitialReveals();
      }, 1200);
    });
  }

  /* ==========================================================
     THEME (Dark / Light Mode)
     ========================================================== */
  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    applyTheme(getPreferredTheme());

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ==========================================================
     SCROLL PROGRESS BAR
     ========================================================== */
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    scrollProgress.style.width = progress + '%';
    scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
  }

  /* ==========================================================
     NAVBAR SHADOW ON SCROLL
     ========================================================== */
  function updateNavbarShadow() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  /* ==========================================================
     ACTIVE NAV LINK HIGHLIGHT
     ========================================================== */
  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  /* ==========================================================
     MOBILE NAVIGATION TOGGLE
     ========================================================== */
  function initMobileNav() {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================
     SMOOTH SCROLL (enhanced for anchor links)
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ==========================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================== */
  function triggerInitialReveals() {
    revealElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setTimeout(() => el.classList.add('visible'), index * 80);
      }
    });
  }

  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /* ==========================================================
     TESTIMONIALS SLIDER (Autoplay)
     ========================================================== */
  function initTestimonialsSlider() {
    if (!sliderTrack || !sliderDots) return;

    const slides = sliderTrack.querySelectorAll('.testimonial-card');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoplayTimer;

    /* Build dot navigation */
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i, true));
      sliderDots.appendChild(dot);
    }

    const dots = sliderDots.querySelectorAll('.slider-dot');

    function goToSlide(index, resetTimer) {
      currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
      sliderTrack.style.transform = 'translateX(-' + currentSlide * 100 + '%)';

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });

      if (resetTimer) restartAutoplay();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1, false);
    }

    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, SLIDER_INTERVAL);
    }

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    /* Pause on hover for accessibility */
    sliderTrack.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    sliderTrack.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  /* ==========================================================
     EXPERIENCE TIMELINE SCROLL ANIMATION
     ========================================================== */
  function updateTimelineAnimation() {
    if (!experienceTimeline) return;

    const lineFill = experienceTimeline.querySelector('.timeline-line-fill');
    if (!lineFill) return;

    const timelineRect = experienceTimeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // The top of the element relative to the viewport
    const top = timelineRect.top;
    // The height of the element
    const height = timelineRect.height;

    // Calculate the progress of the element scrolling through the viewport.
    // A small offset makes the animation start/end a bit inside the viewport.
    const offset = 100;
    const progress = (viewportHeight - top - offset) / (viewportHeight + height - (2 * offset));

    // Clamp the progress value between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress));

    lineFill.style.height = (clampedProgress * 100) + '%';
  }

  /* ==========================================================
     BUTTON RIPPLE ANIMATION
     ========================================================== */
  function initButtonAnimations() {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);

        ripple.style.cssText = [
          'position:absolute',
          'width:' + size + 'px',
          'height:' + size + 'px',
          'left:' + (e.clientX - rect.left - size / 2) + 'px',
          'top:' + (e.clientY - rect.top - size / 2) + 'px',
          'background:rgba(255,255,255,0.3)',
          'border-radius:50%',
          'transform:scale(0)',
          'animation:ripple 0.6s ease-out',
          'pointer-events:none'
        ].join(';');

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    /* Inject ripple keyframes once */
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
      document.head.appendChild(style);
    }
  }

  /* ==========================================================
     SCROLL EVENT HANDLER (throttled via rAF)
     ========================================================== */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbarShadow();
        updateActiveNavLink();
        updateTimelineAnimation();
        ticking = false;
      });
      ticking = true;
    }
  }

  /* ==========================================================
     INITIALIZE ALL MODULES
     ========================================================== */
  function init() {
    initLoader();
    initTheme();
    initMobileNav();
    initSmoothScroll();
    initScrollReveal();
    initTestimonialsSlider();
    initButtonAnimations();

    window.addEventListener('scroll', onScroll, { passive: true });

    /* Run once on load */
    updateScrollProgress();
    updateNavbarShadow();
    updateActiveNavLink();
    updateTimelineAnimation();
  }

  /* Run when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
