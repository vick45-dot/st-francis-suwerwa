/* ============================================================
   SITE CONTENT
   Fills in everything the school controls: contact details, the
   Principal's message, news, voices, gallery, leadership, and the
   lists that replace the "coming soon" blocks.

   Registers with SF.ready(), so it runs once data.js has resolved
   the content. Results and statistics live in results.js.
   ============================================================ */

window.SF.ready(function () {
  'use strict';
  var SF = window.SF, D = SF.data, esc = SF.esc;

  /* ---------- contact links, derived from the raw numbers ---------- */
  var site = D.site || {};
  if (site.phone)    site.phoneLink    = 'tel:' + String(site.phone).replace(/[^0-9+]/g, '');
  if (site.email)    site.emailLink    = 'mailto:' + site.email;
  if (site.whatsapp) site.whatsappLink = 'https://wa.me/' + String(site.whatsapp).replace(/[^0-9]/g, '');

  /* ---------- bound text and images ---------- */
  document.querySelectorAll('[data-bind]').forEach(function (el) {
    var v = SF.val(el.dataset.bind);
    if (v === null) return;
    if (el.tagName === 'IMG') el.setAttribute('src', v);
    else el.textContent = v;
    el.classList.remove('is-placeholder');
  });

  /* ---------- bound links; unused social icons remove themselves ---------- */
  document.querySelectorAll('[data-bind-href]').forEach(function (el) {
    var v = SF.val(el.dataset.bindHref);
    if (v !== null) el.setAttribute('href', v);
    else if (/^site\.(facebook|instagram|youtube)$/.test(el.dataset.bindHref)) el.remove();
  });

  /* ---------- WhatsApp button only exists once there is a number ---------- */
  if (!site.whatsapp) {
    var wa = document.querySelector('.wa');
    if (wa) wa.remove();
  }

  /* ---------- Principal's portrait ---------- */
  if (!(D.principal || {}).photo) {
    var portrait = document.querySelector('.principal__portrait');
    if (portrait) portrait.setAttribute('data-pending', 'true');
  }

  /* ---------- map ---------- */
  if (site.mapEmbed) {
    var map = document.getElementById('map');
    if (map) {
      map.innerHTML = '<a class="btn btn--outline" target="_blank" rel="noopener" href="' +
        esc(site.mapEmbed) + '">Open in Google Maps</a>';
    }
  }

  /* ---------- news ---------- */
  var newsList = document.getElementById('news-list');
  if (newsList) {
    var items = (D.news || []).slice();
    if (!items.length) {
      newsList.innerHTML = '<p class="empty">No news posted yet. ' +
        'Items published from the dashboard appear here.</p>';
    } else {
      items.sort(function (a, b) {
        return String(b.date || '').localeCompare(String(a.date || ''));
      });
      var limit = parseInt(newsList.dataset.limit || 3, 10);
      newsList.innerHTML = items.slice(0, limit).map(function (n) {
        var img = n.image
          ? '<div class="news__img"><img src="' + esc(n.image) + '" alt="" loading="lazy"></div>'
          : '';
        var d = n.date ? new Date(n.date) : null;
        var when = (d && !isNaN(d))
          ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : esc(n.date || '');
        var body = String(n.body || '').slice(0, 155);
        return '<article>' + img + '<div class="news__body">' +
          '<p class="news__date">' + when + '</p>' +
          '<h3>' + esc(n.title || '') + '</h3>' +
          '<p>' + esc(body) + (body.length >= 155 ? '&hellip;' : '') + '</p>' +
          '</div></article>';
      }).join('');
    }
  }

  /* ---------- student and old girl voices ---------- */
  var voiceBox = document.getElementById('voices');
  if (voiceBox && (D.voices || []).length) {
    voiceBox.innerHTML = D.voices.map(function (v, i) {
      return '<div class="voice' + (i === 0 ? ' is-on' : '') + '">' +
        '<blockquote>&ldquo;' + esc(v.quote) + '&rdquo;</blockquote>' +
        '<cite>' + esc(v.name) + (v.role ? ' &middot; ' + esc(v.role) : '') + '</cite></div>';
    }).join('');

    if (D.voices.length > 1) {
      var dots = document.createElement('div');
      dots.className = 'voices__dots';
      dots.setAttribute('role', 'tablist');
      dots.innerHTML = D.voices.map(function (v, i) {
        return '<button role="tab" aria-selected="' + (i === 0) +
          '" aria-label="Quotation ' + (i + 1) + '"></button>';
      }).join('');
      voiceBox.parentNode.appendChild(dots);
    }
  }

  /* rotate the quotations */
  (function () {
    var voices = document.querySelectorAll('.voice');
    var dots = document.querySelectorAll('.voices__dots button');
    if (voices.length < 2) return;
    var timer, current = 0;

    function show(i) {
      Array.prototype.forEach.call(voices, function (v, n) {
        v.classList.toggle('is-on', n === i);
      });
      Array.prototype.forEach.call(dots, function (d, n) {
        d.setAttribute('aria-selected', n === i ? 'true' : 'false');
      });
      current = i;
    }
    function cycle() {
      timer = setInterval(function () { show((current + 1) % voices.length); }, 7000);
    }
    Array.prototype.forEach.call(dots, function (d, n) {
      d.addEventListener('click', function () { clearInterval(timer); show(n); cycle(); });
    });
    if (!SF.reduce) cycle();
  })();

  /* ---------- gallery ---------- */
  var grid = document.getElementById('gallery-grid');
  if (grid && (D.gallery || []).length) {
    grid.innerHTML = D.gallery.map(function (g) {
      return '<a href="' + esc(g.image) + '"><img src="' + esc(g.image) +
        '" alt="' + esc(g.caption || '') + '" loading="lazy"></a>';
    }).join('');
    var note = grid.parentNode.querySelector('.muted');
    if (note) note.remove();
  }

  /* ---------- leadership timelines ---------- */
  function timeline(id, list) {
    var el = document.getElementById(id);
    if (!el || !list || !list.length) return;
    el.innerHTML = list.map(function (p) {
      return '<li class="rv in"><span class="yrs">' + esc(p.years) + '</span>' +
        '<span class="who">' + esc(p.name) + '</span></li>';
    }).join('');
  }
  var lead = D.leadership || {};
  timeline('tl-principals', lead.principals);
  timeline('tl-bom', lead.bom);

  /* ---------- lists that replace "coming soon" blocks ---------- */
  var adm = D.admissions || {};

  function pathway(pw) {
    var combos = pw.combinations
      ? '<br><span class="muted" style="font-size:.9rem">' + esc(pw.combinations) + '</span>'
      : '';
    return '<li><strong>' + esc(pw.name) + '</strong>' +
      (pw.description ? ' &mdash; ' + esc(pw.description) : '') + combos + '</li>';
  }
  SF.fillList('adm-pathways', adm.pathways, pathway);
  SF.fillList('acad-pathways', adm.pathways, pathway);

  SF.fillList('adm-requirements', adm.requirements, function (r) {
    return '<li>' + esc(typeof r === 'string' ? r : r.item) + '</li>';
  });
  SF.fillList('adm-documents', adm.documents, function (r) {
    return '<li>' + esc(typeof r === 'string' ? r : r.doc) + '</li>';
  });
  SF.fillList('life-clubs', (D.life || {}).clubs, function (c) {
    return '<li><strong>' + esc(c.name) + '</strong>' +
      (c.description ? ' &mdash; ' + esc(c.description) : '') + '</li>';
  });
  SF.fillList('life-sports', (D.life || {}).sports, function (s) {
    return '<li>' + esc(typeof s === 'string' ? s : s.sport) + '</li>';
  });
  SF.fillList('acad-subjects', (D.academics || {}).subjects, function (s) {
    return '<li>' + esc(typeof s === 'string' ? s : s.subject) + '</li>';
  });

  /* ---------- fee table ---------- */
  var feeBody = document.getElementById('fee-body');
  if (feeBody && (adm.fees || []).length) {
    feeBody.innerHTML = adm.fees.map(function (f) {
      return '<tr><td>' + esc(f.item) + '</td><td>' + esc(f.form || '\u2014') +
        '</td><td class="num">' + esc(f.amount) + '</td></tr>';
    }).join('');
    var table = document.getElementById('fee-table');
    if (table) table.hidden = false;
    var pending = document.getElementById('fee-pending');
    if (pending) pending.remove();
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
});
