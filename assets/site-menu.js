/* Seitenbaum der bestehenden Hauptseiten, Bereiche und Aufgaben.
   Ziele auf Onepagern verwenden deren Anker; onepager.js öffnet sie. */
(function () {
  'use strict';

  var en = /^en/i.test(document.documentElement.lang || '');
  function label(de, english) { return en ? english : de; }
  function link(de, english, href) { return { label: label(de, english), href: href }; }
  function group(de, english, children) { return { label: label(de, english), children: children }; }

  var cat = 'stations/1-schroedinger/';
  var sphere = 'stations/2-bloch-sphere/';
  var table = 'stations/3-quantumtable/';
  var team = 'stations/4-meettheteam/';
  var faq = 'stations/5-ama/';

  var box1 = [
    link('Box 1 auf der Stationsseite', 'Box 1 on the station page', cat + 'index.html#box-1-overview'),
    link('Rätsel 1 · Superposition', 'Puzzle 1 · Superposition', cat + 'index.html#task-box1-1'),
    link('Rätsel 2 · Interferenz', 'Puzzle 2 · Interference', cat + 'index.html#task-box1-2'),
    link('Rätsel 3 · Wellen', 'Puzzle 3 · Waves', cat + 'index.html#task-box1-3'),
    link('Rätsel 4 · Logik', 'Puzzle 4 · Logic', cat + 'index.html#task-box1-4')
  ];
  var box2 = [
    link('Box 2 auf der Stationsseite', 'Box 2 on the station page', cat + 'index.html#box-2-overview'),
    link('Rechenregeln', 'Rules of calculation', cat + 'katze-2/theorie.html'),
    link('Rätsel 1 · Zustand', 'Puzzle 1 · State', cat + 'index.html#task-box2-1'),
    link('Rätsel 2 · Messung', 'Puzzle 2 · Measurement', cat + 'index.html#task-box2-2'),
    link('Rätsel 3 · Drehungen', 'Puzzle 3 · Rotations', cat + 'index.html#task-box2-3'),
    link('Rätsel 4 · Verschränkung', 'Puzzle 4 · Entanglement', cat + 'index.html#task-box2-4')
  ];

  var people = [
    ['Alexander Mandl', 'alexander-mandl'],
    ['Johannes Kofler', 'johannes-kofler'],
    ['Jadwiga Wilkens', 'jadwiga-wilkens'],
    ['Sebastian Egginger', 'sebastian-egginger'],
    ['Richard Kueng', 'richard-kueng'],
    ['Kristina Kirova', 'kristina-kirova'],
    ['Patrick Fath', 'patrick-fath'],
    ['Elena Giovannini', 'elena-giovannini'],
    ['Filipa Peres', 'filipa-peres'],
    ['Marwa Marso', 'marwa-marso'],
    ['Mario Ullrich', 'mario-ullrich'],
    ['Alexander Ploier', 'alexander-ploier'],
    ['Luna Lima Keller', 'luna-lima-keller'],
    ['Diego García Martín', 'diego-garcia-martin'],
    ['Nina Brandl', 'nina-brandl'],
    ['Tobias Pirkl', 'tobias-pirkl']
  ].map(function (person) {
    return link(person[0], person[0], team + 'personen/' + person[1] + '.html');
  });

  var quizNames = {
    kinder: [
      ['Die Katze im Karton', 'The cat in the box'],
      ['Licht macht Faxen', 'Light plays tricks'],
      ['Klitzeklein', 'Teeny-tiny'],
      ['Zufall und Würfel', 'Chance and dice'],
      ['Der Quantencomputer', 'The quantum computer'],
      ['Im Labor', 'In the lab']
    ],
    schule: [
      ['Superposition & Messung', 'Superposition & measurement'],
      ['Doppelspalt & Interferenz', 'Double slit & interference'],
      ['Photonen & Photoeffekt', 'Photons & the photoelectric effect'],
      ['Atome & Spektren', 'Atoms & spectra'],
      ['Qubits & Gatter', 'Qubits & gates'],
      ['Verschränkung & Mythen', 'Entanglement & myths']
    ],
    studium: [
      ['Zustände & Normierung', 'States & normalisation'],
      ['Born-Regel & Erwartungswerte', 'Born rule & expectation values'],
      ['Materiewellen & Unschärfe', 'Matter waves & uncertainty'],
      ['Atomphysik & Spektren', 'Atomic physics & spectra'],
      ['Bloch-Kugel & Gatter', 'Bloch sphere & gates'],
      ['Verschränkung, Bell & Algorithmen', 'Entanglement, Bell & algorithms']
    ]
  };
  function quizLevel(id, de, english) {
    return group(de, english, quizNames[id].map(function (name, i) {
      return link((i + 1) + ' · ' + name[0], (i + 1) + ' · ' + name[1],
        'quiz/index.html#quiz-' + id + '-' + (i + 1));
    }));
  }

  var tree = [
    group('Station 1 · Schrödinger-Box', 'Station 1 · Schrödinger Box', [
      link('Stationshauptseite', 'Station home page', cat),
      group('Superposition', 'Superposition', [
        link('Auf der Stationsseite', 'On the station page', cat + 'index.html#station1-superposition'),
        link('Erklärung · Superposition', 'Explanation · Superposition', cat + 'info.html')
      ]),
      group('Was steckt in den Kisten?', 'What is in the boxes?', [
        link('Auf der Stationsseite', 'On the station page', cat + 'index.html#station1-boxes-info'),
        link('Woher kommt die Katze?', 'Where does the cat come from?', cat + 'box.html')
      ]),
      group('Die zwei Boxen', 'The two boxes', [
        link('Boxen auf der Stationsseite', 'Boxes on the station page', cat + 'index.html#boxen'),
        group('Box 1 · einfach', 'Box 1 · easy', box1),
        group('Box 2 · schwer', 'Box 2 · hard', box2)
      ])
    ]),
    group('Station 2 · Bloch-Kugel', 'Station 2 · Bloch sphere', [
      link('Stationshauptseite', 'Station home page', sphere),
      link('Erklärung · Was ist ein Qubit?', 'Explanation · What is a qubit?', sphere + 'info.html'),
      link('Simulation der Bloch-Kugel', 'Bloch sphere simulation', sphere + 'index.html#bloch-simulation'),
      link('Teste selbst · 20 Challenges', 'Try it yourself · 20 challenges', sphere + 'index.html#bloch-challenges')
    ]),
    group('Station 3 · QuantumTable', 'Station 3 · QuantumTable', [
      link('Stationshauptseite', 'Station home page', table),
      link('Schaltkreis am Handy', 'Circuit on your phone', table + 'index.html#table-circuit'),
      link('Erklärung · Schaltkreise lesen', 'Explanation · Reading circuits', table + 'info.html'),
      link('Wer ist das SCCH?', 'Who is the SCCH?', table + 'scch.html')
    ]),
    group('Station 4 · Meet the Team', 'Station 4 · Meet the Team', [
      link('Stationshauptseite', 'Station home page', team),
      link('Quick Sloths', 'Quick Sloths', team + 'quick-sloths.html'),
      group('Unser Team', 'Our team', people),
      link('Studieren und forschen', 'Study and research', team + 'studieren.html')
    ]),
    group('FAQ', 'FAQ', [
      link('Alle Fragen', 'All questions', faq + 'fragen.html'),
      link('Quanten-Mythen', 'Quantum myths', faq + 'mythen.html')
    ]),
    group('Quiz-Pool', 'Quiz pool', [
      link('Quiz-Pool öffnen', 'Open quiz pool', 'quiz/'),
      quizLevel('kinder', 'Für Kinder', 'For children'),
      quizLevel('schule', 'Für Schüler:innen', 'For school students'),
      quizLevel('studium', 'Für Studierende', 'For university students')
    ])
  ];

  function render(item) {
    if (item.href) {
      var a = document.createElement('a');
      a.className = 'q-menu-link';
      a.href = item.href;
      a.textContent = item.label;
      return a;
    }
    var details = document.createElement('details');
    details.className = 'q-menu-group';
    var summary = document.createElement('summary');
    summary.textContent = item.label;
    summary.setAttribute('aria-expanded', 'false');
    details.appendChild(summary);
    var children = document.createElement('div');
    children.className = 'q-menu-children';
    item.children.forEach(function (child) { children.appendChild(render(child)); });
    details.appendChild(children);
    return details;
  }

  function init() {
    var root = document.querySelector('.q-site-menu');
    var nav = document.querySelector('[data-q-site-menu]');
    if (!root || !nav) return;
    tree.forEach(function (item) { nav.appendChild(render(item)); });
    [root].concat(Array.prototype.slice.call(root.querySelectorAll('details'))).forEach(function (details) {
      var summary = details.querySelector(':scope > summary');
      details.addEventListener('toggle', function () {
        summary.setAttribute('aria-expanded', String(details.open));
      });
      summary.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        summary.click();
      });
    });
    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      var open = event.target.closest('details.q-menu-group[open]');
      if (open) {
        open.open = false;
        open.querySelector('summary').focus();
      } else {
        root.open = false;
        root.querySelector('summary').focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
