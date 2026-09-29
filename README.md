# Quantenstation · 60 Jahre JKU

Statische Website für die Hands-on-Quantenstation zum JKU-Jubiläum am **06.10.**
Vier Stationen plus ein FAQ, alle für das Handy gebaut, alle über
QR-Code erreichbar. Auf Tablet und Laptop bleibt das Layout eine einzelne,
hochformatige Spalte, die nur etwas breiter wird.
Kein Login, kein Build-Schritt, keine Abhängigkeiten — reines HTML, CSS und JavaScript.

---

## Aufbau

```
.
├── index.html                  Startseite mit allen Stationen
├── assets/
│   ├── quantum.css             gemeinsames Design-System
│   ├── quantum.js              Navigation, Fortschritt, Zahlenschlösser
│   ├── quiz.js                 Quiz-Motor (Übersicht + Durchlauf)
│   ├── quiz.css                Darstellung der Quizze und Rätsel
│   ├── qr.js                   QR-Encoder (eigenständig, ohne Bibliothek)
│   ├── site.js                 öffentliche Adresse — Quelle für alle QR-Codes
│   ├── lang.js                 Sprachumschalter DE / EN
│   ├── team.css                Personenliste und Personenseiten
│   ├── team/                   Fotos und Abbildungen des Teams
│   ├── box-1.png, box-2.png    Gravuren der beiden Kisten
│   ├── bloch-gates.js          Bloch-Kugel-Mechanik (Gatter, Drehungen)
│   └── katze.gif               Grafik für Rätsel 1
├── qr/
│   └── index.html              QR-Codes erzeugen und drucken
├── poster-a1/
│   ├── index.html              Druckplakat A1
│   └── img/                    Fotos und Logo fürs Plakat
├── en/                         englische Fassung — erzeugt, nicht bearbeiten
├── i18n/en/                    englische Texte, Quelle für en/
├── tools/
│   ├── build-team.py           baut die Teamseiten aus team-data.json
│   └── build-en.py             baut die englische Fassung unter en/
├── quiz/
│   ├── index.html              Quiz-Pool, nach Stufen sortiert
│   ├── quiz.html               ein Quiz spielen (?id=…)
│   └── pool.js                 alle Fragen — einzige Quelle
└── stations/
    ├── 1-schroedinger/
    │   ├── index.html          Stationsübersicht
    │   ├── info.html           Was ist Superposition?
    │   ├── box.html            Die Boxen — und ihre Grenzen
    │   ├── plakat/             Druckvorlage der Kisten-Gravur
    │   ├── raetsel/            Box 1 · einfach — vier interaktive Rätsel
    │   │   ├── index.html      Rätselübersicht mit Fortschritt
    │   │   ├── 1-superposition.html
    │   │   ├── 2-interferenz.html
    │   │   ├── 3-wellen.html
    │   │   └── 4-labore.html
    │   └── katze-2/            Box 2 · schwer — 4 Schlösser à 4 Fragen
    │       ├── index.html      Übersicht der vier Schlösser
    │       ├── theorie.html    alle Rechenregeln zum Nachlesen
    │       ├── raetsel.js      Verweise in den Fragenpool
    │       ├── 1-zustand.html
    │       ├── 2-messung.html
    │       ├── 3-drehungen.html
    │       └── 4-verschraenkung.html
    ├── 2-bloch-sphere/
    │   ├── index.html
    │   ├── info.html              Kapitel 1 · Was ist ein Qubit?
    │   ├── simulation.html        Kapitel 2 · frei drehen, Gatter, Messung
    │   ├── teste-selbst.html      Kapitel 3 · 20 Vor-Ort-Challenges
    │   ├── challenges-data.js     die 20 Challenges (siehe challenge-cards/data.json)
    │   ├── teste-selbst.js        Prüf-Engine für teste-selbst.html
    │   └── challenge-cards/       gedruckte Referenzkarten (Quelle: data.json)
    ├── 3-quantumtable/
    │   ├── index.html
    │   ├── schaltkreis.html    Drei-Qubit-Simulator (exakt gerechnet)
    │   ├── info.html           Schaltkreise lesen
    │   └── scch.html           Der Partner SCCH
    ├── 4-meettheteam/
    │   ├── index.html
    │   ├── studieren.html      Wege in die Quantenphysik
    │   ├── team-data.json      Texte aller Personen — Quelle für build-team.py
    │   └── personen/
    │       ├── vorlage.html    Vorlage zum Kopieren
    │       └── <vorname-nachname>.html   eine Seite pro Person (generiert)
    └── 5-ama/
        ├── index.html
        ├── fragen.html         durchsuchbare FAQ
        └── mythen.html         sechs Quanten-Mythen
```

---

## Der Quiz-Pool

Neben den vier interaktiven Rätseln gibt es unter `quiz/` **18 Frage-Quizze in
drei Schwierigkeitsstufen** — zusammen 108 Fragen. Jedes Quiz besteht aus sechs
Fragen und endet wie die Rätsel mit einem **vierstelligen Code**.

| Stufe | Wofür | Was verlangt wird |
|---|---|---|
| `kinder` | ab ca. 8 Jahren | Alltagsbilder, kein Rechnen |
| `schule` | Unter- und Oberstufe | Begriffe und Zusammenhänge, Kopfrechnen |
| `studium` | Bachelor-Niveau | Bra-Ket, Zahlenwerte, Einheiten |

Ablauf: eine Frage pro Bildschirm, sofortige Erklärung, bei einem Fehlgriff darf
man erneut wählen. Den Code bekommt am Ende jede und jeder — die Sterne zeigen
nur, wie viel auf Anhieb saß. Bei Rechenfragen erscheint nach dem zweiten
Fehlversuch eine Lösungsanzeige.

### Eine Frage ändern oder ergänzen

Alles steht in `quiz/pool.js` — sonst nirgends. Neue Quizze tauchen automatisch
in der Übersicht auf, samt Fortschrittszähler.

```js
{
  id: 'schule-7',              // eindeutig, steckt in der URL
  level: 'schule',             // kinder | schule | studium
  title: 'Titel',
  sub:   'Zeile für die Kachel',
  code:  '1234',               // vierstellig, im ganzen Pool einmalig
  questions: [
    // Auswahlfrage — die ERSTE Antwort ist die richtige,
    // der Motor mischt sie beim Anzeigen (keep:true hält die Reihenfolge)
    { q: 'Frage?', a: ['richtig', 'falsch', 'falsch'], why: 'Erklärung' },

    // Zahlenfrage — Komma und Punkt sind beide erlaubt
    { q: 'Frage?', num: 0.8, tol: 0.01, unit: 'eV', why: 'Erklärung' }
  ]
}
```

Optional bei beiden Sorten: `given` (Angabeblock mit Formeln über den Antworten)
und `hint` (Text nach einem Fehlversuch). In `q`, `given`, `why` und `hint` ist
HTML erlaubt — praktisch für `<sub>` und `<sup>`.

Wird ein Quiz ergänzt, gehört es auch in die Liste `PAGES` in `qr/index.html`,
damit es einen eigenen QR-Code bekommt.

---

## Die zweite Katze

Ein zweiter Satz von **vier Schlössern** unter
`stations/1-schroedinger/katze-2/`, jedes mit **vier Fragen** und einem eigenen
vierstelligen Code. Anders als die vier interaktiven Rätsel der ersten Katze
sind es reine Frage-Antwort-Rätsel.

| Schloss | Thema | Code | Fragen |
|---|---|---|---|
| 1 · Zustand & Rechenkraft | Normierung, 2ⁿ, Hadamard | `2841` | 2 Zahl, 2 Auswahl |
| 2 · Messung & Kollaps | Superposition, Betragsquadrat | `5073` | 4 Auswahl |
| 3 · Drehungen & Paare | Photonenenergie, Rᵧ, Bell | `9316` | 3 Zahl, 1 Auswahl |
| 4 · Verschränkung im Alltag | Nutzen und Mythen | `6482` | 4 Auswahl |

**Keine Tipps, keine Lösungen.** Bei einem Fehlversuch erscheint nur „noch
nicht“ — ohne Hinweis auf die richtige Antwort und ohne die sonst übliche
Lösungsanzeige. Das schaltet das Feld `strict: true` am jeweiligen Rätsel.
Die Erklärung kommt erst, wenn die Antwort stimmt.

### Woher die Fragen kommen

Keine der sechzehn Fragen ist hier abgeschrieben. Jede **verweist** in den
Fragenpool:

```js
questions: [
  { from: 'studium-1', n: 1 },   // 1. Frage aus Quiz studium-1
  { from: 'schule-5',  n: 2 }
]
```

`quiz/pool.js` bleibt damit die einzige Quelle — eine Korrektur dort wirkt
sofort in beiden Ansichten. Zusätzliche Schlüssel im Verweis überschreiben das
Original, etwa ein eigener `given`-Block. Damit `raetsel.js` die Verweise
auflösen kann, muss `quiz/pool.js` auf der Seite **vorher** eingebunden sein.

Die zweite Katze bekommt eine eigene Stufe mit `hidden: true`. Dadurch taucht
sie nicht im Quiz-Pool auf, nutzt aber denselben Motor.

### Die Theorieseite

`theorie.html` deckt **alles** ab, was die sechzehn Fragen verlangen — mit
Formelkästen, Rechenbeispielen und Tabellen:

| Abschnitt | Inhalt | gebraucht in Schloss |
|---|---|---|
| `#amplituden` | Born'sche Regel, Normierung, vor- und rückwärts gerechnet | 1, 2 |
| `#zweihochn` | 2ⁿ Amplituden mit Größenordnungen | 1 |
| `#messung` | Kollaps, Wiederholungsmessung, kein Bewusstsein nötig | 2 |
| `#gatter` | P(1) = sin²(θ/2), Winkeltabelle, H · X · Z | 1, 3 |
| `#photonen` | E = h·f und die Faustformel E[eV] = 1240 / λ[nm] | 3 |
| `#bell` | Bell-Zustand mit Ergebnistabelle, keine Überlicht-Kommunikation, Quantenkryptografie | 3, 4 |
| `#grenzen` | Quantentechnik im Alltag, Grenzen des Quantenrechnens | 1, 4 |

Drei dieser Themen — Born'sche Regel, Photonenenergie und die Winkelformel —
kamen auf der Website vorher nicht vor. Die übrigen verweisen zusätzlich auf
die bestehenden Seiten (`2-bloch-sphere/simulation.html`,
`3-quantumtable/schaltkreis.html`, `5-ama/mythen.html`).

---

## Lokal ansehen

Die Seiten brauchen einen Webserver — direkt per Doppelklick geöffnet
(`file://`) funktionieren manche Pfade nicht.

```bash
python -m http.server 8000
```

Dann im Browser `http://localhost:8000` aufrufen.

---

## Englische Fassung

Jede Seite gibt es auch auf Englisch, unter `en/` mit demselben Pfad
(z. B. `en/stations/2-bloch-sphere/info.html`). In der Kopfleiste jeder
Seite — auf der Startseite oben rechts — schaltet ein Knopf **DE / EN**
um. Die Wahl merkt sich das Handy (`localStorage`, Schlüssel
`jku60-sprache`): Wer Englisch gewählt hat, landet auch über einen
gedruckten, deutschen QR-Code gleich auf der englischen Seite. Ohne
gemerkte Wahl wird nie umgeleitet. Das erledigt `assets/lang.js`.

**Die deutschen Seiten sind die einzige Quelle.** Die englischen werden
daraus erzeugt — `en/` nie von Hand bearbeiten:

```bash
python tools/build-en.py
```

Das Skript ersetzt jeden Text über die Übersetzungsdateien in `i18n/en/`
(eine Datei pro Seite, dazu `_common.txt` für Texte, die überall
vorkommen) und passt die Pfade an. Ändert sich ein deutscher Text, meldet
es ihn als fehlend. Dann:

```bash
python tools/build-en.py --extract stations/2-bloch-sphere/info.html
```

listet die fehlenden Texte nummeriert; die Übersetzungen als
`1: English text` in eine Datei schreiben und mit
`python tools/build-en.py --merge <seite> <datei>` übernehmen — oder
direkt in `i18n/en/<seite>.txt` ein Paar `de: …` / `en: …` ergänzen.

Texte, die die Skripte erzeugen (Quiz-Motor, Bloch-Kugel), stehen
zweisprachig in `assets/quiz.js`, `assets/quantum.js`,
`assets/bloch-gates.js` und `stations/2-bloch-sphere/teste-selbst.js`.
Die Fragen selbst (`quiz/pool.js`, `katze-2/raetsel.js`,
`challenges-data.js`) laufen über `build-en.py` wie die Seiten.

Nach `python tools/build-team.py` immer auch `python tools/build-en.py`
ausführen. Die Texte der Personen bleiben in ihrer eingereichten Sprache.

Nicht übersetzt sind die Druckvorlagen (A1-Plakat, Kisten-Gravur,
Challenge-Karten).

---

## Veröffentlicht

Öffentliches Repository: **https://github.com/QUICK-JKU/quantenstation**
(GitHub Pages aus `main`, Ordner `/`). Die Website liegt unter

```
https://quick-jku.github.io/quantenstation/
https://quick-jku.github.io/quantenstation/en/
```

Änderungen veröffentlichen: committen und `git push` — nach ein bis zwei
Minuten ist die Seite aktuell. Vorher `python tools/build-en.py` laufen
lassen, damit die englische Fassung mitzieht.

Lokal ansehen geht weiterhin mit `python -m http.server 8000`.

---

## QR-Codes

Die öffentliche Adresse steht an **einer** Stelle: `assets/site.js`.
Alle QR-Codes lesen sie von dort:

| Wo | Zeigt auf |
|---|---|
| `poster-a1/index.html` (A1-Plakat) | Startseite |
| `stations/1-schroedinger/plakat/canvas.html` (Kisten-Gravur) | Station 1 |
| `stations/2-bloch-sphere/challenge-cards/canvas.html` (8 Karten) | „Teste selbst“ |
| `qr/index.html` | 8 Stationsschilder + jede Einzelseite |
| `en/qr/index.html` | dasselbe für die englischen Seiten |

Drucken: Seite im Browser öffnen, **Drucken** (am besten als PDF), einen
Code vor dem Vervielfältigen mit dem Handy gegenprüfen. Mindestens 4 cm
Kantenlänge, den weißen Rand um den Code nicht wegschneiden.

> **Achtung:** Jeder gedruckte Code enthält die Adresse fest. Zieht die
> Website um (anderes Repository, eigene Domain), zeigen gedruckte Codes ins
> Leere. Dann `assets/site.js` ändern und neu drucken — oder von Anfang an
> eine eigene Domain (Datei `CNAME` plus DNS-Eintrag) verwenden.

---

## Noch anzupassen

Diese Stellen sind bewusst als Platzhalter angelegt. Alle sind im Quelltext
mit einem Kommentar `ANPASSEN` markiert; Platzhaltertexte stehen in
`[eckigen Klammern]`.

| Datei | Was fehlt |
|---|---|
| `stations/3-quantumtable/scch.html` | konkrete Angaben zum SCCH, falls abgestimmt |
| `stations/5-ama/index.html` | optionaler Link auf ein Online-Frageformular |

Eine weitere Person hinzufügen:

1. Den Eintrag in `stations/4-meettheteam/team-data.json` ergänzen (die
   Datei liegt nur lokal und nicht im öffentlichen Repository — sie enthält
   Redaktionsnotizen und nicht freigegebene Einträge)
2. `python tools/build-team.py` ausführen — das erzeugt die Personenseite
   und den Block zwischen `BEGIN GENERATED` und `END GENERATED` in
   `4-meettheteam/index.html`
3. `python tools/build-en.py` ausführen, damit die englische Fassung
   mitzieht
4. In `qr/index.html` die Seite in der Liste `PAGES` ergänzen, damit sie
   auch einen QR-Code bekommt

---

## Technische Hinweise

**Fortschritt der Rätsel** wird in `localStorage` unter dem Schlüssel
`jku60-quanten-fortschritt` gespeichert — nur lokal auf dem Gerät, ohne
Server, ohne Tracking. Auf der Startseite lässt er sich zurücksetzen.

**Lösungscodes** der vier Rätsel:

| Rätsel | Code |
|---|---|
| 1 · Superposition | `4540` |
| 2 · Interferenz | `6060` |
| 3 · Wellen | `3060` |
| 4 · Labore | `7570` |

**Lösungscodes** der 18 Quizze (Quelle: `quiz/pool.js`):

| Stufe | Quiz | Code |
|---|---|---|
| Kinder | Die Katze im Karton | `1207` |
| Kinder | Licht macht Faxen | `3418` |
| Kinder | Klitzeklein | `5092` |
| Kinder | Zufall und Würfel | `2736` |
| Kinder | Der Quantencomputer | `8153` |
| Kinder | Im Labor | `4671` |
| Schule | Superposition & Messung | `9284` |
| Schule | Doppelspalt & Interferenz | `1365` |
| Schule | Photonen & Photoeffekt | `7048` |
| Schule | Atome & Spektren | `2519` |
| Schule | Qubits & Gatter | `6837` |
| Schule | Verschränkung & Mythen | `3902` |
| Studium | Zustände & Normierung | `8426` |
| Studium | Born-Regel & Erwartungswerte | `1794` |
| Studium | Materiewellen & Unschärfe | `5361` |
| Studium | Atomphysik & Spektren | `9028` |
| Studium | Bloch-Kugel & Gatter | `4287` |
| Studium | Verschränkung, Bell & Algorithmen | `6715` |

**Lösungscodes** der zweiten Katze (Quelle: `stations/1-schroedinger/katze-2/raetsel.js`):

| Schloss | Code |
|---|---|
| 1 · Zustand & Rechenkraft | `2841` |
| 2 · Messung & Kollaps | `5073` |
| 3 · Drehungen & Paare | `9316` |
| 4 · Verschränkung im Alltag | `6482` |

**Schriften** kommen von Google Fonts. Ohne Internet greift der Browser auf
Systemschriften zurück — das Layout bleibt intakt.

**Browser:** getestet auf aktuellem Chromium. Verwendet werden nur breit
unterstützte Techniken (Flexbox, Grid, `aspect-ratio`, `<details>`,
Pointer Events).

**Barrierefreiheit:** durchgehend Deutsch ausgezeichnet, Bedienelemente sind
mindestens 44 px groß, Fokus ist sichtbar, und `prefers-reduced-motion` wird
respektiert.

---

## Die vier Rätsel

Sie stammen aus den bereits veröffentlichten Netlify-Versionen und wurden für
dieses Repository nach reinem HTML/JavaScript portiert — gleiche Logik,
gleiche Codes, dazu mobiltauglicheres Layout und gemeinsame Navigation.

Die Originale bleiben erreichbar:

* [Rätsel 1 · Superposition](https://r-tsel-1-superposition-cd-127c3db464.netlify.app)
* [Rätsel 2 · Interferenz](https://r-tsel-2-interferenz-cd-a69f09b1d7.netlify.app)
* [Rätsel 3 · Wellen](https://r-tsel-3-wellen-cd-74350f3672.netlify.app)
* [Rätsel 4 · Labore](https://r-tsel-4-labore-cd-e222ba1aa1.netlify.app)
