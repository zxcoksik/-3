/**
 * RESONANCE — Premium Vinyl Studio
 * Vanilla JS — interactions, animations, lightbox, slider
 */

(function () {
  'use strict';

  /* ─── DOM References ─── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const preloader = $('#preloader');
  const nav = $('#nav');
  const navLinks = $('#navLinks');
  const navBurger = $('#navBurger');
  const navProgress = $('#navProgress');
  const cursor = $('#cursor');
  const timeline = $('#timeline');
  const timelineProgress = $('#timelineProgress');
  const sliderTrack = $('#sliderTrack');
  const sliderDots = $('#sliderDots');
  const lightbox = $('#lightbox');

  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── State ─── */
  let sliderIndex = 0;
  let sliderAutoplay = null;
  let lightboxIndex = 0;
  let galleryItems = [];

  /* ═══════════════════════════════════════
     PRELOADER
     ═══════════════════════════════════════ */
  function initPreloader() {
    document.documentElement.classList.add('preload-lock');

    const minTime = 1200;
    const start = performance.now();

    const finish = () => {
      const elapsed = performance.now() - start;
      const delay = Math.max(0, minTime - elapsed);

      setTimeout(() => {
        preloader?.classList.add('is-hidden');
        document.documentElement.classList.remove('preload-lock');
      }, delay);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish);
    }
  }

  /* ═══════════════════════════════════════
     CUSTOM CURSOR
     ═══════════════════════════════════════ */
  function initCursor() {
    if (!cursor || isTouch) {
      document.body.classList.add('touch-device');
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const dot = $('.cursor__dot', cursor);
      if (dot) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    });

    /* Smooth ring follow */
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      const ring = $('.cursor__ring', cursor);
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Hover targets */
    const hoverTargets = $$('[data-cursor="hover"], a, button, .gallery__trigger');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('is-click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-click'));
  }

  /* ═══════════════════════════════════════
     NAVIGATION
     ═══════════════════════════════════════ */
  function closeMobileNav() {
    navLinks?.classList.remove('is-open');
    navBurger?.classList.remove('is-open');
    navBurger?.setAttribute('aria-expanded', 'false');
    if (!$('#requestModal')?.classList.contains('is-open')) {
      document.body.style.overflow = '';
    }
  }

  function initNav() {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      nav?.classList.toggle('is-scrolled', scrollY > 40);
      if (navProgress) navProgress.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    navBurger?.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navBurger.classList.toggle('is-open', isOpen);
      navBurger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    if (navLinks) {
      $$('a, button', navLinks).forEach((el) => {
        el.addEventListener('click', () => {
          closeMobileNav();
        });
      });
    }

    $$('.footer__nav a').forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });

    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      });
    });
  }

  /* ═══════════════════════════════════════
     REQUEST MODAL
     ═══════════════════════════════════════ */
  function initModal() {
    const modal = $('#requestModal');
    if (!modal) return;

    const formWrap = $('#modalFormWrap');
    const form = $('#requestForm');
    const success = $('#modalSuccess');
    let lastFocus = null;

    function openModal() {
      lastFocus = document.activeElement;
      modal.removeAttribute('hidden');
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      const firstInput = $('input, select, textarea', form);
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        modal.setAttribute('hidden', '');
        if (formWrap) formWrap.hidden = false;
        if (success) success.hidden = true;
        form?.reset();
        if (lastFocus) lastFocus.focus();
      }, 400);
    }

    $$('[data-modal-open]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    $$('[data-modal-close]', modal).forEach((el) => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (formWrap) formWrap.hidden = true;
      if (success) success.hidden = false;
    });
  }

  /* ═══════════════════════════════════════
     SCROLL REVEAL
     ═══════════════════════════════════════ */
  function initReveal() {
    const reveals = $$('.reveal');
    if (!reveals.length) return;

    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ═══════════════════════════════════════
     PARALLAX (scroll + mouse)
     ═══════════════════════════════════════ */
  function initParallax() {
    if (prefersReducedMotion || !$('#hero')) return;

    const parallaxEls = $$('[data-parallax]');

    /* Scroll parallax */
    const onScroll = () => {
      const scrollY = window.scrollY;

      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - window.innerHeight / 2) * speed * 0.1;

        if (el.classList.contains('hero__bg')) {
          const img = $('.hero__bg-img', el);
          if (img) img.style.transform = `scale(1.05) translateY(${scrollY * speed * 0.3}px)`;
        } else {
          el.style.transform = `translateY(${offset}px)`;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mouse parallax on hero */
    const hero = $('#hero');
    if (!hero || isTouch) return;

    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;

      const disc = $('.hero__disc', hero);
      if (disc) {
        disc.style.transform = `translateY(-50%) translate(${x * 0.5}px, ${y * 0.5}px)`;
      }

      const content = $('.hero__content', hero);
      if (content) {
        content.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      }
    });

    hero.addEventListener('mouseleave', () => {
      const disc = $('.hero__disc', hero);
      const content = $('.hero__content', hero);
      if (disc) disc.style.transform = 'translateY(-50%)';
      if (content) content.style.transform = '';
    });
  }

  /* ═══════════════════════════════════════
     TIMELINE PROGRESS
     ═══════════════════════════════════════ */
  function initTimeline() {
    if (!timeline || !timelineProgress) return;

    const steps = $$('.timeline__step', timeline);

    const update = () => {
      const rect = timeline.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const start = rect.top - viewHeight * 0.3;
      const end = rect.bottom - viewHeight * 0.5;
      const total = end - start;
      const progress = Math.min(1, Math.max(0, (viewHeight * 0.5 - start) / total));

      timelineProgress.style.height = `${progress * 100}%`;

      steps.forEach((step, i) => {
        const stepProgress = (i + 1) / steps.length;
        step.classList.toggle('is-active', progress >= stepProgress - 0.1);
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ═══════════════════════════════════════
     GALLERY LIGHTBOX
     ═══════════════════════════════════════ */
  function initLightbox() {
    const cards = $$('.gallery__item.product-card');
    if (!cards.length || !lightbox) return;

    galleryItems = cards.map((card) => {
      const img = $('img', card);
      const name = $('.gallery__name', card)?.textContent?.trim() || '';
      const artist = $('.gallery__meta', card)?.textContent?.trim() || '';
      const spec = $('.product-card__spec', card)?.textContent?.trim() || '';
      const price = $('.product-card__price', card)?.textContent?.trim() || '';
      return {
        src: img?.getAttribute('src') || '',
        alt: img?.getAttribute('alt') || name,
        caption: [name, artist, spec, price].filter(Boolean).join(' · '),
      };
    });

    const triggers = $$('.gallery__trigger');

    const lbImg = $('#lightboxImg');
    const lbCaption = $('#lightboxCaption');
    const lbBackdrop = $('#lightboxBackdrop');
    const lbClose = $('#lightboxClose');
    const lbPrev = $('#lightboxPrev');
    const lbNext = $('#lightboxNext');

    function open(index) {
      lightboxIndex = index;
      updateSlide();
      lightbox.removeAttribute('hidden');
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => lightbox.setAttribute('hidden', ''), 400);
    }

    function updateSlide() {
      const item = galleryItems[lightboxIndex];
      if (!item || !lbImg) return;
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      if (lbCaption) lbCaption.textContent = item.caption;
    }

    function next() {
      lightboxIndex = (lightboxIndex + 1) % galleryItems.length;
      updateSlide();
    }

    function prev() {
      lightboxIndex = (lightboxIndex - 1 + galleryItems.length) % galleryItems.length;
      updateSlide();
    }

    triggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (e.target.closest('.product-card__btn--cart')) return;
        const index = parseInt(btn.dataset.index, 10);
        open(index);
      });
    });

    lbClose?.addEventListener('click', close);
    lbBackdrop?.addEventListener('click', close);
    lbNext?.addEventListener('click', next);
    lbPrev?.addEventListener('click', prev);

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  /* ═══════════════════════════════════════
     TESTIMONIALS SLIDER
     ═══════════════════════════════════════ */
  function initSlider() {
    if (!sliderTrack) return;

    const slides = $$('.slider__slide', sliderTrack);
    const total = slides.length;
    if (!total) return;

    /* Build dots */
    if (sliderDots) {
      sliderDots.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider__dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        sliderDots.appendChild(dot);
      }
    }

    function goTo(index) {
      sliderIndex = ((index % total) + total) % total;
      sliderTrack.style.transform = `translateX(-${sliderIndex * 100}%)`;

      $$('.slider__dot', sliderDots).forEach((dot, i) => {
        dot.classList.toggle('is-active', i === sliderIndex);
      });
    }

    $('#sliderPrev')?.addEventListener('click', () => goTo(sliderIndex - 1));
    $('#sliderNext')?.addEventListener('click', () => goTo(sliderIndex + 1));

    /* Autoplay */
    function startAutoplay() {
      stopAutoplay();
      sliderAutoplay = setInterval(() => goTo(sliderIndex + 1), 5000);
    }

    function stopAutoplay() {
      if (sliderAutoplay) clearInterval(sliderAutoplay);
    }

    const slider = $('#testimonialSlider');
    slider?.addEventListener('mouseenter', stopAutoplay);
    slider?.addEventListener('mouseleave', startAutoplay);

    /* Touch swipe */
    let touchStartX = 0;
    sliderTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? sliderIndex + 1 : sliderIndex - 1);
      }
    }, { passive: true });

    startAutoplay();
  }

  /* ═══════════════════════════════════════
     AMBIENT BLOB MOUSE FOLLOW (subtle)
     ═══════════════════════════════════════ */
  function initAmbient() {
    if (isTouch || prefersReducedMotion) return;

    const blobs = $$('.ambient__blob');
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 30;
      targetY = (e.clientY / window.innerHeight - 0.5) * 30;
    });

    function animate() {
      currentX += (targetX - currentX) * 0.02;
      currentY += (targetY - currentY) * 0.02;

      blobs.forEach((blob, i) => {
        const factor = (i + 1) * 0.5;
        blob.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ═══════════════════════════════════════
     INIT
     ═══════════════════════════════════════ */
  function init() {
    initPreloader();
    initCursor();
    initNav();
    initModal();
    initReveal();
    initParallax();
    initTimeline();
    initLightbox();
    initSlider();
    initAmbient();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
