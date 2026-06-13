/* ======================================================
   RANKRIDGE — ENGAGEMENT / CONVERSION LAYER
   Additive. Does not touch existing scroll-animations.js.
   Builds: progress bar, sticky top bar, enquire tab,
   sticky bottom bar, back-to-top, exit popup, social toasts,
   plus GA4/GTM dataLayer events for calls/WhatsApp/leads.
====================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/919959271353?text=Hi%2C%20I%20want%20to%20know%20about%20Rankridge%20IIT-JEE%20admissions';
  var TEL = 'tel:+919959271353';

  /* self-contained inline SVG icons (page loads no icon font) */
  var SVG = {
    phone: '<svg class="rr-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 10.5c1.2 2.4 3 4.3 5.4 5.5l1.7-1.7c.2-.2.6-.3.9-.2 1 .3 2 .5 3 .5.5 0 .9.4.9.9V19c0 .5-.4.9-.9.9C10.1 19.9 4 13.8 4 6.5c0-.5.4-.9.9-.9h3.2c.5 0 .9.4.9.9 0 1 .2 2 .5 3 .1.3 0 .6-.2.8l-1.8 2.2z"/></svg>',
    wa: '<svg class="rr-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>',
    arrowUp: '<svg class="rr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    chevDown: '<svg class="rr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    gift: '<svg class="rr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M12 8C12 8 12 3 9 3a2.5 2.5 0 0 0 0 5zM12 8c0 0 0-5 3-5a2.5 2.5 0 0 1 0 5z"/></svg>'
  };
  window.dataLayer = window.dataLayer || [];
  function push(o){ window.dataLayer.push(o); }

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {

    /* ---- scroll progress ---- */
    var prog = document.createElement('div'); prog.className = 'rr-progress';
    document.body.appendChild(prog);
    function onScrollProg(){
      var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      prog.style.width = (max > 0 ? (h.scrollTop / max * 100) : 0) + '%';
    }

    /* ---- sticky mini top bar ---- */
    var topbar = document.createElement('div');
    topbar.className = 'rr-topbar';
    topbar.innerHTML =
      '<a href="#top" aria-label="Rankridge home"><img src="asset/images/rankridge-logo.webp" alt="Rankridge"></a>' +
      '<a class="rr-tb-call" href="' + TEL + '">' + SVG.phone + '+91 99 59 27 13 53</a>';
    document.body.appendChild(topbar);

    /* ---- right enquire tab ---- */
    var tab = document.createElement('button');
    tab.className = 'rr-enquire';
    tab.setAttribute('aria-label', 'Enquire now');
    tab.innerHTML = '<i class="bi bi-pencil-square"></i>ENQUIRE NOW';
    document.body.appendChild(tab);
    tab.addEventListener('click', function () {
      var target = document.querySelector('.admission-section') || document.querySelector('.admission-form');
      if (target) {
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        var inp = document.querySelector('.admission-form [name="student_name"]');
        if (inp) setTimeout(function(){ inp.focus(); }, reduce ? 0 : 600);
      }
      push({ event: 'click_enquire_tab' });
    });

    /* ---- sticky bottom bar ---- */
    var sticky = document.createElement('div');
    sticky.className = 'rr-sticky';
    sticky.setAttribute('role', 'navigation');
    sticky.innerHTML =
      '<a class="rr-sb-call" href="' + TEL + '">' + SVG.phone + ' Call Experts</a>' +
      '<a class="rr-sb-wa" href="' + WA + '" target="_blank" rel="noopener">' + SVG.wa + ' WhatsApp Us</a>';
    document.body.appendChild(sticky);

    /* ---- back to top ---- */
    var totop = document.createElement('button');
    totop.className = 'rr-totop'; totop.setAttribute('aria-label', 'Back to top');
    totop.innerHTML = SVG.arrowUp;
    document.body.appendChild(totop);
    totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

    /* shared scroll handler */
    window.addEventListener('scroll', function () {
      onScrollProg();
      var y = window.pageYOffset;
      topbar.classList.toggle('rr-show', y > 160);
      totop.classList.toggle('rr-show', y > 600);
    }, { passive: true });
    onScrollProg();

    /* ---- exit-intent popup (once per session) ---- */
    (function () {
      if (sessionStorage.getItem('rr_exit')) return;
      var shown = false;
      var modal = document.createElement('div');
      modal.className = 'rr-modal';
      modal.innerHTML =
        '<div class="rr-modal-card"><button class="rr-modal-close" aria-label="Close">&times;</button>' +
        '<div class="rr-modal-ico">' + SVG.gift + '</div>' +
        '<h3>Wait! Claim your <span>up-to-100%</span> Scholarship Slot</h3>' +
        '<p>Admissions for 2026-27 are closing fast. Talk to our experts now and secure your merit scholarship.</p>' +
        '<div class="rr-modal-btns">' +
        '<a class="rr-b-call" href="' + TEL + '">' + SVG.phone + 'Call Now</a>' +
        '<a class="rr-b-wa" href="' + WA + '" target="_blank" rel="noopener">' + SVG.wa + 'WhatsApp</a>' +
        '</div></div>';
      document.body.appendChild(modal);
      function close(){ modal.classList.remove('rr-open'); }
      modal.querySelector('.rr-modal-close').addEventListener('click', close);
      modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
      function trigger(){ if (shown) return; shown = true; sessionStorage.setItem('rr_exit', '1'); modal.classList.add('rr-open'); push({ event: 'exit_popup_shown' }); }
      document.addEventListener('mouseout', function (e) { if (e.clientY <= 0) trigger(); });
      setTimeout(trigger, 40000);
    })();

    /* ---- social-proof toasts ---- */
    (function () {
      var people = [['Priya','Miyapur'],['Aarav','Kukatpally'],['Sneha','KPHB'],['Rohan','Madhapur'],
        ['Ananya','Gachibowli'],['Karthik','Ameerpet'],['Ishaan','SR Nagar'],['Divya','JNTU'],
        ['Aditya','Kompally'],['Meghana','Nizampet']];
      var acts = ['enrolled for IIT-JEE','booked a free demo class','registered for the scholarship test','got a merit scholarship'];
      var toast = document.createElement('div'); toast.className = 'rr-toast';
      document.body.appendChild(toast);
      function show(){
        var p = people[Math.floor(Math.random()*people.length)];
        var a = acts[Math.floor(Math.random()*acts.length)];
        toast.innerHTML = '<span class="rr-ava">' + p[0].charAt(0) + '</span>' +
          '<span><b>' + p[0] + ' from ' + p[1] + '</b><small>just <span>' + a + '</span> · ' + (Math.floor(Math.random()*9)+2) + ' min ago</small></span>';
        toast.classList.add('rr-show');
        setTimeout(function(){ toast.classList.remove('rr-show'); }, 5000);
      }
      setTimeout(function(){ show(); setInterval(show, 45000); }, 60000);
    })();

    /* ---- phone field: digits only, max 10 ---- */
    var phone = document.querySelector('.admission-form [name="phone"], .admission-form [name="mobile"]');
    if (phone) phone.addEventListener('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 10); });

    /* ---- dataLayer events: calls, whatsapp, lead ---- */
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.addEventListener('click', function () { push({ event: 'click_call', phone: this.href }); });
    });
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      a.addEventListener('click', function () { push({ event: 'click_whatsapp', source: this.className }); });
    });
    var form = document.querySelector('.admission-form');
    if (form) form.addEventListener('submit', function () {
      var c = form.querySelector('[name="course"]');
      push({ event: 'generate_lead', form_page: document.title, selected_course: c ? c.value : '' });
    });

    /* ---- collapsible prose (creative per-section labels) ---- */
    (function () {
      var THRESHOLD = 380; // only collapse blocks meaningfully taller than the clamp (~19rem)
      // creative fallback labels, cycled when a block has no data-more attribute
      var MORE_LABELS = ['Know more', 'Deep dive', 'Tell me more', 'Go deeper',
        'See the details', 'Explore more', 'Read the full story', 'Uncover more',
        'Show the rest', 'Dive in', 'Read on'];
      var idx = 0;
      document.querySelectorAll('.rr-prose').forEach(function (prose) {
        if (prose.scrollHeight <= THRESHOLD) return;
        prose.classList.add('rr-clamp');

        var moreLabel = prose.getAttribute('data-more') || MORE_LABELS[idx % MORE_LABELS.length];
        var lessLabel = prose.getAttribute('data-less') || 'Show less';
        idx++;

        var wrap = document.createElement('div');
        wrap.className = 'rr-readmore';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rr-readmore-btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span class="rr-readmore-lbl"></span><i aria-hidden="true">' + SVG.chevDown + '</i>';
        btn.querySelector('.rr-readmore-lbl').textContent = moreLabel;
        wrap.appendChild(btn);
        prose.parentNode.insertBefore(wrap, prose.nextSibling);

        var open = false;
        function expand() {
          open = true;
          prose.classList.add('rr-expanded');
          prose.style.maxHeight = prose.scrollHeight + 'px';
          if (!reduce) {
            prose.classList.add('rr-revealing');
            setTimeout(function () { prose.classList.remove('rr-revealing'); }, 900);
          }
          btn.classList.add('rr-open');
          btn.setAttribute('aria-expanded', 'true');
          btn.querySelector('.rr-readmore-lbl').textContent = lessLabel;
          push({ event: 'read_more_expand' });
        }
        function collapse() {
          open = false;
          prose.style.maxHeight = prose.scrollHeight + 'px';
          requestAnimationFrame(function () {
            prose.classList.remove('rr-expanded');
            prose.style.maxHeight = '';
          });
          btn.classList.remove('rr-open');
          btn.setAttribute('aria-expanded', 'false');
          btn.querySelector('.rr-readmore-lbl').textContent = moreLabel;
        }
        prose.addEventListener('transitionend', function (e) {
          if (e.propertyName === 'max-height' && open) prose.style.maxHeight = 'none';
        });
        btn.addEventListener('click', function () { open ? collapse() : expand(); });
      });
    })();
  });
})();
