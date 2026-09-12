/* ============================================================
   DATA
   Works out where the school's content is coming from, then runs
   everything registered with SF.ready().

   MUST BE THE LAST SITE SCRIPT ON THE PAGE.

   Sources, in order of precedence:
     1. data/*.json   written by the content manager at /admin/
                      (only reachable when the site is served)
     2. content.js    written by the dashboard at /dashboard/
                      (works from a plain folder, no server)
     3. local draft   unpublished dashboard edits on this computer

   A page opened straight from a folder cannot fetch JSON, so it
   simply falls back to content.js. Both render identically.
   ============================================================ */

(function () {
  'use strict';
  var SF = window.SF;

  SF.data = window.SCHOOL ? JSON.parse(JSON.stringify(window.SCHOOL)) : {};

  var draftActive = false;
  var DRAFT_KEY = 'stfrancis:draft';

  /* Where each JSON file lands in the content object. */
  var FILES = {
    'data/site.json':       function (d) { SF.data.site = d; },
    'data/principal.json':  function (d) { SF.data.principal = d; },
    'data/about.json':      function (d) { SF.data.about = d; },
    'data/academics.json':  function (d) { SF.data.academics = d; },
    'data/admissions.json': function (d) { SF.data.admissions = d; },
    'data/life.json':       function (d) { SF.data.life = d; },
    'data/leadership.json': function (d) { SF.data.leadership = d; },
    'data/kcse.json':       function (d) { SF.data.kcse = Array.isArray(d) ? d : (d.years || []); },
    'data/news.json':       function (d) { SF.data.news = Array.isArray(d) ? d : (d.items || []); },
    'data/voices.json':     function (d) { SF.data.voices = Array.isArray(d) ? d : (d.items || []); },
    'data/gallery.json':    function (d) { SF.data.gallery = Array.isArray(d) ? d : (d.items || []); }
  };

  function loadJSON() {
    /* file:// cannot fetch. Skip straight to content.js. */
    if (location.protocol === 'file:' || !window.fetch) return Promise.resolve();

    return Promise.all(Object.keys(FILES).map(function (path) {
      return fetch(path, { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { if (d) FILES[path](d); })
        .catch(function () { /* not published this way — keep content.js */ });
    }));
  }

  function applyDraft() {
    try {
      var raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      var draft = JSON.parse(raw);
      Object.keys(draft).forEach(function (k) { SF.data[k] = draft[k]; });
      draftActive = true;
    } catch (e) { /* storage unavailable — use the published content */ }
  }

  /* Make it obvious that local edits are not live yet. */
  function draftBar() {
    if (!draftActive) return;
    var bar = document.createElement('div');
    bar.className = 'draftbar';
    bar.innerHTML = 'Previewing unpublished changes saved on this computer only. ' +
      '<button type="button">Discard</button>';
    bar.querySelector('button').addEventListener('click', function () {
      window.localStorage.removeItem(DRAFT_KEY);
      location.reload();
    });
    document.body.insertBefore(bar, document.body.firstChild);
  }

  applyDraft();
  loadJSON().then(function () {
    applyDraft();     /* a draft always wins over the published files */
    draftBar();
    SF._run();
  });
})();
