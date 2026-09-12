/* ========================================================
   EDITABLE LISTS
   One entry per repeating section of the site. To add a new list,
   copy an existing block: give it a target element id, a label, a
   getter, a blank record, and a render function.
   ======================================================== */

(function () {
  'use strict';
  var D = window.DASH;
  var el = D.el, field = D.field, persist = D.persist;
  var data = D.data;

  var LISTS = {
    news: {
      target: 'list-news', label: 'News item',
      get: function () { return data.news; },
      blank: function () { return { title: '', date: '', image: '', body: '' }; },
      render: function (it, box) {
        box.appendChild(field('Title', it.title, function (v) { it.title = v; }).wrap);
        var row = el('div', 'row two');
        row.appendChild(field('Date', it.date, function (v) { it.date = v; },
          { type: 'date' }).wrap);
        row.appendChild(field('Photograph file name', it.image, function (v) { it.image = v; },
          { placeholder: 'assets/img/example.jpg' }).wrap);
        box.appendChild(row);
        box.appendChild(field('Text', it.body, function (v) { it.body = v; },
          { textarea: true }).wrap);
      }
    },
    pathways: {
      target: 'list-pathways', label: 'Pathway',
      get: function () { return data.admissions.pathways || (data.admissions.pathways = []); },
      blank: function () { return { name: '', description: '', combinations: '' }; },
      render: function (it, box) {
        var wrap = el('div', 'f');
        var id = 'p' + Math.random().toString(36).slice(2, 8);
        var lab = el('label', null, 'Pathway'); lab.setAttribute('for', id);
        var sel = document.createElement('select'); sel.id = id;
        ['', 'STEM', 'Social Sciences', 'Arts and Sports Science'].forEach(function (o) {
          var op = document.createElement('option');
          op.value = o; op.textContent = o || '— choose —';
          if (it.name === o) op.selected = true;
          sel.appendChild(op);
        });
        sel.addEventListener('change', function () { it.name = sel.value; persist(); });
        wrap.appendChild(lab); wrap.appendChild(sel);
        box.appendChild(wrap);
        box.appendChild(field('Description', it.description, function (v) { it.description = v; },
          { textarea: true, style: 'min-height:70px' }).wrap);
        box.appendChild(field('Subject combinations', it.combinations,
          function (v) { it.combinations = v; },
          { placeholder: 'For example: Pure Sciences; Applied Sciences',
            note: 'A school may offer at most two combinations.' }).wrap);
      }
    },
    requirements: {
      target: 'list-requirements', label: 'Requirement', compact: true,
      get: function () { return data.admissions.requirements || (data.admissions.requirements = []); },
      blank: function () { return { item: '' }; },
      render: function (it, box) {
        box.appendChild(field('Item', it.item, function (v) { it.item = v; },
          { placeholder: 'For example: Two pairs of bedsheets' }).wrap);
      }
    },
    documents: {
      target: 'list-documents', label: 'Document', compact: true,
      get: function () { return data.admissions.documents || (data.admissions.documents = []); },
      blank: function () { return { doc: '' }; },
      render: function (it, box) {
        box.appendChild(field('Document', it.doc, function (v) { it.doc = v; },
          { placeholder: 'For example: Birth certificate copy' }).wrap);
      }
    },
    fees: {
      target: 'list-fees', label: 'Fee line',
      get: function () { return data.admissions.fees || (data.admissions.fees = []); },
      blank: function () { return { item: '', form: '', amount: '' }; },
      render: function (it, box) {
        var row = el('div', 'row three');
        row.appendChild(field('Item', it.item, function (v) { it.item = v; },
          { placeholder: 'Tuition' }).wrap);
        row.appendChild(field('Form', it.form, function (v) { it.form = v; },
          { placeholder: 'All forms' }).wrap);
        row.appendChild(field('Amount per term (KES)', it.amount, function (v) { it.amount = v; },
          { placeholder: '12,500' }).wrap);
        box.appendChild(row);
      }
    },
    subjects: {
      target: 'list-subjects', label: 'Subject', compact: true,
      get: function () { return data.academics.subjects || (data.academics.subjects = []); },
      blank: function () { return { subject: '' }; },
      render: function (it, box) {
        box.appendChild(field('Subject', it.subject, function (v) { it.subject = v; }).wrap);
      }
    },
    departments: {
      target: 'list-departments', label: 'Department',
      get: function () { return data.academics.departments || (data.academics.departments = []); },
      blank: function () { return { name: '', description: '' }; },
      render: function (it, box) {
        box.appendChild(field('Department', it.name, function (v) { it.name = v; }).wrap);
        box.appendChild(field('Description', it.description, function (v) { it.description = v; },
          { textarea: true, style: 'min-height:70px' }).wrap);
      }
    },
    clubs: {
      target: 'list-clubs', label: 'Club',
      get: function () { return data.life.clubs || (data.life.clubs = []); },
      blank: function () { return { name: '', description: '' }; },
      render: function (it, box) {
        box.appendChild(field('Club', it.name, function (v) { it.name = v; }).wrap);
        box.appendChild(field('Description', it.description, function (v) { it.description = v; },
          { textarea: true, style: 'min-height:70px' }).wrap);
      }
    },
    sports: {
      target: 'list-sports', label: 'Sport', compact: true,
      get: function () { return data.life.sports || (data.life.sports = []); },
      blank: function () { return { sport: '' }; },
      render: function (it, box) {
        box.appendChild(field('Sport', it.sport, function (v) { it.sport = v; }).wrap);
      }
    },
    principals: {
      target: 'list-principals', label: 'Principal',
      get: function () { return data.leadership.principals; },
      blank: function () { return { name: '', years: '' }; },
      render: function (it, box) {
        var row = el('div', 'row two');
        row.appendChild(field('Name', it.name, function (v) { it.name = v; }).wrap);
        row.appendChild(field('Years of service', it.years, function (v) { it.years = v; },
          { placeholder: '2024 – present' }).wrap);
        box.appendChild(row);
      }
    },
    bom: {
      target: 'list-bom', label: 'Chairperson',
      get: function () { return data.leadership.bom; },
      blank: function () { return { name: '', years: '' }; },
      render: function (it, box) {
        var row = el('div', 'row two');
        row.appendChild(field('Name', it.name, function (v) { it.name = v; }).wrap);
        row.appendChild(field('Years of service', it.years, function (v) { it.years = v; },
          { placeholder: '2023 – present' }).wrap);
        box.appendChild(row);
      }
    },
    gallery: {
      target: 'list-gallery', label: 'Photograph',
      get: function () { return data.gallery; },
      blank: function () { return { image: '', caption: '' }; },
      render: function (it, box) {
        var row = el('div', 'row two');
        row.appendChild(field('File name', it.image, function (v) { it.image = v; },
          { placeholder: 'assets/img/gallery-1.jpg' }).wrap);
        row.appendChild(field('Caption', it.caption, function (v) { it.caption = v; }).wrap);
        box.appendChild(row);
      }
    },
    voices: {
      target: 'list-voices', label: 'Quotation',
      get: function () { return data.voices; },
      blank: function () { return { quote: '', name: '', role: '' }; },
      render: function (it, box) {
        box.appendChild(field('Quotation', it.quote, function (v) { it.quote = v; },
          { textarea: true, style: 'min-height:80px' }).wrap);
        var row = el('div', 'row two');
        row.appendChild(field('Name', it.name, function (v) { it.name = v; }).wrap);
        row.appendChild(field('Role or year', it.role, function (v) { it.role = v; },
          { placeholder: 'Form Four, 2026' }).wrap);
        box.appendChild(row);
      }
    },
    kcse: {
      target: 'list-kcse', label: 'Year',
      get: function () { return data.kcse; },
      blank: function () { return { year: '', entry: '', grades: {}, mean: '', meanGrade: '' }; },
      render: function (it, box) {
        if (!it.grades) it.grades = {};
        var recalc = function () {};   /* replaced below; entry field calls it */
        var row = el('div', 'row two');
        row.appendChild(field('Year', it.year, function (v) { it.year = v ? +v : ''; },
          { type: 'number' }).wrap);
        row.appendChild(field('Candidates entered', it.entry, function (v) {
          it.entry = v ? +v : ''; recalc();
        }, { type: 'number' }).wrap);
        box.appendChild(row);

        var out = el('div', 'f');
        out.innerHTML = '<label>Worked out from the grades below</label>';
        var readout = el('p', 'note');
        out.appendChild(readout);

        recalc = function () {
          var n = 0, pts = 0;
          D.GRADES.forEach(function (g) {
            var c = +it.grades[g] || 0;
            n += c; pts += c * D.POINTS[g];
          });
          if (!n) {
            it.mean = ''; it.meanGrade = '';
            readout.textContent = 'Enter the grade counts to work out the mean.';
            return;
          }
          var m = pts / n;
          it.mean = +m.toFixed(3);
          /* The school rounds the mean to the nearest grade point rather than
             rounding down. Verified against every year on the school's own
             board, 2013 to 2024. */
          var rounded = Math.min(12, Math.max(1, Math.round(m)));
          var g = D.BY_POINT[rounded];
          it.meanGrade = g;
          var warn = (it.entry && +it.entry !== n)
            ? '  \u2014  note: the grades add up to ' + n + ' but ' + it.entry + ' candidates were entered.'
            : '';
          readout.textContent = 'Mean ' + it.mean.toFixed(3) + ', grade ' + g +
            ', from ' + n + ' candidates.' + warn;
        }

        var grid = el('div', 'grades');
        D.GRADES.forEach(function (g) {
          var f = field(g, it.grades[g], function (v) {
            if (v === '') delete it.grades[g]; else it.grades[g] = +v;
            recalc();
          }, { type: 'number' });
          grid.appendChild(f.wrap);
        });
        box.appendChild(grid);
        box.appendChild(out);
        recalc();
      }
    }
  };

  function drawList(key) {
    var spec = LISTS[key];
    var host = document.getElementById(spec.target);
    if (!host) return;
    var arr = spec.get();
    host.innerHTML = '';
    if (!arr.length) {
      host.appendChild(el('p', 'none', 'Nothing added yet.'));
      return;
    }
    arr.forEach(function (it, i) {
      var box = el('div', 'item');
      var head = el('div', 'item__head');
      head.appendChild(el('strong', null, spec.label + ' ' + (i + 1)));
      var del = el('button', 'btn btn--danger', 'Remove');
      del.type = 'button';
      del.addEventListener('click', function () {
        arr.splice(i, 1); persist(); drawList(key);
        D.toast(spec.label + ' removed');
      });
      head.appendChild(del);
      box.appendChild(head);
      spec.render(it, box);
      host.appendChild(box);
    });
  }

  D.LISTS = LISTS;
  D.drawList = drawList;
})();
