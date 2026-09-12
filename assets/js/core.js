/* ============================================================
   CORE
   Shared namespace, helpers and the "run once content is ready"
   queue. Every other script hangs off this.
   Loaded FIRST, before any other site script.
   ============================================================ */

window.SF = (function () {
  'use strict';

  var queue = [];

  return {
    /* Filled in by data.js before the queue runs. */
    data: {},

    /* Honour the operating system's reduced-motion setting everywhere. */
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    /* Register work that needs school content. data.js runs these once
       the content has been resolved from whichever source is available. */
    ready: function (fn) { queue.push(fn); },

    /* Called by data.js only. */
    _run: function () {
      queue.forEach(function (fn) {
        try { fn(); }
        catch (e) { if (window.console) console.error('SF module failed:', e); }
      });
      queue = [];
    },

    /* Escape text before it goes anywhere near innerHTML. */
    esc: function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    },

    /* Read a dotted path out of the content, treating '' as missing. */
    val: function (path) {
      return path.split('.').reduce(function (o, k) {
        return (o && o[k] !== undefined && o[k] !== null && o[k] !== '') ? o[k] : null;
      }, window.SF.data);
    },

    /* Replace a "coming soon" block with a real list once content exists. */
    fillList: function (id, arr, fmt) {
      var el = document.getElementById(id);
      if (!el || !arr || !arr.length) return;
      el.innerHTML = arr.map(fmt).join('');
      el.hidden = false;
      var pending = document.getElementById(el.dataset.replaces || '');
      if (pending) pending.remove();
    }
  };
})();
