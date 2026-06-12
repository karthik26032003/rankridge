(function () {
  'use strict';

  function loadMap(container) {
    var src = container.getAttribute('data-map-src');
    if (!src || container.classList.contains('map-loaded')) {
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = container.getAttribute('data-map-title') || 'Rankridge campus location';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.setAttribute('allowfullscreen', '');

    container.innerHTML = '';
    container.appendChild(iframe);
    container.classList.add('map-loaded');
  }

  function autoLoadMaps() {
    document.querySelectorAll('.map-container').forEach(function (container) {
      loadMap(container);
    });
  }

  function initCarousel(root) {
    var track = root.querySelector('.maps-carousel-track');
    var items = track ? Array.from(track.children) : [];
    if (!items.length) {
      return;
    }

    var index = 0;

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'maps-carousel-btn maps-carousel-btn--prev';
    prevBtn.setAttribute('aria-label', 'Previous campus map');
    prevBtn.innerHTML = '<span aria-hidden="true">&lsaquo;</span>';

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'maps-carousel-btn maps-carousel-btn--next';
    nextBtn.setAttribute('aria-label', 'Next campus map');
    nextBtn.innerHTML = '<span aria-hidden="true">&rsaquo;</span>';

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'maps-carousel-dots';
    dotsWrap.setAttribute('role', 'tablist');
    dotsWrap.setAttribute('aria-label', 'Campus map slides');

    var dots = items.map(function (_, dotIndex) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'maps-carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Show campus map ' + (dotIndex + 1));
      dot.addEventListener('click', function () {
        goTo(dotIndex);
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(nextIndex) {
      index = (nextIndex + items.length) % items.length;
      track.style.transform = 'translate3d(-' + (index * 100) + '%, 0, 0)';
      dots.forEach(function (dot, dotIndex) {
        var active = dotIndex === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      var activeMap = items[index] && items[index].querySelector('.map-container');
      if (activeMap) {
        loadMap(activeMap);
      }
    }

    prevBtn.addEventListener('click', function () {
      goTo(index - 1);
    });

    nextBtn.addEventListener('click', function () {
      goTo(index + 1);
    });

    root.appendChild(prevBtn);
    root.appendChild(nextBtn);
    root.appendChild(dotsWrap);
    goTo(0);
  }

  function init() {
    autoLoadMaps();
    document.querySelectorAll('.maps-carousel').forEach(initCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
