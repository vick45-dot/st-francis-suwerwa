/* ============================================================
   NAVIGATION
   Mobile menu and the shrinking sticky header.
   Runs immediately — it does not wait for school content, so the
   menu works the moment the page appears.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* Close after following a link. */
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) burger.click();
    });
  }

  /* ---------- sticky header shrinks on scroll ---------- */
  var mast = document.querySelector('.masthead');
  if (!mast) return;

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      mast.classList.toggle('shrunk', window.scrollY > 90);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
