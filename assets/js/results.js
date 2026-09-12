/* ============================================================
   EXAMINATION RESULTS
   Everything driven by the results record: the headline figures,
   the sparkline and the full grade table.

   Nothing here is hardcoded. Add a year through either dashboard
   and the whole site follows — headline mean, grade letter, year
   labels, candidate count, pass rate, year-on-year gain and the
   "results for <next year>" note.
   ============================================================ */

window.SF.ready(function () {
  'use strict';
  var SF = window.SF, esc = SF.esc;

  var POINTS = { 'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7,
                 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1 };
  var BY_POINT = {};
  Object.keys(POINTS).forEach(function (k) { BY_POINT[POINTS[k]] = k; });
  var COLUMNS = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

  var rows = (SF.data.kcse || []).filter(function (r) { return r.mean; });
  if (!rows.length) return;

  /* ============================================================
     Headline figures
     ============================================================ */
  (function () {
    var yrs = rows.filter(function (r) { return r.entry; })
                  .slice().sort(function (a, b) { return a.year - b.year; });
    if (!yrs.length) return;

    var current = yrs[yrs.length - 1];
    var previous = yrs.length > 1 ? yrs[yrs.length - 2] : null;

    /* Share of candidates at or above a given grade point. */
    function share(row, minPoints) {
      var total = 0, at = 0;
      Object.keys(row.grades || {}).forEach(function (g) {
        var c = +row.grades[g] || 0;
        total += c;
        if (POINTS[g] >= minPoints) at += c;
      });
      return total ? (100 * at / total) : null;
    }

    var passRate = share(current, 5);   /* C- and above */
    var uniRate  = share(current, 7);   /* C+ and above */
    var gain     = previous ? (current.mean - previous.mean) : null;

    /* The school rounds the mean to the nearest grade point rather than
       down. Verified against every year on their own board, 2013–2024. */
    var grade = current.meanGrade ||
                BY_POINT[Math.min(12, Math.max(1, Math.round(current.mean)))];

    var numbers = {
      mean:  { v: +current.mean,  dp: 3 },
      entry: { v: +current.entry, dp: 0 },
      age:   { v: new Date().getFullYear() - yrs[0].year, dp: 0 }
    };
    if (passRate !== null) numbers.passRate = { v: passRate, dp: 1 };

    document.querySelectorAll('[data-stat]').forEach(function (el) {
      var spec = numbers[el.dataset.stat];
      if (!spec) return;
      el.dataset.count = spec.v;
      el.dataset.dp = spec.dp;
    });

    var labels = {
      meanYear:  current.year,
      prevYear:  previous ? previous.year : '',
      meanGrade: grade
    };
    document.querySelectorAll('[data-stat-label]').forEach(function (el) {
      var v = labels[el.dataset.statLabel];
      if (v !== undefined && v !== '') el.textContent = v;
    });

    var texts = {
      mean: (+current.mean).toFixed(3),
      gain: gain === null ? '\u2014' : (gain >= 0 ? '+' : '') + gain.toFixed(3),
      uni:  uniRate === null ? '\u2014' : uniRate.toFixed(1) + '%',
      passRatePct: passRate === null ? '\u2014' : passRate.toFixed(1) + '%'
    };
    document.querySelectorAll('[data-stat-text]').forEach(function (el) {
      var v = texts[el.dataset.statText];
      if (v !== undefined) el.textContent = v;
    });

    var note = document.getElementById('kcse-note');
    if (note) {
      note.textContent = 'Results for ' + (current.year + 1) +
        ' will be added once released by the school.';
    }
  })();

  /* ============================================================
     Sparkline
     ============================================================ */
  (function () {
    var svg = document.getElementById('spark');
    if (!svg || rows.length < 2) return;

    var pts = rows.map(function (r) { return { year: +r.year, mean: +r.mean }; })
                  .sort(function (a, b) { return a.year - b.year; });

    var W = 620, H = 210, PAD = 34, MIN = 3.8, MAX = 7.6;
    var x = function (i) { return PAD + (i / (pts.length - 1)) * (W - PAD * 2); };
    var y = function (m) { return H - PAD - ((m - MIN) / (MAX - MIN)) * (H - PAD * 2); };

    var line = pts.map(function (p, i) {
      return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.mean).toFixed(1);
    }).join(' ');
    var area = line + ' L' + x(pts.length - 1).toFixed(1) + ' ' + (H - PAD) +
               ' L' + x(0).toFixed(1) + ' ' + (H - PAD) + ' Z';

    var grid = [4, 5, 6, 7].map(function (g) {
      return '<line x1="' + PAD + '" x2="' + (W - PAD) + '" y1="' + y(g).toFixed(1) +
        '" y2="' + y(g).toFixed(1) + '" stroke="#DAD6CC" stroke-width="1"/>' +
        '<text x="4" y="' + (y(g) + 4).toFixed(1) + '" font-size="10" fill="#7A8194">' +
        BY_POINT[g] + '</text>';
    }).join('');

    var last = pts.length - 1;
    svg.innerHTML = grid +
      '<path d="' + area + '" fill="rgba(18,52,153,.08)"/>' +
      '<path d="' + line + '" fill="none" stroke="#123499" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="' + x(last).toFixed(1) + '" cy="' + y(pts[last].mean).toFixed(1) +
      '" r="5" fill="#C9922A" stroke="#fff" stroke-width="2"/>' +
      '<text x="' + x(0).toFixed(1) + '" y="' + (H - 10) +
      '" font-size="10" fill="#7A8194">' + pts[0].year + '</text>' +
      '<text x="' + (W - PAD) + '" y="' + (H - 10) +
      '" font-size="10" fill="#7A8194" text-anchor="end">' + pts[last].year + '</text>';
  })();

  /* ============================================================
     Full grade table
     ============================================================ */
  (function () {
    var body = document.getElementById('kcse-body');
    if (!body) return;
    body.innerHTML = (SF.data.kcse || []).map(function (r) {
      var cells = COLUMNS.map(function (c) {
        var v = r.grades && r.grades[c];
        return '<td class="num">' + (v ? v : '&ndash;') + '</td>';
      }).join('');
      return '<tr><th scope="row">' + esc(r.year) + '</th>' +
        '<td class="num">' + (r.entry || '&ndash;') + '</td>' + cells +
        '<td class="num">' + (r.mean ? (+r.mean).toFixed(3) : '&ndash;') + '</td>' +
        '<td class="grade">' + esc(r.meanGrade || '\u2013') + '</td></tr>';
    }).join('');
  })();
});
