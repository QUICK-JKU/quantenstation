/* ============================================================
   Quantenstation · 60 Jahre JKU
   Die zweite Katze — vier Rätsel zu je vier Fragen.

   Keine der Fragen steht hier: Jede verweist mit { from, n } in
   den Fragenpool (quiz/pool.js). Wird dort eine Frage korrigiert,
   ändert sie sich hier automatisch mit. pool.js muss deshalb
   VOR dieser Datei geladen werden.

   strict: true schaltet Tipps und Lösungsanzeige ab — bei einem
   Fehlversuch heißt es nur „noch nicht“, ohne Hinweis auf die
   richtige Antwort. So bleibt es ein Rätsel und wird nicht zur
   Lernkarte.
   ============================================================ */
(function (P) {
  'use strict';
  if (!P || !P.levels || !P.quizzes) return;   // ohne pool.js kein Rätsel

  /* Eigene Stufe — hidden, damit sie nicht im Quiz-Pool auftaucht.
     Die zweite Katze hat ihre eigene Übersicht. */
  P.levels.push({
    id: 'katze2',
    title: 'Box 2 · Die zweite Katze',
    short: 'Box 2',
    sub: 'vier Schlösser, gemischtes Niveau',
    icon: '🐈‍⬛',
    color: 'c-ink',
    hidden: true
  });

  P.quizzes.push(

    {
      id: 'katze2-1',
      level: 'katze2',
      title: 'Zustand & Rechenkraft',
      sub: 'Was in einem Qubit steckt — und was daraus folgt',
      code: '2841',
      strict: true,
      questions: [
        { from: 'studium-1', n: 1 },   // b aus 0,6·|0⟩ + b·|1⟩
        { from: 'studium-1', n: 4 },   // 2¹⁰ Amplituden
        { from: 'schule-6',  n: 6 },   // „probiert alles gleichzeitig durch“
        { from: 'schule-5',  n: 2 }    // Hadamard auf |0⟩
      ]
    },

    {
      id: 'katze2-2',
      level: 'katze2',
      title: 'Messung & Kollaps',
      sub: 'Warum Nachschauen die Sache verändert',
      code: '5073',
      strict: true,
      questions: [
        { from: 'schule-1', n: 2 },    // Superposition ist kein Unwissen
        { from: 'schule-1', n: 3 },    // zweite Messung nach dem Kollaps
        { from: 'schule-1', n: 5 },    // P(1) aus 0,6|0⟩ + 0,8|1⟩
        { from: 'schule-1', n: 6 }     // Kollaps ohne Bewusstsein
      ]
    },

    {
      id: 'katze2-3',
      level: 'katze2',
      title: 'Drehungen & Paare',
      sub: 'Rechnen mit Photonen, Winkeln und Bell-Zuständen',
      code: '9316',
      strict: true,
      questions: [
        { from: 'studium-3', n: 3 },   // Photon bei 620 nm
        { from: 'studium-5', n: 3 },   // R_y(120°) auf |0⟩
        { from: 'studium-5', n: 4 },   // Z auf |+⟩
        { from: 'studium-6', n: 1 }    // P(01) im Bell-Zustand
      ]
    },

    {
      id: 'katze2-4',
      level: 'katze2',
      title: 'Verschränkung im Alltag',
      sub: 'Was daraus wirklich folgt — und was nicht',
      code: '6482',
      strict: true,
      questions: [
        { from: 'schule-6', n: 5 },    // gilt nur für das Allerkleinste?
        { from: 'schule-6', n: 2 },    // schneller als Licht?
        { from: 'schule-6', n: 4 },    // Nutzen heute
        { from: 'kinder-5', n: 3 }     // ersetzt es dein Handy?
      ]
    }

  );
})(window.QUIZPOOL);
