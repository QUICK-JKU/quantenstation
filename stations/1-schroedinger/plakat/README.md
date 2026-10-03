# Schrödinger-Box — Anleitung (Druck)

Ein einzelnes A4-Blatt für Station 1, zum Aushängen oder Hinlegen neben den
beiden Kisten. Oben ein QR-Code auf die Stationsseite und die vier Schritte
in Worten, darunter die zwei Kisten nebeneinander, nur Foto und
Beschriftung.

Gebaut nach demselben Muster wie die Bloch-Referenzkarten unter
`stations/2-bloch-sphere/challenge-cards/` — gleiche Schriften, gleiches
Kopfband mit Atom-Signet, gleicher dunkler Fußbalken, gleiches Druck-CSS.

## Die Datei

`canvas.html` enthält alles: Layout, Farben, Text und die QR-Erzeugung. Es
gibt keinen Build-Schritt und keine Datendatei, das Blatt ist zu klein
dafür. Einfach im Browser öffnen und bearbeiten.

## QR-Codes

Auf dem Blatt steht **ein** Code, und der führt auf die Stationsseite
`stations/1-schroedinger/`. Von dort aus sucht man sich die Kiste aus. Bei
den Kisten selbst steht bewusst kein Code, damit niemand mitten in einem
Rätsel landet, ohne die Infos gelesen zu haben.

Anders als bei den Bloch-Karten ist der Code echt, sobald die Adresse der
Website bekannt ist. Am Bildschirm sitzt über dem Blatt eine Leiste mit
einem Feld **Basis-Adresse der Website**:

1. Adresse eintragen, zum Beispiel `https://konto.github.io/quantenstation/`
2. **QR-Codes erzeugen** drücken

Die Adresse wird im selben Speicher abgelegt wie beim QR-Werkzeug unter
`qr/` (`jku60-qr-basis`). Wer sie dort schon gesetzt hat, sieht die Codes
hier sofort. Ohne Adresse bleibt ein gestrichelter Platzhalter stehen,
damit niemand versehentlich einen toten Code druckt.

Das Ziel steht im Attribut `data-qr` der `.qr-box` und lässt sich dort
ändern.

Die Leiste erscheint nur am Bildschirm, im Druck ist sie ausgeblendet.

## Die Motive der Kisten

Auf dem Blatt stehen die beiden Laser-Gravuren, die auch auf den Kisten
sind:

| Kiste | Datei | Herkunft |
|---|---|---|
| Box 1 · einfach | `assets/box-1.png` | Katzen-Motiv, „Schrödinger's cat is alive/dead" |
| Box 2 · schwer | `assets/box-2.png` | `quantum_box_laser.pdf`, „Quantum Enclosure System" |

Sie liegen bewusst unter `assets/` und nicht in diesem Ordner, weil die
Stationsseite `stations/1-schroedinger/index.html` dieselben Dateien in
ihrer Infobox „Vor Ort" verwendet. Wer ein Motiv austauscht, sollte beide
Seiten anschauen.

Beide werden vollständig gezeigt (`object-fit: contain`) und nicht
beschnitten, damit von der Gravur nichts wegfällt. Fehlt eine Datei, bleibt
die Regel `.box-foto-platzhalter` als gestricheltes Ersatzfeld im
Stylesheet.

Jede Kiste besteht aus drei Teilen: der dunklen Kopfleiste mit
**BOX 1 · EINFACH** beziehungsweise **BOX 2 · SCHWER**, der hellen Fläche
darunter als Rahmen, und dem Motiv darin. Kein Beschreibungstext und kein
eigener QR-Code.

## Das Lösungsblatt

`loesungen.html` ist das Gegenstück für das Team: zwei A4-Blätter mit allen
acht Codes, einem pro Schloss, dazu der Rechenweg beziehungsweise die
richtigen Antworten. Blatt 1 ist Box 1 (grün), Blatt 2 ist Box 2 (rot).

Jede Zeile zeigt die Farbe des echten Vorhängeschlosses. Die Zuordnung ist
in beiden Kisten dieselbe und folgt den Farben, die auf der Website ohnehin
schon an den Rätseln hängen:

| Schloss | Farbe | Box 1 | Box 2 |
|---|---|---|---|
| 1 | Dunkelblau | 4540 | 2841 |
| 2 | Rot | 6060 | 5073 |
| 3 | Schwarz | 3060 | 9316 |
| 4 | Silber | 7570 | 6482 |

Die Blätter tragen oben den Hinweis **Nur für das Team**. Sie gehören nicht
zu den Besucherunterlagen und sollten am Stand getrennt vom Plakat liegen.

## Drucken

Das Blatt ist exakt die bedruckbare Fläche von A4 (194 × 281 mm,
733 × 1062 px), nicht das volle Blatt — ein normaler Drucker kann nicht bis
zum Rand drucken. `@page` gibt beim Druck 8 mm Rand zurück.

- Im Druckdialog **„Tatsächliche Größe" / 100 %** wählen, nie „An Seite anpassen".
- Hintergrundgrafiken und -farben aktivieren, sonst fehlen Kopfband und
  Fußbalken.
- Eine Seite, ein Blatt.

Der Inhalt füllt die Seite ohne Reserve. Wer Text ergänzt, sollte danach
prüfen, dass unten nichts abgeschnitten wird: `canvas.html` öffnen und in
der Konsole

```js
const b = document.querySelector('.body'); b.scrollHeight <= b.offsetHeight
```

muss `true` ergeben.
