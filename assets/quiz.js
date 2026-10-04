/* ============================================================
   Quantenstation · 60 Jahre JKU
   Quiz-Motor für den Fragenpool.

   Zwei Aufgaben:
     Quiz.renderIndex(el)  — Übersicht aller Quizze, nach Level
     Quiz.run(el)          — ein einzelnes Quiz durchspielen

   Die Fragen selbst stehen in quiz/pool.js. Wird dort ein Quiz
   ergänzt, taucht es hier automatisch auf — nichts nachzutragen.
   Fällt JavaScript aus, bleibt die <noscript>-Notiz stehen.

   Welches Quiz läuft, sagt entweder die Adresse (quiz.html?id=…)
   oder das Attribut data-quiz-id am Container — Letzteres für
   feste Seiten wie die Rätsel der zweiten Katze.

   Zwei Erweiterungen, die dort gebraucht werden:
     · Fragen können auf den Pool verweisen statt ihn zu kopieren
       ({ from: 'studium-1', n: 4 })
     · quiz.strict = true schaltet Tipps und Lösungsanzeige ab —
       bei einem Fehlversuch gibt es dann nur „noch nicht“
   ============================================================ */
(function (global) {
  'use strict';

  var POOL = global.QUIZPOOL || { levels: [], quizzes: [] };

  /* Sprache der Seite (<html lang>): Die Fragen selbst kommen aus dem
     jeweiligen pool.js, hier stehen nur die Texte des Motors. */
  var EN = /^en/i.test(document.documentElement.lang || '');
  function t(de, en) { return EN ? en : de; }
  function fmt(x) { return EN ? String(x) : String(x).replace('.', ','); }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  /* Fortschritts-Schlüssel — passt zum Rest der Seite (quantum.js). */
  function storeId(quiz) { return 'quiz-' + quiz.id; }

  function levelById(id) {
    for (var i = 0; i < POOL.levels.length; i++) {
      if (POOL.levels[i].id === id) return POOL.levels[i];
    }
    return null;
  }

  function quizById(id) {
    for (var i = 0; i < POOL.quizzes.length; i++) {
      if (POOL.quizzes[i].id === id) return POOL.quizzes[i];
    }
    return null;
  }

  function quizzesOfLevel(id) {
    return POOL.quizzes.filter(function (q) { return q.level === id; });
  }

  /* ---------- Fragen aus dem Pool holen ----------
     Statt eine Frage abzuschreiben, verweist man auf sie:
       { from: 'studium-1', n: 4 }   → 4. Frage aus Quiz studium-1
     Zusätzliche Schlüssel im Verweis überschreiben das Original,
     etwa ein eigener given-Block. So bleibt pool.js die einzige
     Quelle — eine Korrektur dort wirkt überall. */
  function resolveQuestion(ref) {
    if (!ref || !ref.from) return ref;

    var src = quizById(ref.from);
    var orig = src && src.questions[(ref.n || 1) - 1];
    if (!orig) {
      return {
        q: t('Frage nicht gefunden: ', 'Question not found: ') + ref.from + t(' Nr. ', ' no. ') + ref.n,
        a: ['—'], why: ''
      };
    }

    var out = {}, k;
    for (k in orig) if (orig.hasOwnProperty(k)) out[k] = orig[k];
    for (k in ref) {
      if (ref.hasOwnProperty(k) && k !== 'from' && k !== 'n') out[k] = ref[k];
    }
    return out;
  }

  function questionsOf(quiz) {
    return quiz.questions.map(resolveQuestion);
  }

  /* Fisher-Yates — mischt die Antwortreihenfolge, damit nicht die
     Position, sondern der Inhalt entscheidet. */
  function shuffled(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- Übersichtsseite ---------- */

  function renderIndex(root) {
    root = root || $('[data-quiz-index]');
    if (!root) return;
    root.innerHTML = '';

    POOL.levels.forEach(function (lvl) {
      if (lvl.hidden) return;          // eigene Übersicht, z. B. die zweite Katze
      var list = quizzesOfLevel(lvl.id);
      if (!list.length) return;

      var sec = el('section', 'q-wrap q-mt');

      var head = el('div', 'quiz-lvl-head');
      head.appendChild(el('span', 'quiz-lvl-icon', lvl.icon || '●'));
      var ht = el('span', 'quiz-lvl-txt');
      var h2 = el('h2', 'q-h2', lvl.title);
      h2.style.marginTop = '0';
      ht.appendChild(h2);
      ht.appendChild(el('span', 'q-fine', lvl.sub || ''));
      head.appendChild(ht);
      sec.appendChild(head);

      if (lvl.note) {
        var note = el('div', 'q-fine q-mt-sm');
        note.textContent = lvl.note;
        sec.appendChild(note);
      }

      var ids = list.map(storeId);
      var counter = el('div', 'q-fine q-mt-sm');
      var cnt = el('span');
      cnt.setAttribute('data-q-count', ids.join(','));
      cnt.textContent = '0/' + ids.length;
      counter.appendChild(cnt);
      counter.appendChild(document.createTextNode(t(' Quizze gelöst', ' quizzes solved')));
      sec.appendChild(counter);

      var ul = el('div', 'q-list q-mt-sm');
      list.forEach(function (quiz, i) {
        var task = el('div', 'q-task');
        task.id = 'quiz-' + quiz.id;
        var a = el('button', 'q-task-trigger');
        a.type = 'button';
        a.setAttribute('data-q-panel', '');
        a.setAttribute('aria-expanded', 'false');
        a.setAttribute('aria-controls', task.id + '-body');
        a.setAttribute('data-q-id', storeId(quiz));

        var num = el('span', 'q-tile-num ' + (lvl.color || ''), String(i + 1));
        a.appendChild(num);

        var txt = el('span', 'q-tile-txt');
        txt.appendChild(el('span', 'q-tile-title', quiz.title));
        txt.appendChild(el('span', 'q-tile-sub',
          quiz.sub + ' · ' + quiz.questions.length + t(' Fragen', ' questions')));
        a.appendChild(txt);

        var panel = el('div', 'q-task-panel');
        panel.id = task.id + '-body';
        panel.hidden = true;
        var frame = el('iframe');
        frame.setAttribute('data-q-embed', '');
        frame.setAttribute('data-src', 'quiz.html?id=' + encodeURIComponent(quiz.id));
        frame.setAttribute('loading', 'lazy');
        frame.title = quiz.title;
        panel.appendChild(frame);
        task.appendChild(a);
        task.appendChild(panel);
        ul.appendChild(task);
      });
      sec.appendChild(ul);

      root.appendChild(sec);
    });

    /* Häkchen und Zähler nachziehen — quantum.js lief schon vorher. */
    if (global.Q) { global.Q.decorateTiles(root); global.Q.renderCounts(root); }
  }

  /* ---------- Ein Quiz spielen ---------- */

  /* Nimmt 0,25 · 0.25 · 1/4 · 2.5e-3 — alles, was jemand ernsthaft
     eintippen würde. Alles andere gilt als „keine Zahl“. */
  var NUM = '[-+]?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?';

  function parseNumber(raw) {
    var s = String(raw).trim().replace(/\s/g, '').replace(/,/g, '.');
    if (!s) return null;

    var frac = s.match(new RegExp('^(' + NUM + ')\\/(' + NUM + ')$'));
    if (frac) {
      var den = parseFloat(frac[2]);
      return den === 0 ? null : parseFloat(frac[1]) / den;
    }

    if (!new RegExp('^' + NUM + '$').test(s)) return null;
    return parseFloat(s);
  }

  function run(root) {
    root = root || $('[data-quiz-run]');
    if (!root) return;

    /* Feste Seite (data-quiz-id) hat Vorrang, sonst kommt die
       Kennung aus der Adresse — quiz.html?id=… */
    var params = new URLSearchParams(global.location.search);
    var wanted = root.getAttribute('data-quiz-id') || params.get('id') || '';
    var quiz = quizById(wanted);

    if (!quiz) {
      root.innerHTML = '';
      var miss = el('div', 'q-card q-center');
      miss.appendChild(el('div', 'q-note-title', t('Quiz nicht gefunden', 'Quiz not found')));
      miss.appendChild(el('p', 'q-body',
        t('Dieser Link zeigt auf kein Quiz. Wähl eines aus der Übersicht.',
          'This link does not point to a quiz. Pick one from the overview.')));
      var back = el('a', 'q-btn q-btn-primary q-mt-sm', t('Zur Übersicht →', 'To the overview →'));
      back.href = 'index.html';
      miss.appendChild(back);
      root.appendChild(miss);
      return;
    }

    var lvl = levelById(quiz.level) || {};
    var questions = questionsOf(quiz);

    /* Rätselmodus: keine Tipps, keine Lösung — nur richtig oder nicht. */
    var strict = !!quiz.strict;

    /* Kopfzeilen der Seite füllen — nur, wo die Seite es zulässt */
    document.title = quiz.title + ' · ' + (lvl.short || 'Quiz') + t(' · Quantenstation JKU', ' · Quantum Station JKU');
    var t1 = $('[data-quiz-title]'); if (t1) t1.textContent = quiz.title;
    var t2 = $('[data-quiz-sub]');   if (t2) t2.textContent = quiz.sub;
    var t3 = $('[data-quiz-eyebrow]');
    if (t3) t3.textContent = (lvl.title || '') + ' · ' + questions.length + t(' Fragen', ' questions');
    var t4 = $('[data-quiz-bar-title]');
    if (t4) t4.textContent = lvl.short || 'Quiz';

    var state = {
      idx: 0,                 // aktuelle Frage
      firstTry: 0,            // auf Anhieb richtig
      answered: false,        // aktuelle Frage schon beantwortet?
      missedHere: false       // in dieser Frage schon danebengelegen?
    };

    var stage   = $('[data-quiz-stage]', root);
    var meter   = $('[data-quiz-meter]', root);
    var step    = $('[data-quiz-step]', root);
    var success = $('[data-quiz-success]');

    function setMeter() {
      var pct = Math.round(state.idx / questions.length * 100);
      if (meter) meter.style.width = pct + '%';
      if (step) {
        step.textContent = t('Frage ', 'Question ') + Math.min(state.idx + 1, questions.length) +
          t(' von ', ' of ') + questions.length;
      }
    }

    function feedbackBox(good, text) {
      var box = el('div', 'quiz-fb ' + (good ? 'is-good' : 'is-bad'));
      box.appendChild(el('div', 'quiz-fb-head', good ? t('✓ Richtig', '✓ Correct') : t('✗ Noch nicht', '✗ Not yet')));
      if (text) box.appendChild(el('div', 'quiz-fb-body', text));
      return box;
    }

    function nextButton(label) {
      var b = el('button', 'q-btn q-btn-primary q-btn-block q-mt-sm', label);
      b.type = 'button';
      b.addEventListener('click', function () {
        state.idx++;
        renderQuestion();
      });
      return b;
    }

    /* --- Auswahlfrage --- */
    function renderChoice(q, card) {
      var options = q.a.map(function (text, i) {
        return { text: text, ok: i === 0 };
      });
      if (!q.keep) options = shuffled(options);

      var wrap = el('div', 'quiz-opts');
      var done = false;

      options.forEach(function (opt) {
        var b = el('button', 'quiz-opt', opt.text);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (done) return;
          var old = $('.quiz-fb', card);
          if (old) old.remove();

          if (opt.ok) {
            done = true;
            b.classList.add('is-right');
            Array.prototype.forEach.call(wrap.children, function (o) { o.disabled = true; });
            if (!state.missedHere) state.firstTry++;
            card.appendChild(feedbackBox(true, q.why));
            card.appendChild(nextButton(
              state.idx + 1 < questions.length ? t('Nächste Frage →', 'Next question →') : t('Auswertung →', 'Results →')));
          } else {
            state.missedHere = true;
            b.classList.add('is-wrong');
            b.disabled = true;
            card.appendChild(feedbackBox(false, strict
              ? t('Wähl eine andere Antwort.', 'Pick another answer.')
              : t('Probier eine andere Antwort.', 'Try another answer.')));
          }
        });
        wrap.appendChild(b);
      });

      card.appendChild(wrap);
    }

    /* --- Zahlenfrage --- */
    function renderNumber(q, card) {
      var form = el('form', 'quiz-numform');
      form.setAttribute('novalidate', '');

      var row = el('div', 'quiz-numrow');
      var input = el('input');
      input.type = 'text';
      input.className = 'q-input';
      input.inputMode = 'decimal';
      input.autocomplete = 'off';
      input.placeholder = q.placeholder || t('Zahl eingeben', 'Enter a number');
      input.setAttribute('aria-label', t('Antwort als Zahl', 'Answer as a number'));
      row.appendChild(input);
      if (q.unit) row.appendChild(el('span', 'quiz-unit', q.unit));
      form.appendChild(row);

      var check = el('button', 'q-btn q-btn-primary q-btn-block q-mt-sm', t('Prüfen', 'Check'));
      check.type = 'submit';
      form.appendChild(check);

      card.appendChild(form);

      /* Ausweg fürs Steckenbleiben — taucht erst nach dem zweiten
         Fehlversuch auf, damit niemand vorher hineinspickt. */
      var misses = 0;
      function offerSolution() {
        if ($('.quiz-give', card)) return;
        var give = el('details', 'q-acc q-mt-sm quiz-give');
        give.appendChild(el('summary', null, t('Lösung anzeigen', 'Show solution')));
        var gb = el('div', 'q-acc-body');
        gb.innerHTML = t('Der gesuchte Wert ist <strong>', 'The value you are looking for is <strong>') +
          fmt(q.num) + (q.unit ? ' ' + q.unit : '') + '</strong>.';
        give.appendChild(gb);
        card.appendChild(give);
      }

      var done = false;
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (done) return;
        var val = parseNumber(input.value);
        var tol = q.tol != null ? q.tol : 0.001;
        var old = $('.quiz-fb', card);
        if (old) old.remove();

        if (val != null && Math.abs(val - q.num) <= tol) {
          done = true;
          input.disabled = true;
          check.disabled = true;
          input.classList.add('is-right');
          var give = $('.quiz-give', card);
          if (give) give.remove();
          if (!state.missedHere) state.firstTry++;
          card.appendChild(feedbackBox(true, q.why));
          card.appendChild(nextButton(
            state.idx + 1 < questions.length ? t('Nächste Frage →', 'Next question →') : t('Auswertung →', 'Results →')));
        } else {
          state.missedHere = true;
          misses++;
          card.appendChild(feedbackBox(false, val == null
            ? t('Bitte eine Zahl eingeben — Komma oder Punkt, beides geht.',
                'Please enter a number — comma or point, both work.')
            : (strict ? t('Das ist nicht der gesuchte Wert.', 'That is not the value we are looking for.')
                      : t('Rechne noch einmal nach.', 'Check your calculation again.'))));
          if (misses >= 2 && !strict) offerSolution();
          form.classList.remove('q-shake');
          void form.offsetWidth;
          form.classList.add('q-shake');
        }
      });
    }

    /* --- eine Frage aufbauen --- */
    function renderQuestion() {
      if (state.idx >= questions.length) return finish();

      state.missedHere = false;
      setMeter();

      var q = questions[state.idx];
      stage.innerHTML = '';

      var card = el('div', 'q-card');
      var num = el('div', 'quiz-qnum', t('Frage ', 'Question ') + (state.idx + 1));
      card.appendChild(num);

      var qt = el('p', 'quiz-q');
      qt.innerHTML = q.q;          // erlaubt <sub>, <em> und &nbsp; in Formeln
      card.appendChild(qt);

      if (q.given) {
        var g = el('div', 'quiz-given');
        g.innerHTML = q.given;
        card.appendChild(g);
      }

      if (q.num != null) renderNumber(q, card);
      else renderChoice(q, card);

      if (!strict && q.hint) {
        var hint = el('details', 'q-acc q-spoiler q-mt-sm');
        hint.appendChild(el('summary', null, t('Spoiler: Tipp anzeigen', 'Spoiler: Show hint')));
        var hintBody = el('div', 'q-acc-body');
        hintBody.innerHTML = q.hint;
        hint.appendChild(hintBody);
        card.appendChild(hint);
      }

      stage.appendChild(card);
      stage.focus({ preventScroll: true });
    }

    /* --- Auswertung + Code --- */
    function finish() {
      if (meter) meter.style.width = '100%';
      if (step) step.textContent = t('Fertig', 'Done');
      stage.innerHTML = '';

      var total = questions.length;
      var stars = state.firstTry === total ? '★★★'
                : state.firstTry >= Math.ceil(total * 0.6) ? '★★☆'
                : '★☆☆';

      var card = el('div', 'q-card q-center');
      card.appendChild(el('div', 'quiz-stars', stars));
      card.appendChild(el('p', 'q-body',
        t('Auf Anhieb richtig: ', 'Right first time: ') + state.firstTry + t(' von ', ' of ') + total + '.'));
      card.appendChild(el('p', 'q-fine',
        state.firstTry === total
          ? t('Perfekt — keine einzige Fehlmessung.', 'Perfect — not a single faulty measurement.')
          : t('Alles gelöst. Der Code gilt trotzdem.', 'All solved. The code counts all the same.')));
      stage.appendChild(card);

      var lbl = $('[data-quiz-success-label]');
      if (lbl) lbl.textContent = quiz.title.toUpperCase() + ' ✓';

      if (global.Q) {
        global.Q.solve({ id: storeId(quiz), code: quiz.code, block: success });
      } else if (success) {
        success.hidden = false;
      }
    }

    /* Neustart-Knopf */
    var again = $('[data-quiz-again]');
    if (again) {
      again.addEventListener('click', function () {
        state.idx = 0; state.firstTry = 0;
        if (success) { success.hidden = true; delete success.dataset.qShown; }
        renderQuestion();
        stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    renderQuestion();
  }

  /* ---------- Start ---------- */
  function init() {
    if ($('[data-quiz-index]')) renderIndex();
    if ($('[data-quiz-run]')) run();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.Quiz = { renderIndex: renderIndex, run: run, pool: POOL };
})(window);
