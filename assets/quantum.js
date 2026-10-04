/* ============================================================
   Quantenstation · 60 Jahre JKU
   Gemeinsame Helfer für alle Stationen.
   Reines Progressive Enhancement: fällt JS aus, bleiben alle
   Inhalte und alle Links weiterhin nutzbar.
   ============================================================ */
(function (global) {
  'use strict';

  var STORE_KEY = 'jku60-quanten-fortschritt';

  /* Sprache der Seite — die englischen Seiten unter en/ tragen
     <html lang="en">. Der Fortschritt gilt für beide Sprachen. */
  var LANG = /^en/i.test(document.documentElement.lang || '') ? 'en' : 'de';
  function t(de, en) { return LANG === 'en' ? en : de; }

  /* ---------- kleine Helfer ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ---------- Fortschritt (localStorage) ---------- */
  // Im Privatmodus mancher Browser wirft localStorage. Alles absichern,
  // damit ein Rätsel nie wegen der Speicherung kaputtgeht.
  function readStore() {
    try {
      var raw = global.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeStore(obj) {
    try {
      global.localStorage.setItem(STORE_KEY, JSON.stringify(obj));
    } catch (e) { /* egal — Fortschritt ist nur Komfort */ }
  }

  function markSolved(id, code) {
    if (!id) return;
    var s = readStore();
    s[id] = { solved: true, code: code || null, at: Date.now() };
    writeStore(s);
  }

  function isSolved(id) {
    var s = readStore();
    return !!(s[id] && s[id].solved);
  }

  function solvedCode(id) {
    var s = readStore();
    return (s[id] && s[id].code) || null;
  }

  function resetProgress() {
    try { global.localStorage.removeItem(STORE_KEY); } catch (e) {}
  }

  /* ---------- Kacheln als „gelöst“ markieren ----------
     <a class="q-tile" data-q-id="schroedinger-1"> … </a>
     bekommt automatisch einen Haken, sobald das Rätsel gelöst ist. */
  function decorateTiles(root) {
    $$('[data-q-id]', root).forEach(function (tile) {
      if (!isSolved(tile.getAttribute('data-q-id'))) return;
      tile.classList.add('is-done');
      var num = $('.q-tile-num', tile);
      if (num && num.getAttribute('data-q-keep') === null) num.textContent = '✓';
      var sub = $('.q-tile-sub', tile);
      var code = solvedCode(tile.getAttribute('data-q-id'));
      if (sub && code) {
        // Nur als Text einsetzen: localStorage teilen sich alle Seiten unter
        // quick-jku.github.io, der Wert ist also nicht vertrauenswürdig.
        sub.textContent = t('Gelöst', 'Solved') + ' · Code ';
        var strong = document.createElement('strong');
        strong.className = 'q-mono';
        strong.textContent = String(code).replace(/\D/g, '').slice(0, 4);
        sub.appendChild(strong);
      } else if (sub) {
        sub.textContent = t('Gelöst ✓', 'Solved ✓');
      }
    });
  }

  /* ---------- Fortschrittszähler ----------
     <span data-q-count="schroedinger-1,schroedinger-2,…"></span> */
  function renderCounts(root) {
    $$('[data-q-count]', root).forEach(function (node) {
      var ids = node.getAttribute('data-q-count').split(',')
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
      var done = ids.filter(isSolved).length;
      node.textContent = done + '/' + ids.length;
      if (done === ids.length && ids.length) node.classList.add('t-green');
    });
  }

  /* ---------- Erfolg anzeigen ---------- */
  // Baut die grünen Code-Ziffern in einen Container.
  function showCode(container, code) {
    if (!container) return;
    container.innerHTML = '';
    String(code).split('').forEach(function (ch) {
      var d = document.createElement('div');
      d.className = 'q-code-digit';
      d.textContent = ch;
      container.appendChild(d);
    });
  }

  /* ---------- Rätsel abschließen ----------
     Zeigt den Erfolgsblock, speichert den Fortschritt und
     scrollt sanft zum Ergebnis. */
  function solve(opts) {
    var id    = opts.id;
    var code  = opts.code;
    var block = typeof opts.block === 'string' ? $(opts.block) : opts.block;
    if (!block || block.dataset.qShown === '1') return;

    block.dataset.qShown = '1';
    showCode($('[data-q-code]', block), code);
    block.hidden = false;
    markSolved(id, code);

    if (!opts.noScroll) {
      setTimeout(function () {
        block.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
    }
  }

  /* ---------- Orientierung auf allen Inhaltsseiten ---------- */
  function wireNavigation() {
    var main = $('.q-main');
    var bar = $('.q-bottombar');
    if (!main || !bar) return;
    var links = $$('.q-navitem', bar);
    if (!links.length) return;
    var home = links[0];
    var path = global.location.pathname.replace(/\/index\.html$/, '/');
    var section = null, next = null;

    links.forEach(function (a, i) {
      var target = a.pathname.replace(/\/index\.html$/, '/');
      if (target === path) {
        a.setAttribute('aria-current', 'page');
        if (i) section = a;
      }
      else if (i && (path.indexOf(target) === 0 ||
                     (/\/5-ama\/fragen\.html$/.test(target) &&
                      path.indexOf(target.replace(/fragen\.html$/, '')) === 0))) {
        section = a;
        a.setAttribute('aria-current', 'location');
      }
    });
    if (!section && path !== home.pathname.replace(/\/index\.html$/, '/')) {
      // Der Quiz-Pool liegt außerhalb der Stationsordner.
      section = $('.q-topbar-title');
    }
    if (!section && path === home.pathname.replace(/\/index\.html$/, '/')) return;

    var nav = document.createElement('nav');
    nav.className = 'q-context q-wrap';
    nav.setAttribute('aria-label', t('Seitenpfad und nächste Station', 'Page path and next station'));
    var trail = document.createElement('div');
    trail.className = 'q-context-trail';
    function link(href, label) {
      var a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      return a;
    }
    function sep() {
      var s = document.createElement('span');
      s.className = 'q-context-sep';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = '›';
      trail.appendChild(s);
    }
    function label(a) {
      var icon = $('.ico', a);
      return a.textContent.replace(icon ? icon.textContent : '', '').trim();
    }
    trail.appendChild(link(home.href, label(home)));
    if (section && section.href && section.pathname !== path) {
      sep();
      trail.appendChild(link(section.href, label(section)));
    }
    if (section && section.href && /1-schroedinger/.test(section.pathname)) {
      var branch = /\/katze-2\//.test(path) ? 'katze-2/'
                 : /\/raetsel\//.test(path) ? 'raetsel/' : null;
      if (branch) {
        var branchUrl = new URL(branch === 'raetsel/' ? '#box-1-overview' : '#box-2-overview', section.href);
        if (path !== section.pathname) {
          sep();
          trail.appendChild(link(branchUrl.href, branch === 'raetsel/' ? 'Box 1' : 'Box 2'));
        }
      }
    } else if (!section.href && /\/quiz\/quiz\.html$/.test(path)) {
      sep();
      trail.appendChild(link(new URL('index.html', global.location.href).href,
        t('Quiz-Pool', 'Quiz pool')));
    }
    var current = $('.q-main h1');
    if (current) {
      sep();
      var here = document.createElement('span');
      here.setAttribute('aria-current', 'page');
      here.textContent = current.textContent.trim();
      trail.appendChild(here);
    }
    nav.appendChild(trail);

    if (section && section.href) {
      var index = links.indexOf(section);
      next = links[index + 1];
    }
    if (next) {
      var onward = link(next.href, t('Nächste Station: ', 'Next station: ') + label(next) + ' →');
      onward.className = 'q-context-next';
      nav.appendChild(onward);
    }
    main.insertBefore(nav, main.firstChild);
  }

  /* ---------- Zahlenschloss ----------
     Prüft eine eingegebene Ziffernfolge gegen den Sollwert. */
  function wireLocks() {
    $$('[data-q-lock]').forEach(function (form) {
      var want   = form.getAttribute('data-q-lock');
      var id     = form.getAttribute('data-q-id');
      var input  = $('input', form);
      var status = $('[data-q-lock-status]', form);
      var ok     = $('[data-q-lock-ok]', form);

      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var val = (input.value || '').replace(/\D/g, '');
        if (val === want) {
          if (status) { status.textContent = t('🔓 Richtig!', '🔓 Correct!'); status.className = 'q-status is-good'; }
          if (ok) ok.hidden = false;
          if (id) markSolved(id, want);
          form.classList.remove('q-shake');
        } else {
          if (status) { status.textContent = t('✗ Noch nicht richtig', '✗ Not right yet'); status.className = 'q-status is-bad'; }
          form.classList.remove('q-shake');
          void form.offsetWidth; // Reflow erzwingen, damit die Animation neu startet
          form.classList.add('q-shake');
        }
      });
    });
  }

  /* ---------- Start ---------- */
  function wireSpoilerKeyboard() {
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var summary = event.target.closest('summary');
      if (!summary || !summary.parentElement.matches('details.q-spoiler')) return;
      event.preventDefault();
      summary.click();
    });
  }

  function init() {
    decorateTiles(document);
    renderCounts(document);
    wireNavigation();
    wireLocks();
    wireSpoilerKeyboard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- öffentliche API ---------- */
  global.Q = {
    $: $, $$: $$,
    lang: LANG,
    t: t,
    isSolved: isSolved,
    markSolved: markSolved,
    solvedCode: solvedCode,
    resetProgress: resetProgress,
    showCode: showCode,
    solve: solve,
    decorateTiles: decorateTiles,
    renderCounts: renderCounts
  };
})(window);
