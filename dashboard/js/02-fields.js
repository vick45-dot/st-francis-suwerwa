/* ========================================================
   FIELD BUILDERS
   Small helpers that build a labelled input and wire it straight
   to the content object.
   ======================================================== */

(function () {
  'use strict';
  var D = window.DASH;

  D.el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };

  /* label + input/textarea, bound to a callback */
  D.field = function (label, value, oninput, opts) {
    opts = opts || {};
    var wrap = D.el('div', 'f');
    var id = 'f' + Math.random().toString(36).slice(2, 9);

    var lab = D.el('label', null, label);
    lab.setAttribute('for', id);

    var input = document.createElement(opts.textarea ? 'textarea' : 'input');
    input.id = id;
    if (opts.type) input.type = opts.type;
    if (opts.placeholder) input.placeholder = opts.placeholder;
    if (opts.style) input.setAttribute('style', opts.style);
    input.value = (value === undefined || value === null) ? '' : value;
    input.addEventListener('input', function () { oninput(input.value); D.persist(); });

    wrap.appendChild(lab);
    wrap.appendChild(input);
    if (opts.note) wrap.appendChild(D.el('p', 'note', opts.note));
    return { wrap: wrap, input: input };
  };

  /* label + dropdown */
  D.select = function (label, value, options, onchange) {
    var wrap = D.el('div', 'f');
    var id = 's' + Math.random().toString(36).slice(2, 9);
    var lab = D.el('label', null, label);
    lab.setAttribute('for', id);
    var sel = document.createElement('select');
    sel.id = id;
    options.forEach(function (o) {
      var op = document.createElement('option');
      op.value = o; op.textContent = o || '\u2014 choose \u2014';
      if (value === o) op.selected = true;
      sel.appendChild(op);
    });
    sel.addEventListener('change', function () { onchange(sel.value); D.persist(); });
    wrap.appendChild(lab); wrap.appendChild(sel);
    return { wrap: wrap, input: sel };
  };

  /* the simple top-level inputs marked with data-k */
  D.bindSimpleFields = function () {
    document.querySelectorAll('[data-k]').forEach(function (el) {
      var v = D.getPath(el.dataset.k);
      el.value = (v === undefined || v === null) ? '' : v;
      el.addEventListener('input', function () {
        D.setPath(el.dataset.k, el.value.trim());
        D.persist();
      });
    });
  };
})();
