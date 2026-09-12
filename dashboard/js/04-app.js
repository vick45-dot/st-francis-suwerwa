/* ========================================================
   APP
   Boots the editors, handles section switching, and writes the new
   content.js when Publish is pressed.
   ======================================================== */

(function () {
  'use strict';
  var D = window.DASH;
  var data = D.data;

  D.bindSimpleFields();
  Object.keys(D.LISTS).forEach(D.drawList);

  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.dataset.add;
      D.LISTS[key].get().push(D.LISTS[key].blank());
      D.persist();
      D.drawList(key);
      var host = document.getElementById(D.LISTS[key].target);
      var last = host.lastElementChild;
      if (last) {
        var input = last.querySelector('input, textarea, select');
        if (input) input.focus();
        last.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    });
  });

  /* ---------- section switching ---------- */
  document.querySelectorAll('[data-go]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-go]').forEach(function (b) {
        b.setAttribute('aria-current', b === btn ? 'true' : 'false');
      });
      document.querySelectorAll('.panel').forEach(function (p) {
        p.classList.toggle('on', p.id === 'p-' + btn.dataset.go);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ---------- export ---------- */
  function serialise(v, ind) {
    var p = new Array(ind + 1).join(' ');
    if (Array.isArray(v)) {
      if (!v.length) return '[]';
      if (v.every(function (x) { return typeof x !== 'object' || x === null; })) {
        return '[' + v.map(function (x) { return JSON.stringify(x); }).join(', ') + ']';
      }
      return '[\n' + v.map(function (x) {
        return p + '  ' + serialise(x, ind + 2);
      }).join(',\n') + '\n' + p + ']';
    }
    if (v && typeof v === 'object') {
      var keys = Object.keys(v);
      if (!keys.length) return '{}';
      return '{\n' + keys.map(function (k) {
        return p + '  ' + JSON.stringify(k) + ': ' + serialise(v[k], ind + 2);
      }).join(',\n') + '\n' + p + '}';
    }
    return JSON.stringify(v);
  }

  document.getElementById('publish').addEventListener('click', function () {
    var body = "/* ============================================================\n" +
      "   St. Francis Girls' High School \u2014 Suwerwa\n" +
      "   ALL WEBSITE CONTENT LIVES IN THIS ONE FILE.\n\n" +
      "   Written by the dashboard on " +
      new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + ".\n" +
      "   Put this file into  assets/js  replacing the one already there.\n" +
      "   ============================================================ */\n\n" +
      "window.SCHOOL = " + serialise(data, 0) + ";\n";

    var blob = new Blob([body], { type: 'text/javascript' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);

    D.toast('content.js downloaded \u2014 put it into the assets/js folder');
    document.querySelector('[data-go="publish"]').click();
  });

  /* ---------- reset ---------- */
  document.getElementById('reset').addEventListener('click', function () {
    if (!window.confirm('Discard every unpublished change on this computer?')) return;
    localStorage.removeItem(D.KEY);
    location.reload();
  });

  /* ---------- leaving with unsaved work ---------- */
  window.addEventListener('beforeunload', function (e) {
    if (!D.isDirty()) return;
    e.preventDefault();
    e.returnValue = '';
  });

  if (localStorage.getItem(D.KEY)) {
    var tag = document.getElementById('saved');
    tag.textContent = 'Unpublished changes on this computer';
    tag.classList.add('on');
  }
})();
