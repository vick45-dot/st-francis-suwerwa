/* ============================================================
   MOTION
   Scroll reveals and the counting statistics.
   Both respect the reduced-motion setting. Counters read their
   target from data-count when they fire, so results.js can update
   those values afterwards and the animation still lands correctly.
   ============================================================ */

(function () {
  'use strict';
  var SF = window.SF;

  /* ---------- staggered scroll reveal ---------- */
  var reveals = document.querySelectorAll('.rv');
  if (reveals.length) {
    if (SF.reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.dataset.delay || (i * 80), 10);
          setTimeout(function () { el.classList.add('in'); }, delay);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
    }
  }

  /* ---------- count up to the figure in data-count ---------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var dp = parseInt(el.dataset.dp || 0, 10);
    if (isNaN(target)) return;

    if (SF.reduce) { el.textContent = target.toFixed(dp); return; }

    var duration = 1300, start = null;
    function step(now) {
      if (!start) start = now;
      var p = Math.min((now - start) / duration, 1);
      el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dp);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  /* The published figure is written into the HTML so it still reads
     correctly with JavaScript off. Only blank it once we can animate. */
  if (!SF.reduce) {
    Array.prototype.forEach.call(counters, function (el) { el.textContent = '0'; });
  }

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(counters, countUp);
    return;
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
})();
