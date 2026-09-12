/* ========================================================
   STATE
   Loads the published content, layers any local draft on top, and
   saves every keystroke back to this browser.
   Exposes window.DASH for the other dashboard scripts.
   ======================================================== */

window.DASH = (function () {
  'use strict';

  var KEY = 'stfrancis:draft';
  var GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
  var POINTS = { 'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7,
                 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1 };
  var BY_POINT = {};
  Object.keys(POINTS).forEach(function (k) { BY_POINT[POINTS[k]] = k; });

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var published = clone(window.SCHOOL || {});
  var data;
  try {
    var saved = localStorage.getItem(KEY);
    data = saved ? JSON.parse(saved) : clone(published);
  } catch (e) { data = clone(published); }

  /* make sure every branch exists so the editors never hit undefined */
  ['site', 'principal', 'about', 'academics', 'admissions', 'life', 'leadership']
    .forEach(function (k) { if (!data[k]) data[k] = {}; });
  ['news', 'voices', 'gallery', 'kcse']
    .forEach(function (k) { if (!Array.isArray(data[k])) data[k] = []; });
  if (!Array.isArray(data.leadership.principals)) data.leadership.principals = [];
  if (!Array.isArray(data.leadership.bom)) data.leadership.bom = [];

  var dirty = false;
  var savedTag = document.getElementById('saved');
  var toastBox = document.getElementById('toast');
  var toastTimer;

  function toast(msg) {
    toastBox.textContent = msg;
    toastBox.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastBox.classList.remove('on'); }, 2600);
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { toast('This browser is not allowing changes to be saved.'); return; }
    dirty = true;
    savedTag.textContent = 'Saved on this computer';
    savedTag.classList.add('on');
  }

  function getPath(p) {
    return p.split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, data);
  }
  function setPath(p, v) {
    var parts = p.split('.'), last = parts.pop();
    var node = parts.reduce(function (o, k) {
      if (!o[k] || typeof o[k] !== 'object') o[k] = {};
      return o[k];
    }, data);
    node[last] = v;
  }

  return {
    KEY: KEY, GRADES: GRADES, POINTS: POINTS, BY_POINT: BY_POINT,
    data: data,
    isDirty: function () { return dirty; },
    toast: toast, persist: persist, getPath: getPath, setPath: setPath
  };
})();
