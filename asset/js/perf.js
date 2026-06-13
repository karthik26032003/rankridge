(function () {
  'use strict';

  var recaptchaRequested = false;
  var tablerRequested = false;
  var recaptchaWidgetId = null;

  function loadTablerIcons() {
    if (tablerRequested) {
      return;
    }
    tablerRequested = true;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css';
    document.head.appendChild(link);
  }

  function watchTablerLoad() {
    var strategy = document.querySelector('.strategy-section');
    if (!strategy) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      loadTablerIcons();
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        loadTablerIcons();
        obs.disconnect();
      }
    }, { rootMargin: '240px 0px' });

    observer.observe(strategy);
  }

  function renderRecaptcha() {
    var widget = document.querySelector('.admission-recaptcha .g-recaptcha');
    if (!widget || widget.getAttribute('data-rendered') === 'true') {
      return;
    }

    function doRender() {
      if (typeof grecaptcha === 'undefined' || typeof grecaptcha.render !== 'function') {
        return false;
      }

      if (widget.querySelector('iframe')) {
        widget.setAttribute('data-rendered', 'true');
        return true;
      }

      widget.setAttribute('data-rendered', 'true');
      recaptchaWidgetId = grecaptcha.render(widget, {
        sitekey: widget.getAttribute('data-sitekey')
      });
      return true;
    }

    if (typeof grecaptcha !== 'undefined' && typeof grecaptcha.ready === 'function') {
      grecaptcha.ready(function () {
        if (!doRender()) {
          window.setTimeout(renderRecaptcha, 300);
        }
      });
      return;
    }

    if (!doRender()) {
      window.setTimeout(renderRecaptcha, 300);
    }
  }

  function loadRecaptcha() {
    if (recaptchaRequested) {
      renderRecaptcha();
      return;
    }
    recaptchaRequested = true;

    var existing = document.querySelector('script[src*="recaptcha/api.js"]');
    if (existing) {
      renderRecaptcha();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = renderRecaptcha;
    script.onerror = function () {
      recaptchaRequested = false;
    };
    document.head.appendChild(script);
  }

  function watchRecaptchaLoad() {
    var widget = document.querySelector('.admission-recaptcha .g-recaptcha');
    if (!widget) {
      return;
    }

    loadRecaptcha();
    window.setTimeout(renderRecaptcha, 800);
    window.addEventListener('load', renderRecaptcha);
  }

  function getRecaptchaResponse() {
    if (typeof grecaptcha === 'undefined') {
      return '';
    }

    if (recaptchaWidgetId !== null && typeof grecaptcha.getResponse === 'function') {
      return grecaptcha.getResponse(recaptchaWidgetId) || '';
    }

    return grecaptcha.getResponse() || '';
  }

  function validateRecaptcha() {
    if (!getRecaptchaResponse()) {
      alert('Please complete the reCAPTCHA.');
      return false;
    }
    return true;
  }

  function bindForm() {
    var form = document.querySelector('.admission-form');
    if (!form) {
      return;
    }

    var submitBtn = form.querySelector('[type="submit"]');
    var submitLbl = submitBtn ? submitBtn.querySelector('.submit-btn-text') : null;
    var origLbl = submitLbl ? submitLbl.textContent : '';

    function lockSubmit() {
      form.dataset.submitting = '1';
      if (submitBtn) {
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.72';
      }
      if (submitLbl) submitLbl.textContent = 'Submitting…';
    }

    function unlockSubmit() {
      form.dataset.submitting = '';
      if (submitBtn) {
        submitBtn.style.pointerEvents = '';
        submitBtn.style.opacity = '';
      }
      if (submitLbl) submitLbl.textContent = origLbl;
    }

    form.addEventListener('focusin', loadRecaptcha, { once: true });
    form.addEventListener('submit', function (event) {
      loadRecaptcha();
      if (typeof grecaptcha === 'undefined') {
        event.preventDefault();
        alert('reCAPTCHA is still loading. Please wait a moment and try again.');
        return;
      }
      if (!validateRecaptcha()) {
        event.preventDefault();
        return;
      }
      // validation passed — block duplicate submits while the page POSTs
      if (form.dataset.submitting === '1') {
        event.preventDefault();
        return;
      }
      lockSubmit();
    });

    // restore the button if the user returns (validation error -> history.back, or bfcache)
    window.addEventListener('pageshow', unlockSubmit);
  }

  function init() {
    bindForm();
    watchRecaptchaLoad();
    watchTablerLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
