# Bloch-Kugel-Herausforderungen — Referenzkarten (Druck)

A4-Karten für Station 2, zum Ausdrucken: **eine Seite pro physischer Kugel**
(Level 1–4) — **in zwei Varianten**, also 8 Seiten insgesamt:

1. **Seiten 1–4 · mit Lösungen** ("MIT LÖSUNGEN" im Kopf, "· LÖSUNGEN" im
   Fuß) — Referenz für Betreuer:innen.
2. **Seiten 5–8 · ohne Lösungen** — zum Aushändigen an Besucher:innen. Nur
   die Aufgabe (Startzustand, Gattersequenz bzw. Rätsel-Setup); den
   Endzustand merkt man sich und prüft ihn über den QR-Code auf der
   Website.

Es gibt keine separate Cover- oder Team-Seite — Aufgaben werden nicht
zwingend der Reihe nach an den vier Kugeln bearbeitet, also steht auf
**jeder** Seite alles, was man für diese Stufe braucht: eine kurze
Aufgabenstellung, die Definition jedes dort verwendeten Gatters (Drehung +
zwei Beispiele: was es dreht, was es unverändert lässt), und alle 5
Aufgaben dieser Stufe als kompakte Zeile. Ein großes farbiges
Zahlen-Abzeichen im Kopf macht die Stufe auf einen Blick erkennbar.

## Die zwei Dateien, die zählen

| Datei | Rolle | Wer bearbeitet sie |
|---|---|---|
| `data.json` | Alle 20 Aufgaben (plus `team_challenge` als unbenutzte Referenz). Kopie/Quelle aus dem Simulator-Export. | Bei neuen/geänderten Aufgaben |
| `canvas.html` | Layout, Farben, Druck-CSS, die gesamte Render-Logik (Aufgabentext, Gatter-Glossar, Zeilen-Layouts). | Für Design-Änderungen |

`build.py` liest `data.json` und ersetzt darin **nur** den mit
`BEGIN GENERATED` / `END GENERATED` markierten Block in `canvas.html`
(die Konstanten `META`, `CHALLENGES`). Alles andere in `canvas.html` —
Styling, `INTRO_HTML` (Aufgabentext + QR-Platzhalter), das Gatter-Glossar
(`GATE_INFO`/`AXIS_DESC`, zusammengestellt pro Seite via
`levelGateNames`/`gateInfoGrid`), die deutschen Kurztitel für Level 3
(`DE_TITLE_SUB`), und die beiden Zeilen-Layout-Sets pro Aufgabentyp
(`TASK_ROW_BUILDERS` ohne Lösung, `SOLUTION_ROW_BUILDERS` mit Lösung,
ausgewählt in `levelPage(level, withSolutions)`) — bleibt beim Neu-Bauen
unangetastet.

## QR-Code einfügen

Jede Seite hat oben rechts einen gestrichelten Platzhalter (`.qr-box`)
statt eines echten QR-Codes — die Website hat laut Haupt-README noch keine
finale URL. Sobald sie live ist:

1. In `canvas.html` den Kommentar `TODO` direkt über `INTRO_HTML` suchen.
2. `<script src="../../assets/qr.js"></script>` einbinden (liegt schon im
   Repo, wird auch vom `qr/`-Tool verwendet).
3. `.qr-box` durch `QR.svg(url, {ec:'M', quiet:4})` ersetzen — am besten
   pro Level auf die passende Unterseite verlinken, falls es eine gibt,
   sonst auf die allgemeine Bloch-Kugel-Seite.

Nach jeder Änderung an `data.json`:

```bash
python build.py
```

## Eine Aufgabe ändern

1. Aufgabe in `data.json` anpassen (Feldnamen siehe `challenges.json`-Konvention:
   `sequence`, `expected`, `template`, `options`, `valid`, `tests`, `answers`, `A`/`B` …).
2. `python build.py` ausführen.
3. `canvas.html` im Browser öffnen und prüfen (siehe unten).

Die Prompts der fünf Level-3-Aufgaben liegen im Original auf Englisch vor;
die deutschen Karten-Titel dafür stehen bewusst hand-geschrieben in
`canvas.html` (`DE_TITLE_SUB`), nicht in `data.json` — das ist reine
Anzeige-Übersetzung, keine Aufgaben-Logik. Jeder Titel/Untertitel ist als
offene Frage formuliert (z. B. "Wie oft bis |−⟩?"), nie als Antwort.

## Drucken

Jede Karte ist exakt die bedruckbare Fläche von A4 (194 × 281 mm,
733 × 1062 px), nicht das volle Blatt — ein normaler Drucker kann nicht bis
zum Rand drucken. `@page` gibt beim Druck 8 mm Rand zurück.

- Im Druckdialog **"Tatsächliche Größe" / 100 %** wählen, nie "An Seite anpassen".
- Eine Seite pro Blatt, 8 Blatt insgesamt (automatischer Seitenumbruch je `<article>`).
- Hintergrundgrafiken/-farben aktivieren ("Hintergrundgrafiken drucken").
- Die ersten 4 Blatt (mit Lösungen) getrennt von den letzten 4 (ohne)
  ablegen/drucken, damit am Stand nicht versehentlich die Lösungsseite
  ausliegt.

## Vorschau beim Bearbeiten

`canvas.html` direkt im Browser öffnen (keine Abhängigkeiten, kein
Build-Server nötig) — die Seite rendert alle Karten aus dem eingebetteten
generierten Block.

## Ordner

Nur diese drei Dateien sind aktiv. Die Original-Simulator-Ausgabe
(`challenges.json`, `HANDOFF.md`) für die interaktive Kiosk-Website liegt
separat und ist hier nicht referenziert.
