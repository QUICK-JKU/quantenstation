/* Aufgaben bleiben auf ihren bisherigen URLs erreichbar und lassen sich
   zugleich ohne Seitenwechsel auf den Stationsseiten benutzen. */
(function () {
  'use strict';

  function init() {

  // Details/Summary und Buttons bleiben nativ bedienbar. Das explizite
  // Tastaturverhalten hilft auch Browsern, die Summary nicht aktivieren.
  document.querySelectorAll('.q-box > summary, [data-q-panel]').forEach(function (control) {
    control.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      control.click();
    });
  });

  function openPanel(button, open) {
    var panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) {
      var frame = panel.querySelector('iframe[data-q-embed]');
      if (frame && !frame.hasAttribute('src')) {
        frame.loading = 'eager';
        frame.src = frame.dataset.src;
      }
    }
  }

  function openTarget(id, scroll) {
    var target = document.getElementById(id);
    if (!target) return false;
    var box = target.closest('details.q-box');
    if (box) box.open = true;
    if (target.matches('details.q-box')) target.open = true;
    var button = target.querySelector(':scope > [data-q-panel]');
    if (button) openPanel(button, true);
    if (scroll) requestAnimationFrame(function () {
      target.scrollIntoView({ block: 'start' });
    });
    return true;
  }

  document.querySelectorAll('[data-q-panel]').forEach(function (button) {
    button.addEventListener('click', function () {
      var opening = button.getAttribute('aria-expanded') !== 'true';
      openPanel(button, opening);
      var id = button.parentElement.id;
      if (opening && id) history.replaceState(null, '', '#' + id);
      else if (location.hash === '#' + id) history.replaceState(null, '', location.pathname + location.search);
    });
  });

  // Am Ende jedes aufgeklappten Bereichs: ein Pfeil, der ihn wieder schließt
  // und zurück zu seiner Überschrift springt.
  var english = /^en/i.test(document.documentElement.lang || '');
  document.querySelectorAll('[data-q-panel]').forEach(function (button) {
    var panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'q-task-close';
    close.textContent = english ? 'Close' : 'Schließen';
    close.addEventListener('click', function () {
      if (button.getAttribute('aria-expanded') === 'true') button.click();
      button.parentElement.scrollIntoView({ block: 'start' });
      button.focus({ preventScroll: true });
    });
    panel.appendChild(close);
  });

  document.addEventListener('click', function (event) {
    var lang = event.target.closest('[data-q-lang]');
    if (!lang || location.hash) return;
    var active = document.querySelector('[data-q-panel][aria-expanded="true"]');
    var box = document.querySelector('details.q-box[open]');
    var id = active ? active.parentElement.id : box && box.id;
    if (id) lang.href = lang.href.split('#')[0] + '#' + id;
  }, true);

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var id = decodeURIComponent(link.hash.slice(1));
      if (id) openTarget(id, false);
    });
  });

  function followHash() {
    if (location.hash) openTarget(decodeURIComponent(location.hash.slice(1)), true);
  }
  window.addEventListener('hashchange', followHash);
  followHash();

  document.querySelectorAll('iframe[data-q-embed]').forEach(function (frame) {
    frame.addEventListener('load', function () {
      if (!frame.hasAttribute('src')) return;
      var doc;
      try { doc = frame.contentDocument; } catch (e) { return; }
      if (!doc) return;
      var chrome = doc.querySelectorAll('.q-topbar, .q-bottombar, .q-glow');
      chrome.forEach(function (node) { node.style.display = 'none'; });
      doc.documentElement.classList.add('q-embedded');
      var main = doc.querySelector('main');
      if (!main) return;
      main.style.paddingBottom = '12px';
      var resize = function () {
        frame.style.height = Math.ceil(main.getBoundingClientRect().height + 4) + 'px';
      };
      resize();
      if (frame._qResize) frame._qResize.disconnect();
      if (window.ResizeObserver) {
        frame._qResize = new ResizeObserver(resize);
        frame._qResize.observe(main);
      }
      window.addEventListener('resize', resize);

      doc.addEventListener('click', function (event) {
        var link = event.target.closest('a[href]');
        if (!link || link.hash && link.pathname === doc.location.pathname) return;
        var url = new URL(link.href, doc.location.href);
        if (url.origin !== location.origin) return;
        var match = Array.prototype.find.call(document.querySelectorAll('iframe[data-q-embed]'),
          function (item) {
            var target = new URL(item.dataset.src, location.href);
            return target.pathname === url.pathname && target.search === url.search;
          });
        event.preventDefault();
        var samePage = url.pathname.replace(/\/index\.html$/, '/') ===
                       location.pathname.replace(/\/index\.html$/, '/');
        if (match) {
          location.hash = match.closest('[id]').id;
          openTarget(match.closest('[id]').id, true);
        } else if (samePage && url.hash) {
          // Ziel liegt auf dieser Seite: aufklappen statt neu laden.
          location.hash = url.hash;
          openTarget(decodeURIComponent(url.hash.slice(1)), true);
        } else {
          location.href = url.href;
        }
      });
    });
  });

  window.addEventListener('storage', function (event) {
    if (event.key === 'jku60-quanten-fortschritt' && window.Q) {
      Q.decorateTiles(document);
      Q.renderCounts(document);
    }
  });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
