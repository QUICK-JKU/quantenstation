/* ============================================================
   Quantenstation · 60 Jahre JKU
   "Teste selbst" — Prüf-Engine für die 20 Vor-Ort-Challenges.

   Ablauf vor Ort: Aufgabe hier lesen → Drehung mit dem Magneten
   auf der echten Kugel ausführen → Ergebnis hier eingeben und
   sofort prüfen lassen. Level 4 wird direkt mit assets/bloch-
   gates.js simuliert statt nur gegen eine feste Liste geprüft —
   das deckt auch Sonderfälle ab, die beim Ausdenken übersehen
   wurden.
   ============================================================ */
(function (global) {
  'use strict';

  var BG = global.BlochGates;
  var DATA = global.BLOCH_CHALLENGES;
  if (!BG || !DATA) return;

  var LEVELS = DATA.meta.levels;
  var STATE_ORDER = ['0', '1', '+', '-', '+i', '-i'];
  var PRETTY_GATE = { Sdg: 'S†', Tdg: 'T†' };

  /* Sprache der Seite. Die Aufgabentexte kommen aus dem jeweiligen
     challenges-data.js (de bzw. en/), hier nur die Texte der Engine. */
  var EN = /^en/i.test(document.documentElement.lang || '');
  function tr(de, en) { return EN ? en : de; }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function formatGate(tok) {
    if (PRETTY_GATE[tok]) return PRETTY_GATE[tok];
    var m = /^(Rx|Ry|Rz)\((-?[\d.]+)deg\)$/.exec(tok);
    if (m) return m[1] + '(' + m[2] + '°)';
    return tok;
  }

  function gateChip(tok) {
    return '<span class="gate-chip">' + formatGate(tok) + '</span>';
  }

  function traceText(trace) {
    return trace.map(function (v) {
      var nm = BG.nameOf(v, 1e-4);
      if (nm) return BG.STATE_LABEL[nm];
      var a = BG.angles(v);
      return 'θ ' + Math.round(a.theta) + '°' + (a.phi == null ? '' : ' · φ ' + Math.round(a.phi) + '°');
    }).join('  →  ');
  }

  function feedback(good, html) {
    var box = el('div', 'quiz-fb ' + (good ? 'is-good' : 'is-bad'));
    box.appendChild(el('div', 'quiz-fb-head', good ? tr('✓ Richtig', '✓ Correct') : tr('✗ Noch nicht', '✗ Not yet')));
    if (html) {
      var b = el('div', 'quiz-fb-body');
      b.innerHTML = html;
      box.appendChild(b);
    }
    return box;
  }

  function replaceFeedback(host, node) {
    var old = $('.quiz-fb', host);
    if (old) old.remove();
    host.appendChild(node);
  }

  /* ---------- wiederverwendbare Antwort-Widgets ---------- */

  /* Sechs-Zustände-Auswahl. checkFn(key) -> bool. onDone() bei Erfolg. */
  function namedStatePicker(host, checkFn, onDone, revealHtml) {
    var wrap = el('div', 'state-picker');
    var done = false;
    STATE_ORDER.forEach(function (k) {
      var b = el('button', 'state-btn', BG.STATE_LABEL[k]);
      b.type = 'button';
      b.addEventListener('click', function () {
        if (done) return;
        if (checkFn(k)) {
          done = true;
          b.classList.add('is-right');
          Array.prototype.forEach.call(wrap.children, function (o) { o.disabled = true; });
          replaceFeedback(host, feedback(true, revealHtml || ''));
          if (onDone) onDone();
        } else {
          b.classList.add('is-wrong');
          b.disabled = true;
          replaceFeedback(host, feedback(false, tr('Das ist nicht der Zielzustand — versuch\'s mit einem anderen Punkt.', 'That is not the target state — try another point.')));
        }
      });
      wrap.appendChild(b);
    });
    host.appendChild(wrap);
  }

  /* θ/φ-Zahleneingabe mit Toleranz. */
  function anglePicker(host, expected, tolerance, onDone) {
    var form = el('form');
    form.setAttribute('novalidate', '');
    var row = el('div', 'angle-row');
    form.appendChild(row);

    function field(labelTxt, ph) {
      var f = el('div', 'angle-field');
      f.appendChild(el('label', null, labelTxt));
      var inp = el('input');
      inp.type = 'text'; inp.inputMode = 'decimal'; inp.className = 'q-input';
      inp.placeholder = ph; inp.autocomplete = 'off';
      f.appendChild(inp);
      row.appendChild(f);
      return inp;
    }

    var thetaInp = field(tr('θ in Grad', 'θ in degrees'), '0–180');
    var phiInp = expected.phi_deg == null ? null : field(tr('φ in Grad', 'φ in degrees'), '0–360');

    var btn = el('button', 'q-btn q-btn-primary q-btn-block q-mt-sm', tr('Prüfen', 'Check'));
    btn.type = 'submit';
    form.appendChild(btn);

    var wrap = el('div');
    wrap.appendChild(form);
    host.appendChild(wrap);

    var misses = 0, done = false;

    function offerSolution() {
      if ($('.angle-give', wrap)) return;
      var d = el('details', 'q-acc q-mt-sm angle-give');
      d.appendChild(el('summary', null, tr('Lösung anzeigen', 'Show solution')));
      var body = el('div', 'q-acc-body');
      body.innerHTML = tr('Gesucht', 'Target') + ': θ ≈ <strong>' + expected.theta_deg + '°</strong>' +
        (expected.phi_deg == null ? '' : ' · φ ≈ <strong>' + expected.phi_deg + '°</strong>');
      d.appendChild(body);
      wrap.appendChild(d);
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (done) return;
      var t = parseFloat(String(thetaInp.value).replace(',', '.'));
      var p = phiInp ? parseFloat(String(phiInp.value).replace(',', '.')) : null;

      var okT = !isNaN(t) && Math.abs(t - expected.theta_deg) <= tolerance;
      var okP = !phiInp || (!isNaN(p) && BG.angleDiff(p, expected.phi_deg) <= tolerance);

      if (okT && okP) {
        done = true;
        thetaInp.disabled = true; if (phiInp) phiInp.disabled = true;
        btn.disabled = true;
        var give = $('.angle-give', wrap); if (give) give.remove();
        replaceFeedback(host, feedback(true, ''));
        if (onDone) onDone();
      } else {
        misses++;
        replaceFeedback(host, feedback(false, isNaN(t) || (phiInp && isNaN(p))
          ? tr('Bitte beide Winkel als Zahl eingeben.', 'Please enter both angles as numbers.')
          : tr('Noch außerhalb der ±' + tolerance + '°-Toleranz. Nochmal ablesen und eintragen.',
               'Still outside the ±' + tolerance + '° tolerance. Read it off again and enter it.')));
        if (misses >= 2) offerSolution();
      }
    });
  }

  /* ---------- Aufgaben-Typen ---------- */

  function renderSequence(ch, body, onDone) {
    var task = el('p', 'q-body');
    task.innerHTML = tr('Start bei <strong>', 'Start at <strong>') + ch.start_label + '</strong>. ' +
      tr('Wende der Reihe nach an: ', 'Apply in order: ') +
      '<span class="gate-seq">' + ch.sequence.map(gateChip).join(' ') + '</span>';
    body.appendChild(task);

    var answer = el('div', 'q-mt-sm');
    body.appendChild(answer);

    var reveal = tr('So wandert der Punkt:', 'This is how the point moves:') + '<br><span class="trace-note">' + traceText(ch.trace) + '</span>';

    if (ch.expected.state !== null) {
      namedStatePicker(answer, function (k) { return k === ch.expected.state; }, onDone, reveal);
    } else {
      anglePicker(answer, ch.expected, ch.tolerance_deg || 15, function () {
        replaceFeedback(answer, feedback(true, reveal));
        if (onDone) onDone();
      });
    }
  }

  function renderFreeSequence(ch, body, onDone) {
    body.appendChild(el('p', 'q-body', ch.prompt));
    body.appendChild(el('p', 'q-fine', 'Start: ' + BG.STATE_LABEL[ch.start] + tr(' · Ziel: ', ' · target: ') + BG.STATE_LABEL[ch.target] +
      tr(' · erlaubt: ', ' · allowed: ') + ch.allowed_gates.map(formatGate).join(', ')));

    var seq = [];
    var current = el('div', 'seq-current');
    current.appendChild(el('span', 'q-fine', tr('(noch keine Gatter)', '(no gates yet)')));

    function renderCurrent() {
      current.innerHTML = '';
      if (!seq.length) { current.appendChild(el('span', 'q-fine', tr('(noch keine Gatter)', '(no gates yet)'))); return; }
      seq.forEach(function (g) { current.appendChild(el('span', 'gate-chip', formatGate(g))); });
    }

    var btnRow = el('div', 'seq-builder');
    ch.allowed_gates.forEach(function (g) {
      var b = el('button', 'q-btn', formatGate(g));
      b.type = 'button';
      b.addEventListener('click', function () { seq.push(g); renderCurrent(); });
      btnRow.appendChild(b);
    });
    var undo = el('button', 'q-btn', '⌫');
    undo.type = 'button';
    undo.addEventListener('click', function () { seq.pop(); renderCurrent(); });
    var clear = el('button', 'q-btn', '↺');
    clear.type = 'button';
    clear.addEventListener('click', function () { seq = []; renderCurrent(); });
    btnRow.appendChild(undo);
    btnRow.appendChild(clear);

    var check = el('button', 'q-btn q-btn-primary q-btn-block q-mt-sm', tr('Prüfen', 'Check'));
    check.type = 'button';

    body.appendChild(btnRow);
    body.appendChild(el('div', 'q-mt-sm', null));
    body.lastChild.appendChild(current);
    body.appendChild(check);

    check.addEventListener('click', function () {
      if (!seq.length) return;
      var result = BG.run(ch.start, seq);
      var host = body;
      if (BG.sameVec(result.vec, BG.STATE_VEC[ch.target])) {
        var optimal = seq.length === ch.optimal_length;
        replaceFeedback(host, feedback(true,
          optimal
            ? tr('Und dazu noch mit der minimalen Länge (', 'And with the minimum length, too (') + ch.optimal_length + ') — optimal! 🏅'
            : tr('Richtig! Es geht sogar mit nur ', 'Correct! It even works with just ') + ch.optimal_length + tr(' Gattern, z. B. ', ' gates, e.g. ') +
              ch.optimal_solutions[0].map(formatGate).join(' → ') + '.'));
        if (onDone) onDone();
      } else {
        replaceFeedback(host, feedback(false, EN
          ? 'Does not land on ' + BG.STATE_LABEL[ch.target] + ' yet. Keep trying or start over with ↺.'
          : 'Landet noch nicht bei ' + BG.STATE_LABEL[ch.target] + '. Weiter probieren oder mit ↺ neu anfangen.'));
      }
    });
  }

  function renderFillGap(ch, body, onDone) {
    body.appendChild(el('p', 'q-body', ch.prompt));
    var seqLine = el('p', 'q-body');
    seqLine.innerHTML = '<span class="gate-seq">' + ch.template.map(function (g) {
      return g === '?' ? '<span class="gate-chip gate-gap">?</span>' : gateChip(g);
    }).join(' ') + '</span>';
    body.appendChild(seqLine);

    var opts = el('div', 'quiz-opts');
    var done = false;
    ch.options.forEach(function (g) {
      var b = el('button', 'quiz-opt', formatGate(g) + '  (' + g + ')');
      b.type = 'button';
      b.addEventListener('click', function () {
        if (done) return;
        var filled = ch.template.map(function (t) { return t === '?' ? g : t; });
        var result = BG.run(ch.start, filled);
        if (BG.sameVec(result.vec, BG.STATE_VEC[ch.target])) {
          done = true;
          b.classList.add('is-right');
          Array.prototype.forEach.call(opts.children, function (o) { o.disabled = true; });
          replaceFeedback(body, feedback(true, ''));
          if (onDone) onDone();
        } else {
          b.classList.add('is-wrong');
          b.disabled = true;
          replaceFeedback(body, feedback(false, tr('Damit landest du nicht bei ', 'That does not take you to ') + BG.STATE_LABEL[ch.target] + '.'));
        }
      });
      opts.appendChild(b);
    });
    body.appendChild(opts);
  }

  function renderIdentifyGate(ch, body, onDone) {
    body.appendChild(el('p', 'q-body', ch.prompt));
    var tests = el('p', 'q-fine');
    tests.innerHTML = ch.tests.map(function (t) {
      return BG.STATE_LABEL[t.in] + ' → ' + BG.STATE_LABEL[t.out];
    }).join(' &nbsp;·&nbsp; ');
    body.appendChild(tests);

    var opts = el('div', 'quiz-opts');
    var done = false;
    ch.options.forEach(function (g) {
      var b = el('button', 'quiz-opt', formatGate(g) + '  (' + g + ')');
      b.type = 'button';
      b.addEventListener('click', function () {
        if (done) return;
        var ok = ch.tests.every(function (t) {
          return BG.sameVec(BG.applyGate(BG.STATE_VEC[t.in], g), BG.STATE_VEC[t.out]);
        });
        if (ok) {
          done = true;
          b.classList.add('is-right');
          Array.prototype.forEach.call(opts.children, function (o) { o.disabled = true; });
          replaceFeedback(body, feedback(true, ch.explanation || ''));
          if (onDone) onDone();
        } else {
          b.classList.add('is-wrong');
          b.disabled = true;
          replaceFeedback(body, feedback(false, tr('Passt nicht zu beiden Tests.', 'Does not match both tests.')));
        }
      });
      opts.appendChild(b);
    });
    body.appendChild(opts);
  }

  function renderCount(ch, body, onDone) {
    body.appendChild(el('p', 'q-body', ch.prompt));

    var form = el('form');
    form.setAttribute('novalidate', '');
    var row = el('div', 'angle-row');
    form.appendChild(row);
    function field(labelTxt) {
      var f = el('div', 'angle-field');
      f.appendChild(el('label', null, labelTxt));
      var inp = el('input');
      inp.type = 'text'; inp.inputMode = 'numeric'; inp.className = 'q-input'; inp.autocomplete = 'off';
      f.appendChild(inp);
      row.appendChild(f);
      return inp;
    }
    var back = field(tr('zurück zu |+⟩', 'back to |+⟩'));
    var minus = field(tr('bis |−⟩', 'until |−⟩'));
    var btn = el('button', 'q-btn q-btn-primary q-btn-block q-mt-sm', tr('Prüfen', 'Check'));
    btn.type = 'submit';
    form.appendChild(btn);

    body.appendChild(form);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var a = parseInt(back.value, 10), b = parseInt(minus.value, 10);
      if (a === ch.answers.return_to_start && b === ch.answers.reach_minus) {
        back.disabled = true; minus.disabled = true; btn.disabled = true;
        replaceFeedback(body, feedback(true, ''));
        if (onDone) onDone();
      } else {
        replaceFeedback(body, feedback(false, tr('Noch nicht beide Zahlen richtig. T ist eine Achtel-Drehung um z — wie viele Achtel sind eine ganze bzw. eine halbe Umdrehung?', 'Not both numbers right yet. T is an eighth of a turn about z — how many eighths make a full turn, and how many a half turn?')));
      }
    });
  }

  function renderCompareOrders(ch, body, onDone) {
    body.appendChild(el('p', 'q-body', ch.prompt));
    var doneA = false, doneB = false;

    ['A', 'B'].forEach(function (key) {
      var sub = ch[key];
      var box = el('div', 'q-card q-mt-sm');
      box.appendChild(el('div', 'quiz-qnum', tr('FOLGE ', 'SEQUENCE ') + key));
      var line = el('p', 'q-body');
      line.innerHTML = '<span class="gate-seq">' + sub.sequence.map(gateChip).join(' ') + '</span>';
      box.appendChild(line);
      var answer = el('div', 'q-mt-sm');
      box.appendChild(answer);
      namedStatePicker(answer, function (k) { return k === sub.expected; }, function () {
        if (key === 'A') doneA = true; else doneB = true;
        if (doneA && doneB && onDone) onDone();
      });
      body.appendChild(box);
    });
  }

  var RENDERERS = {
    sequence: renderSequence,
    free_sequence: renderFreeSequence,
    fill_gap: renderFillGap,
    identify_gate: renderIdentifyGate,
    count: renderCount,
    compare_orders: renderCompareOrders
  };

  function challengeCard(ch, index, onDone) {
    var card = el('div', 'q-card challenge-card');
    card.appendChild(el('div', 'quiz-qnum', tr('AUFGABE ', 'TASK ') + index + ' · ' + (LEVELS[ch.level] || '').toUpperCase()));
    var body = el('div');
    card.appendChild(body);
    var render = RENDERERS[ch.type];
    if (render) render(ch, body, onDone);
    return card;
  }

  /* ---------- Level-Auswahl + Liste ---------- */

  function renderLevelPills(container, onChange) {
    [1, 2, 3, 4].forEach(function (lv) {
      var b = el('button', 'level-pill' + (lv === 1 ? ' is-active' : ''), LEVELS[lv]);
      b.type = 'button';
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(container.querySelectorAll('.level-pill'), function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        onChange(lv);
      });
      container.appendChild(b);
    });
  }

  function renderList(root) {
    var pills = $('[data-level-pills]', root);
    var list = $('[data-challenges]', root);
    if (!pills || !list) return;

    function show(lv) {
      list.innerHTML = '';
      DATA.challenges
        .filter(function (c) { return c.level === lv; })
        .forEach(function (ch, i) { list.appendChild(challengeCard(ch, i + 1)); });
    }

    renderLevelPills(pills, show);
    show(1);
  }

  function init() {
    var root = document;
    if ($('[data-challenges]', root)) renderList(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
