/* ============================================================
   Quantenstation · 60 Jahre JKU
   Sprachumschalter Deutsch / Englisch.

   Jede Seite nennt im <head> ihre beiden Fassungen:
     <link rel="alternate" hreflang="de" href="…">
     <link rel="alternate" hreflang="en" href="…">
   Tippt man in der Kopfleiste auf DE oder EN, wird die Wahl gemerkt.
   Öffnet man danach eine Seite in der anderen Sprache — etwa über
   einen gedruckten QR-Code, der immer auf Deutsch zeigt —, geht es
   sofort zur gewählten Fassung weiter. Ohne gemerkte Wahl bleibt
   jede Seite, wie sie ist.

   Dieses Skript steht im <head>, damit die Weiterleitung passiert,
   bevor die falsche Sprache sichtbar wird. Die Speicherung erfolgt
   nur lokal im Browser (localStorage).
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'jku60-sprache';
  var here = /^en/i.test(document.documentElement.lang || '') ? 'en' : 'de';

  function wanted() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function remember(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* nur Komfort */ }
  }

  function goTo(lang) {
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + lang + '"]');
    if (!alt) return false;
    location.replace(alt.href + location.search + location.hash);
    return true;
  }

  function check() {
    var pref = wanted();
    if (pref && pref !== here) goTo(pref);
  }

  check();

  // Zurück-Taste: Seiten aus dem Zwischenspeicher laufen nicht neu an.
  window.addEventListener('pageshow', function (ev) {
    if (ev.persisted) check();
  });

  // Klick auf den Umschalter: Wahl merken, Abfrage und Anker mitnehmen
  // (z. B. quiz.html?id=schule-1).
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest && ev.target.closest('[data-q-lang]');
    if (!a) return;
    var lang = a.getAttribute('data-q-lang');
    remember(lang);
    if (location.search || location.hash) {
      ev.preventDefault();
      location.href = a.href + location.search + location.hash;
    }
  });
})();
