(function () {
  'use strict';

  function initFaqAccordion() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      item.addEventListener('toggle', function () {
        item.classList.toggle('faq-open', item.open);
        if (item.open) {
          document.querySelectorAll('.faq-item').forEach(function (other) {
            if (other !== item && other.open) {
              other.open = false;
              other.classList.remove('faq-open');
            }
          });
        }
      });
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion-reduced');
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFaqAccordion);
    } else {
      initFaqAccordion();
    }
    return;
  }

  var REVEAL_DURATION = 750;
  var STAGGER_STEP = 0.09;

  /* Per-section animation playbooks */
  var sectionPlaybooks = [
    {
      root: '.admission-section',
      sequence: [
        { sel: '.admission-banner', anim: 'reveal-blur-up' },
        { sel: '.admission-title', anim: 'reveal-fade-up' },
        { sel: '.admission-card', anim: 'reveal-zoom-in' },
        { sel: '.admission-field', anim: 'reveal-fade-up', stagger: true, max: 6 }
      ]
    },
    {
      root: '.why-rankridge',
      sequence: [
        { sel: '.why-header', anim: 'reveal-blur-up' },
        { sel: '.section-intro', anim: 'reveal-intro' },
        { sel: '.why-rows', anim: 'reveal-fade-up' },
        { sel: '.why-card', anim: 'reveal-zoom-in', stagger: true, hover: 'hover-lift', max: 6 }
      ]
    },
    {
      root: '.results-section',
      sequence: [
        { sel: '.results-panel', anim: 'reveal-fade-up' },
        { sel: '.results-header', anim: 'reveal-blur-up' },
        { sel: '.section-intro', anim: 'reveal-intro' },
        { sel: '.result-card', anim: 'reveal-zoom-in', stagger: true, hover: 'hover-lift', max: 6 }
      ]
    },
    {
      root: '.stats-section',
      sequence: [
        { sel: '.stats-hero', anim: 'reveal-blur-up' },
        { sel: '.section-intro', anim: 'reveal-intro' },
        { sel: '.stat-card', anim: 'reveal-pop-in', stagger: true, hover: 'hover-lift', max: 4 },
        { sel: '.stats-donut-panel', anim: 'reveal-slide-right' },
        { sel: '.stats-growth-panel', anim: 'reveal-slide-left' },
        { sel: '.stats-cta', anim: 'reveal-zoom-in' },
        { sel: '.stats-cta-track', anim: 'reveal-fade-up', stagger: true, max: 3 }
      ]
    },
    {
      root: '.different-section',
      sequence: [
        { sel: '.different-panel', anim: 'reveal-fade-up' },
        { sel: '.different-header', anim: 'reveal-blur-up' },
        { sel: '.section-intro', anim: 'reveal-intro' },
        { sel: '.different-card', anim: 'reveal-fade-up', stagger: true, alternate: true, hover: 'hover-lift', max: 6 }
      ]
    },
    {
      root: '.morethan-section',
      sequence: [
        { sel: '.morethan-hdr', anim: 'reveal-blur-up' },
        { sel: '.section-intro', anim: 'reveal-intro' },
        { sel: '.morethan-outer', anim: 'reveal-fade-up' },
        { sel: '.morethan-card', anim: 'reveal-zoom-in', stagger: true, hover: 'hover-lift', max: 6 }
      ]
    },
    {
      root: '.strategy-section',
      sequence: [
        { sel: '.section-intro', anim: 'reveal-intro' },
        { sel: '.strategy-step', anim: 'reveal-slide-right', stagger: true, hover: 'hover-lift', max: 5 },
        { sel: '.strategy-faculty', anim: 'reveal-fade-up' },
        { sel: '.strategy-faculty-title', anim: 'reveal-fade-up', stagger: true, max: 2 },
        { sel: '.strategy-faculty-intro', anim: 'reveal-intro' },
        { sel: '.strategy-fac-card', anim: 'reveal-flip-up', stagger: true, hover: 'hover-fac-card', max: 6 }
      ]
    },
    {
      root: '.scholarship-section',
      sequence: [
        { sel: '.sch-strip', anim: 'reveal-blur-up' },
        { sel: '.sch-intro', anim: 'reveal-intro' },
        { sel: '.sch-badge-wrap', anim: 'reveal-zoom-out' },
        { sel: '.sch-feature', anim: 'reveal-pop-in', stagger: true, hover: 'hover-lift', max: 4 },
        { sel: '.sch-premium', anim: 'reveal-fade-up' },
        { sel: '.sch-card', anim: 'reveal-zoom-out', stagger: true, hover: 'hover-lift', max: 4 }
      ]
    },
    {
      root: '.testi-footer-section',
      sequence: [
        { sel: '.testi-title', anim: 'reveal-blur-up' },
        { sel: '.testi-card', anim: 'reveal-fade-up', stagger: true, hover: 'hover-lift', max: 4 },
        { sel: '.faq-banner', anim: 'reveal-fade-up' },
        { sel: '.faq-item', anim: 'reveal-slide-left', stagger: true, alternate: true, max: 20 },
        { sel: '.site-footer-brand', anim: 'reveal-blur-up' },
        { sel: '.site-footer-section', anim: 'reveal-slide-left' },
        { sel: '.site-footer-social-wrap', anim: 'reveal-fade-up' },
        { sel: '.site-footer-map-wrap', anim: 'reveal-fade-up' },
        { sel: '.site-footer-copy', anim: 'reveal-fade-up' }
      ]
    }
  ];

  function addReveal(el, anim, delay) {
    el.classList.add('reveal', anim);
    if (delay) el.style.setProperty('--reveal-delay', delay + 's');
  }

  function applySectionPlaybooks() {
    sectionPlaybooks.forEach(function (playbook) {
      var root = document.querySelector(playbook.root);
      if (!root) return;

      root.classList.add('anim-section');

      playbook.sequence.forEach(function (item) {
        root.querySelectorAll(item.sel).forEach(function (el, i) {
          var anim = item.anim;
          if (item.alternate) {
            anim = i % 2 === 0 ? 'reveal-slide-left' : 'reveal-slide-right';
          }
          var delay = item.stagger ? (i % (item.max || 8)) * STAGGER_STEP : 0;
          addReveal(el, anim, delay);
          if (item.hover) el.classList.add(item.hover);
        });
      });
    });
  }

  function initHero() {
    var heroSection = document.querySelector('.hero');
    if (heroSection) heroSection.classList.add('hero-animated');

    var heroImg = document.querySelector('.hero-img-placeholder');
    if (heroImg) addReveal(heroImg, 'reveal-zoom-out');

    var heroCurve = document.querySelector('.hero-curve');
    if (heroCurve) heroCurve.classList.add('curve-animated');
  }

  function initGlobalInteractions() {
    document.querySelectorAll('.call-pill, .admission-cta, .footer-cta-pill, .admission-phone').forEach(function (el) {
      el.classList.add('hover-scale');
    });

    document.querySelectorAll('.admission-cta').forEach(function (el) {
      el.classList.add('anim-cta-glow');
    });

    document.querySelectorAll('.banner-icon, .banner-arrow').forEach(function (el) {
      el.classList.add('anim-cap-bob');
    });

    document.querySelectorAll('.site-footer-icon').forEach(function (el) {
      el.classList.add('anim-icon-pulse');
    });

    document.querySelectorAll('.site-social-icon').forEach(function (el) {
      el.classList.add('hover-social');
    });
  }

  function initSectionIcons() {
    var iconMap = [
      { section: '.why-rankridge', icons: '.why-icon', classes: ['hover-glow', 'anim-icon-float'] },
      { section: '.stats-section', icons: '.stat-icon-ring', classes: ['hover-glow', 'anim-icon-float'] },
      { section: '.different-section', icons: '.different-icon-circle', classes: ['hover-glow', 'anim-icon-float'] },
      { section: '.morethan-section', icons: '.morethan-ico', classes: ['hover-glow', 'anim-icon-float'] },
      { section: '.strategy-section', icons: '.strategy-step-icon', classes: ['hover-glow'] },
      { section: '.strategy-section', icons: '.strategy-fac-icon', classes: ['anim-fac-icon'] },
      { section: '.scholarship-section', icons: '.sch-feature-icon', classes: ['hover-glow', 'anim-icon-float'] }
    ];

    iconMap.forEach(function (entry) {
      var root = document.querySelector(entry.section);
      if (!root) return;
      root.querySelectorAll(entry.icons).forEach(function (icon) {
        entry.classes.forEach(function (cls) {
          icon.classList.add(cls);
        });
      });
    });
  }

  function markRevealVisible(el) {
    el.classList.add('is-visible');
  }

  function initObserver() {
    var reveals = document.querySelectorAll('.reveal, .reveal-intro');
    if (!reveals.length) return;

    reveals.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        markRevealVisible(el);
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          markRevealVisible(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -5% 0px'
    });

    reveals.forEach(function (el) {
      if (!el.classList.contains('is-visible')) {
        observer.observe(el);
      }
    });

    window.setTimeout(function () {
      reveals.forEach(function (el) {
        markRevealVisible(el);
      });
    }, 2500);
  }

  function initSectionFade() {
    var sections = document.querySelectorAll('section:not(.hero)');
    if (!sections.length) return;

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -2% 0px'
    });

    sections.forEach(function (section) {
      section.classList.add('section-scroll');
      var rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        section.classList.add('section-visible');
      }
      sectionObserver.observe(section);
    });
  }

  function initHeroParallax() {
    var hero = document.querySelector('.hero-img');
    var wrap = document.querySelector('.hero-image-wrap');
    if (!hero || !wrap) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = wrap.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          var progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
          hero.style.transform = 'scale(' + (1 + progress * 0.05) + ') translateY(' + (progress * 18) + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  function parseStatValue(text) {
    var raw = (text || '').trim();
    var suffix = '';
    if (raw.indexOf('%') !== -1) suffix = '%';
    else if (raw.indexOf('+') !== -1) suffix = '+';
    var num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    return { num: isNaN(num) ? 0 : num, suffix: suffix };
  }

  function initStatCounters() {
    var root = document.querySelector('.stats-section');
    if (!root) return;

    var numbers = root.querySelectorAll('.stat-number');
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.dataset.counted === '1') return;
        el.dataset.counted = '1';

        var parsed = parseStatValue(el.textContent);
        var target = parsed.num;
        var suffix = parsed.suffix;
        var duration = 1400;
        var startTime = null;

        el.classList.add('stat-counting');

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.classList.add('stat-counted');
          }
        }

        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    numbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function initFieldFocusAnim() {
    document.querySelectorAll('.admission-field input, .admission-field select').forEach(function (field) {
      var wrap = field.closest('.admission-field');
      if (!wrap) return;
      field.addEventListener('focus', function () { wrap.classList.add('field-focused'); });
      field.addEventListener('blur', function () { wrap.classList.remove('field-focused'); });
    });
  }

  function initRippleOnCta() {
    document.querySelectorAll('.admission-cta, .footer-cta-pill, .call-pill').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'click-ripple';
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', function () { ripple.remove(); });
      });
    });
  }

  function initSubtleTilt() {
    if (!window.matchMedia('(min-width: 1024px) and (hover: hover)').matches) return;

    document.querySelectorAll('.why-card, .testi-card, .sch-card, .result-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  document.documentElement.style.setProperty('--reveal-duration', REVEAL_DURATION + 'ms');

  function boot() {
    document.body.classList.add('anim-ready');
    initHero();
    applySectionPlaybooks();
    initGlobalInteractions();
    initSectionIcons();
    initObserver();
    initSectionFade();
    initHeroParallax();
    initStatCounters();
    initFieldFocusAnim();
    initRippleOnCta();
    initFaqAccordion();
    initSubtleTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
