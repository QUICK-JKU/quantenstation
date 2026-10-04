/* ============================================================
   Quantenstation · 60 Jahre JKU
   "Teste selbst" — Prüf-Engine für die 20 Vor-Ort-Challenges.

   Ablauf vor Ort: Aufgabe hier lesen → Drehung mit dem Magneten
   auf der echten Kugel ausführen → Ergebnis hier eingeben und
   sofort prüfen lassen. Level 3 wird direkt mit assets/bloch-
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

    function field(labelHtml, ph) {
      var f = el('div', 'angle-field');
      var lab = el('label');
      lab.innerHTML = labelHtml;
      f.appendChild(lab);
      var inp = el('input');
      inp.type = 'text'; inp.inputMode = 'decimal'; inp.className = 'q-input';
      inp.placeholder = ph; inp.autocomplete = 'off';
      f.appendChild(inp);
      row.appendChild(f);
      return inp;
    }

    var thetaInp = field('<b class="ang-theta">θ</b>' + tr(' in Grad (ab +Z)', ' in degrees (from +Z)'), '0–180');
    var phiInp = expected.phi_deg == null ? null : field('<b class="ang-phi">φ</b>' + tr(' in Grad (+X → +Y)', ' in degrees (+X → +Y)'), '0–360');

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

    var hint = el('details', 'q-acc q-spoiler q-mt-sm');
    hint.appendChild(el('summary', null, tr('Spoiler: Tipp anzeigen', 'Spoiler: Show hint')));
    hint.appendChild(el('div', 'q-acc-body', tr(
      'Noch nicht beide Zahlen richtig. T ist eine Achtel-Drehung um z — wie viele Achtel sind eine ganze bzw. eine halbe Umdrehung?',
      'Not both numbers right yet. T is an eighth of a turn about z — how many eighths make a full turn, and how many a half turn?')));
    body.appendChild(hint);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var a = parseInt(back.value, 10), b = parseInt(minus.value, 10);
      if (a === ch.answers.return_to_start && b === ch.answers.reach_minus) {
        back.disabled = true; minus.disabled = true; btn.disabled = true;
        replaceFeedback(body, feedback(true, ''));
        if (onDone) onDone();
      } else {
        replaceFeedback(body, feedback(false, tr('Noch nicht beide Zahlen richtig.', 'Not both numbers right yet.')));
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

  /* ---------- Gatter-Glossar je Stufe ---------- */

  /* Dieselben Beschreibungen wie auf den gedruckten Karten
     (challenge-cards/canvas.html, GATE_INFO / AXIS_DESC): erst die
     Drehung (Winkel + Achse), dann zwei Beispiele, die sich direkt an
     der echten Kugel nachprüfen lassen. */
  function gateInfo() {
    return {
      X:   tr('Dreht 180° um die x-Achse: |0⟩ auf |1⟩, lässt |+⟩ unverändert.',
              'Rotates 180° about the x-axis: |0⟩ to |1⟩, leaves |+⟩ unchanged.'),
      Y:   tr('Dreht 180° um die y-Achse: |0⟩ auf |1⟩, lässt |+i⟩ unverändert.',
              'Rotates 180° about the y-axis: |0⟩ to |1⟩, leaves |+i⟩ unchanged.'),
      Z:   tr('Dreht 180° um die z-Achse: |+⟩ auf |−⟩, lässt |0⟩ unverändert.',
              'Rotates 180° about the z-axis: |+⟩ to |−⟩, leaves |0⟩ unchanged.'),
      H:   tr('Dreht 180° um die Achse zwischen x und z: |0⟩ auf |+⟩, |1⟩ auf |−⟩.',
              'Rotates 180° about the axis between x and z: |0⟩ to |+⟩, |1⟩ to |−⟩.'),
      S:   tr('Dreht 90° um die z-Achse: |+⟩ auf |+i⟩, lässt |0⟩ unverändert.',
              'Rotates 90° about the z-axis: |+⟩ to |+i⟩, leaves |0⟩ unchanged.'),
      Sdg: tr('Dreht −90° um die z-Achse: |+⟩ auf |−i⟩, lässt |0⟩ unverändert.',
              'Rotates −90° about the z-axis: |+⟩ to |−i⟩, leaves |0⟩ unchanged.'),
      T:   tr('Dreht 45° um die z-Achse: |+⟩ ein Achtel Richtung |+i⟩ (2×T = S), lässt |0⟩ unverändert.',
              'Rotates 45° about the z-axis: |+⟩ an eighth of a turn towards |+i⟩ (2×T = S), leaves |0⟩ unchanged.'),
      Tdg: tr('Dreht −45° um die z-Achse: |+⟩ ein Achtel Richtung |−i⟩, lässt |0⟩ unverändert.',
              'Rotates −45° about the z-axis: |+⟩ an eighth of a turn towards |−i⟩, leaves |0⟩ unchanged.'),
      Rx:  tr('Dreht um θ um die x-Achse, lässt |+⟩/|−⟩ unverändert; z. B. bei 90°: dreht |0⟩ auf |−i⟩.',
              'Rotates by θ about the x-axis, leaves |+⟩/|−⟩ unchanged; e.g. at 90°: turns |0⟩ into |−i⟩.'),
      Ry:  tr('Dreht um θ um die y-Achse, lässt |+i⟩/|−i⟩ unverändert; z. B. bei 90°: dreht |0⟩ auf |+⟩.',
              'Rotates by θ about the y-axis, leaves |+i⟩/|−i⟩ unchanged; e.g. at 90°: turns |0⟩ into |+⟩.'),
      Rz:  tr('Dreht um θ um die z-Achse, lässt |0⟩/|1⟩ unverändert; z. B. bei 90°: dreht |+⟩ auf |+i⟩ (= S).',
              'Rotates by θ about the z-axis, leaves |0⟩/|1⟩ unchanged; e.g. at 90°: turns |+⟩ into |+i⟩ (= S).')
    };
  }

  /* Alle Gatter, die eine Stufe braucht — in der Reihenfolge des ersten
     Auftretens, ohne Doppelte; Rx/Ry/Rz stehen je einmal für alle Winkel. */
  function levelGateKeys(level) {
    var names = [];
    DATA.challenges.filter(function (c) { return c.level === level; }).forEach(function (c) {
      if (c.sequence) names = names.concat(c.sequence);
      if (c.template) names = names.concat(c.template);
      if (c.allowed_gates) names = names.concat(c.allowed_gates);
      if (c.options) names = names.concat(c.options);
      if (c.type === 'count') names.push('T');
      if (c.A) names = names.concat(c.A.sequence, c.B.sequence);
    });
    var seen = {}, keys = [];
    names.forEach(function (n) {
      var m = /^(R[xyz])\(/.exec(n);
      var key = m ? m[1] : n;
      if (n === '?' || seen[key]) return;
      seen[key] = true;
      keys.push(key);
    });
    return keys;
  }

  function gateGlossary(level) {
    var info = gateInfo();
    var keys = levelGateKeys(level).filter(function (k) { return info[k]; });
    var d = el('details', 'q-acc gate-info');
    d.open = true;
    d.appendChild(el('summary', null, tr('Die Gatter dieser Stufe', 'The gates in this level')));
    var body = el('div', 'q-acc-body');
    keys.forEach(function (k) {
      var row = el('div', 'gate-info-row');
      var label = /^R[xyz]$/.test(k) ? k + '(θ)' : formatGate(k);
      row.appendChild(el('span', 'gate-chip', label));
      var desc = el('span', 'gate-info-desc');
      /* Kets zusammenhalten, sonst bricht |−i⟩ mitten im Zustand um. */
      desc.innerHTML = info[k].replace(/\|[^|⟩ ]+⟩/g, '<span style="white-space:nowrap">$&</span>');
      row.appendChild(desc);
      body.appendChild(row);
    });
    d.appendChild(body);
    return d;
  }

  /* ---------- Winkel-Anleitung (θ / φ) für die Aufgaben mit Winkeleingabe ---------- */

  /* Kleine Kugel mit einem Beispielpunkt. Die Geometrie wird hier
     gerechnet (statt fest gezeichnet), damit Bogen und Hilfslinien
     garantiert zu den Winkeln passen. Blickrichtung: von schräg oben,
     +X zeigt nach vorn-links, +Y nach rechts, +Z nach oben. */
  function angleDiagram(thetaDeg, phiDeg) {
    var R = 100, cx = 150, cy = 148;
    var al = 250 * Math.PI / 180, ev = 18 * Math.PI / 180;
    var rad = Math.PI / 180;

    function P(x, y, z) {
      var xr = x * Math.cos(al) - y * Math.sin(al);
      var yr = x * Math.sin(al) + y * Math.cos(al);
      return {
        x: cx + R * xr,
        y: cy - R * (z * Math.cos(ev) + yr * Math.sin(ev)),
        front: (-yr * Math.cos(ev) + z * Math.sin(ev)) >= 0
      };
    }
    function f(n) { return n.toFixed(1); }
    function line(a, b, attrs) {
      return '<line x1="' + f(a.x) + '" y1="' + f(a.y) + '" x2="' + f(b.x) + '" y2="' + f(b.y) + '" ' + attrs + '/>';
    }
    function path(pts, attrs) {
      return '<polyline fill="none" points="' + pts.map(function (q) { return f(q.x) + ',' + f(q.y); }).join(' ') + '" ' + attrs + '/>';
    }
    function text(q, dx, dy, str, attrs) {
      return '<text x="' + f(q.x + dx) + '" y="' + f(q.y + dy) + '" ' + attrs + '>' + str + '</text>';
    }
    /* Kreis in 3D, aufgeteilt in sichtbaren (vorn) und verdeckten (hinten) Teil. */
    function ring(fn, frontAttrs, backAttrs) {
      var out = '', run = [], runFront = null;
      for (var t = 0; t <= 360; t += 4) {
        var q = fn(t * rad);
        if (runFront !== null && q.front !== runFront) {
          run.push(q);   // Übergangspunkt in beiden Teilen, damit keine Lücke bleibt
          out += path(run, runFront ? frontAttrs : backAttrs);
          run = [];
        }
        run.push(q);
        runFront = q.front;
      }
      if (run.length > 1) out += path(run, runFront ? frontAttrs : backAttrs);
      return out;
    }

    var th = thetaDeg * rad, ph = phiDeg * rad;
    var O = P(0, 0, 0);
    var V = P(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th));
    var F = P(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), 0);   // Fußpunkt auf dem Äquator

    var svg = '<svg class="angle-svg" viewBox="0 0 300 282" role="img" aria-label="' +
      tr('Bloch-Kugel mit den Winkeln θ (von +Z) und φ (von +X nach +Y)', 'Bloch sphere with the angles θ (from +Z) and φ (from +X towards +Y)') + '">';

    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="#fbf9f3" stroke="#14161c" stroke-opacity=".35" stroke-width="1.5"/>';

    // Äquator
    svg += ring(function (t) { return P(Math.cos(t), Math.sin(t), 0); },
      'stroke="#14161c" stroke-opacity=".45" stroke-width="1.3"',
      'stroke="#14161c" stroke-opacity=".25" stroke-width="1.1" stroke-dasharray="3 3"');
    // Meridian durch den Punkt (die Ebene, in der θ gemessen wird)
    svg += ring(function (t) { return P(Math.sin(t) * Math.cos(ph), Math.sin(t) * Math.sin(ph), Math.cos(t)); },
      'stroke="#1f5bff" stroke-opacity=".35" stroke-width="1.1"',
      'stroke="#1f5bff" stroke-opacity=".2" stroke-width="1" stroke-dasharray="3 3"');

    // Achsen
    var ax = 'stroke="#14161c" stroke-opacity=".55" stroke-width="1.3"';
    svg += line(P(0, 0, -1), P(0, 0, 1.2), ax);
    svg += line(O, P(1.2, 0, 0), ax);
    svg += line(O, P(0, 1.2, 0), ax);
    var lab = 'font-family="IBM Plex Mono, monospace" font-size="12.5" font-weight="700" fill="#14161c"';
    svg += text(P(0, 0, 1.2), 0, -7, '+Z', lab + ' text-anchor="middle"');
    svg += text(P(0, 0, 1.2), 0, -20, '|0⟩', lab + ' text-anchor="middle" fill-opacity=".6"');
    svg += text(P(0, 0, -1), 0, 16, '|1⟩', lab + ' text-anchor="middle" fill-opacity=".6"');
    svg += text(P(1.2, 0, 0), -6, 14, '+X', lab + ' text-anchor="end"');
    svg += text(P(0, 1.2, 0), 7, 4, '+Y', lab);

    // Hilfslinien vom Punkt zum Äquator und zurück zum Mittelpunkt
    var dot = 'stroke="#14161c" stroke-opacity=".6" stroke-width="1.3" stroke-dasharray="2 3"';
    svg += line(V, F, dot);
    svg += line(O, F, dot);

    // φ: Bogen auf dem Äquator von +X bis zum Fußpunkt
    var phiArc = [], u;
    for (u = 0; u < phiDeg; u += 2) phiArc.push(P(0.42 * Math.cos(u * rad), 0.42 * Math.sin(u * rad), 0));
    phiArc.push(P(0.42 * Math.cos(ph), 0.42 * Math.sin(ph), 0));
    svg += path(phiArc, 'stroke="#c98a1a" stroke-width="3" stroke-linecap="round"');

    // θ: Bogen von +Z bis zum Punkt
    var thArc = [], t;
    for (t = 0; t < thetaDeg; t += 2) thArc.push(P(0.5 * Math.sin(t * rad) * Math.cos(ph), 0.5 * Math.sin(t * rad) * Math.sin(ph), 0.5 * Math.cos(t * rad)));
    thArc.push(P(0.5 * Math.sin(th) * Math.cos(ph), 0.5 * Math.sin(th) * Math.sin(ph), 0.5 * Math.cos(th)));
    svg += path(thArc, 'stroke="#1f5bff" stroke-width="3" stroke-linecap="round"');

    // Zustandsvektor + Punkt
    svg += line(O, V, 'stroke="#14161c" stroke-width="2.6" stroke-linecap="round"');
    svg += '<circle cx="' + f(V.x) + '" cy="' + f(V.y) + '" r="6" fill="#8b3dff" stroke="#fff" stroke-width="1.6"/>';

    // Winkelbeschriftung
    var greek = 'font-family="Georgia, serif" font-size="21" font-style="italic" font-weight="700"';
    var tm = thetaDeg / 2 * rad;
    var tl = P(0.72 * Math.sin(tm) * Math.cos(ph), 0.72 * Math.sin(tm) * Math.sin(ph), 0.72 * Math.cos(tm));
    svg += text(tl, -16, 6, 'θ', greek + ' fill="#1f5bff"');
    var pm = phiDeg / 2 * rad;
    var pl = P(0.62 * Math.cos(pm), 0.62 * Math.sin(pm), 0);
    svg += text(pl, 2, 20, 'φ', greek + ' fill="#c98a1a"');

    return svg + '</svg>';
  }

  function angleGuide() {
    var TH = 50, PH = 40;
    var d = el('details', 'q-acc angle-guide');
    d.open = true;
    d.appendChild(el('summary', null, tr('So liest du θ und φ', 'How to read θ and φ')));
    var body = el('div', 'q-acc-body');
    var fig = el('div', 'angle-fig');
    fig.innerHTML = angleDiagram(TH, PH);
    body.appendChild(fig);
    var txt = el('div', 'angle-guide-text');
    txt.innerHTML =
      '<p><b class="ang-theta">θ</b> ' + tr(
        '(Theta) misst, wie weit der Punkt vom <strong>Nordpol |0⟩ (+Z)</strong> weggedreht ist: 0° = |0⟩, 90° = Äquator, 180° = |1⟩.',
        '(theta) measures how far the point is turned away from the <strong>north pole |0⟩ (+Z)</strong>: 0° = |0⟩, 90° = equator, 180° = |1⟩.') + '</p>' +
      '<p><b class="ang-phi">φ</b> ' + tr(
        '(Phi) misst, wie weit der Punkt <strong>um die z-Achse</strong> gedreht ist — ab +X in Richtung +Y, von 0° bis 360°. An den Polen gibt es kein φ.',
        '(phi) measures how far the point is turned <strong>around the z-axis</strong> — from +X towards +Y, from 0° to 360°. There is no φ at the poles.') + '</p>' +
      '<p>' + tr('Im Bild: ', 'In the picture: ') + '<b class="ang-theta">θ = ' + TH + '°</b>, <b class="ang-phi">φ = ' + PH + '°</b>.</p>' +
      '<p class="q-fine">' + tr('Zum Vergleich', 'For comparison') + ': |+⟩ → θ 90°, φ 0° · |+i⟩ → θ 90°, φ 90° · |−⟩ → θ 90°, φ 180° · |−i⟩ → θ 90°, φ 270°</p>';
    body.appendChild(txt);
    d.appendChild(body);
    return d;
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
      var levelChallenges = DATA.challenges.filter(function (c) { return c.level === lv; });
      if (levelChallenges.some(function (c) { return c.type === 'sequence' && c.expected.state === null; })) {
        list.appendChild(angleGuide());
      }
      list.appendChild(gateGlossary(lv));
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
