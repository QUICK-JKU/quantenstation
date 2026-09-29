#!/usr/bin/env python3
"""Baut die Team-Seite aus stations/4-meettheteam/team-data.json.

Erzeugt:
  · stations/4-meettheteam/personen/<id>.html  (eine Seite pro Person)
  · den Personenblock in stations/4-meettheteam/index.html
    zwischen den Markern BEGIN GENERATED / END GENERATED

Die Texte der Personen werden wortwoertlich uebernommen, so wie sie
eingereicht wurden. Uebersetzt wird nichts.

Aufruf aus dem Projektordner:  python tools/build-team.py
"""

import html
import io
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATION = os.path.join(ROOT, "stations", "4-meettheteam")
DATA = os.path.join(STATION, "team-data.json")
PERSONEN = os.path.join(STATION, "personen")
INDEX = os.path.join(STATION, "index.html")

# Personen, die doppelt in den Daten stehen: welcher Eintrag gewinnt.
PREFER = {"Jadwiga Wilkens": "en", "Richard Kueng": "en"}

AVATAR_COLORS = ["", "a-purple", "a-red", "a-green", "a-coral"]

# Die Seiten gehören zur deutschen Fassung (Kopf- und Fußleiste deutsch);
# der eingereichte Text steht in <main lang="…"> in seiner eigenen Sprache.
# tools/build-en.py erzeugt daraus die englische Fassung unter en/ —
# nach diesem Skript also immer auch jenes laufen lassen.
HEAD = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#f3efe6">
<title translate="no">{name} · Meet the Team</title>
<meta name="description" content="{meta}" translate="no">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=IBM+Plex+Mono:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../../assets/quantum.css">
<link rel="stylesheet" href="../../../assets/team.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%91%A5%3C/text%3E%3C/svg%3E">
</head>
<body>

<header class="q-topbar">
  <div class="q-topbar-inner">
    <a class="q-back" href="../index.html" data-q-back aria-label="Zurück zum Team">←</a>
    <div class="q-topbar-title">Station 4 · Team</div>
    <div class="q-topbar-badge">👥 Person</div>
  </div>
</header>

<main class="q-main" lang="{lang}">
  <div class="q-glow"></div>
"""

FOOT = """
  <div class="q-wrap q-mt">
    <div class="q-list">
      <a class="q-tile" href="../index.html">
        <span class="q-tile-num c-green">👥</span>
        <span class="q-tile-txt">
          <span class="q-tile-title">Back to the team</span>
          <span class="q-tile-sub">Everyone at a glance</span>
        </span>
        <span class="q-tile-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </div>

</main>

<nav class="q-bottombar" aria-label="Stationen">
  <div class="q-bottombar-inner">
    <a class="q-navitem" href="../../../index.html"><span class="ico" aria-hidden="true">🏠</span>Start</a>
    <a class="q-navitem" href="../../1-schroedinger/"><span class="ico" aria-hidden="true">🐱</span>Katze</a>
    <a class="q-navitem" href="../../2-bloch-sphere/"><span class="ico" aria-hidden="true">🔮</span>Kugel</a>
    <a class="q-navitem" href="../../3-quantumtable/"><span class="ico" aria-hidden="true">⚛️</span>Table</a>
    <a class="q-navitem" href="../../4-meettheteam/"><span class="ico" aria-hidden="true">👥</span>Team</a>
    <a class="q-navitem" href="../../5-ama/"><span class="ico" aria-hidden="true">💬</span>FAQ</a>
  </div>
</nav>

<script src="../../../assets/quantum.js"></script>
</body>
</html>
"""


def esc(s):
    return html.escape(s or "", quote=True)


def initials(name):
    parts = [p for p in re.split(r"\s+", name.strip()) if p]
    if len(parts) == 1:
        return parts[0][:1].upper()
    return (parts[0][:1] + parts[-1][:1]).upper()


def pick_people(data):
    """Alle include-true Personen, Duplikate nach PREFER zusammengefuehrt."""
    out, seen = [], {}
    for p in data["people"]:
        if not p.get("include"):
            continue
        name = p["name"]
        if name in seen:
            want = PREFER.get(name)
            if want and p.get("lang") == want:
                out[seen[name]] = p
            continue
        seen[name] = len(out)
        out.append(p)
    out.sort(key=lambda p: (p.get("order") or 99, p["name"]))
    return out


def avatar(p, idx, big=False):
    """Rundes Foto, sonst Monogramm."""
    color = AVATAR_COLORS[idx % len(AVATAR_COLORS)]
    cls = "bigavatar" if big else "avatar"
    if p.get("photo"):
        src = "../../../assets/team/" if big else "assets/team/"
        src = ("../../../assets/team/" if big else "../../../assets/team/")
        file = os.path.basename(p["photo"])
        pos = p.get("photoPos") or "50% 40%"
        return (
            '<span class="{cls} has-photo">'
            '<img src="{src}{file}" alt="{name}" loading="lazy" '
            'style="object-position:{pos};"></span>'
        ).format(cls=cls, src=src, file=file, name=esc(p["name"]), pos=pos)
    extra = (" " + color) if color else ""
    return '<span class="{cls}{extra}">{ini}</span>'.format(
        cls=cls, extra=extra, ini=initials(p["name"])
    )


ORCID = re.compile(r"^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$")


def normalize_url(raw):
    """(url, hinweis). In den Daten steht im Feld 'url' nicht immer eine URL:
    mal fehlt das Schema, mal steht dort eine ORCID oder nur 'YouTube'.
    Was keine Adresse ergibt, wird nicht verlinkt."""
    u = (raw or "").strip()
    if not u:
        return "", ""
    if re.match(r"^(https?:|mailto:)", u):
        return u, ""
    if ORCID.match(u):
        return "https://orcid.org/" + u, ""
    if re.match(r"^[\w.-]+\.[a-z]{2,}(/|$)", u, re.I):
        return "https://" + u.lstrip("/"), ""
    return "", u


def paragraphs(items, cls="q-body q-mt-sm"):
    return "\n".join(
        '    <p class="{c}">{t}</p>'.format(c=cls, t=esc(t)) for t in items if t
    )


def person_page(p, idx):
    """Eine Personenseite. Ueberschriften und Bezeichner sind englisch,
    der eingereichte Text bleibt in seiner Sprache."""
    parts = [HEAD.format(
        lang=p.get("lang") or "en",
        name=esc(p["name"]),
        meta=esc(p.get("subtitle") or p.get("title") or p["name"]),
    )]

    # Kopf: Rolle (falls vorhanden), Name, dann Titel und Untertitel,
    # die als Paar zusammengehoeren. Das Forschungsgebiet steht darunter
    # in der Karte, damit es bei jeder Person auftaucht.
    parts.append('\n  <div class="q-wrap q-center">')
    parts.append("    " + avatar(p, idx, big=True))
    eyebrow = p.get("role") or ""
    if eyebrow:
        parts.append(
            '    <div class="q-eyebrow q-mt-sm">{}</div>'.format(esc(eyebrow))
        )
    parts.append('    <h1 class="q-h1">{}</h1>'.format(esc(p["name"])))
    if p.get("title"):
        parts.append(
            '    <p class="q-lead" style="max-width:400px;margin-left:auto;'
            'margin-right:auto;">{}</p>'.format(esc(p["title"]))
        )
    if p.get("subtitle"):
        parts.append(
            '    <p class="q-body q-mt-sm" style="max-width:400px;'
            'margin-left:auto;margin-right:auto;">{}</p>'.format(
                esc(p["subtitle"]))
        )
    parts.append("  </div>\n")

    # Das Forschungsgebiet steht bei jeder Person.
    if p.get("field"):
        parts.append('  <div class="q-wrap q-mt">')
        parts.append('    <div class="q-card">')
        parts.append('      <div class="q-kv">')
        parts.append('        <div class="q-kv-row">')
        parts.append('          <span class="q-kv-key">Field</span>')
        parts.append('          <span class="q-kv-val">{}</span>'.format(
            esc(p["field"])))
        parts.append("        </div>")
        parts.append("      </div>")
        parts.append("    </div>")
        parts.append("  </div>\n")

    if p.get("whatIDo"):
        parts.append('  <div class="q-wrap q-mt">')
        parts.append('    <h2 class="q-h2">What I do</h2>')
        parts.append(paragraphs(p["whatIDo"]))
        parts.append("  </div>\n")

    if p.get("whyMatters"):
        parts.append('  <div class="q-wrap q-mt">')
        parts.append('    <h2 class="q-h2">Why it matters</h2>')
        parts.append(paragraphs(p["whyMatters"]))
        parts.append("  </div>\n")

    # Ergebnis
    r = p.get("result") or {}
    if r.get("num"):
        parts.append('  <div class="q-wrap q-mt">')
        parts.append('    <div class="q-card q-center">')
        parts.append('      <div class="bignum">{}</div>'.format(esc(str(r["num"]))))
        parts.append('      <div class="q-small q-mt-sm">{}</div>'.format(
            esc(r.get("label", ""))))
        parts.append("    </div>")
        parts.append("  </div>\n")
    elif r.get("text"):
        parts.append('  <div class="q-wrap q-mt">')
        parts.append('    <div class="q-note q-note-blue">')
        parts.append('      <div class="q-note-title">The result</div>')
        parts.append('      <div class="q-body">{}</div>'.format(esc(r["text"])))
        parts.append("    </div>")
        parts.append("  </div>\n")
    elif r.get("items"):
        parts.append('  <div class="q-wrap q-mt">')
        parts.append('    <h2 class="q-h2">Key findings</h2>')
        parts.append('    <div class="q-stack q-mt-sm">')
        for it in r["items"]:
            parts.append('      <div class="q-card">')
            parts.append('        <div class="q-note-title">{}</div>'.format(
                esc(it.get("lead", ""))))
            parts.append('        <p class="q-body">{}</p>'.format(
                esc(it.get("text", ""))))
            parts.append("      </div>")
        parts.append("    </div>")
        parts.append("  </div>\n")

    # Abbildung
    fig = p.get("figure") or {}
    if fig.get("src"):
        parts.append('  <div class="q-wrap q-mt">')
        parts.append('    <figure class="q-figure">')
        parts.append('      <img src="../../../assets/team/{}" alt="{}" '
                     'loading="lazy">'.format(
                         os.path.basename(fig["src"]), esc(fig.get("caption", ""))))
        if fig.get("caption"):
            parts.append('      <figcaption class="q-small">{}</figcaption>'.format(
                esc(fig["caption"])))
        parts.append("    </figure>")
        parts.append("  </div>\n")

    if p.get("funFact"):
        parts.append('  <div class="q-wrap q-mt">')
        parts.append('    <div class="q-note q-note-green">')
        parts.append('      <div class="q-note-title">Fun fact</div>')
        parts.append('      <div class="q-body">{}</div>'.format(esc(p["funFact"])))
        parts.append("    </div>")
        parts.append("  </div>\n")

    refs = p.get("refs") or []
    if refs:
        parts.append('  <div class="q-wrap q-mt">')
        parts.append('    <h2 class="q-h2">Further reading</h2>')
        parts.append('    <div class="q-list q-mt-sm">')
        for ref in refs:
            url, note = normalize_url(ref.get("url"))
            txt = ref.get("text") or url
            if note:
                txt = "{} ({})".format(txt, note)
            if url:
                parts.append(
                    '      <a class="q-tile" href="{u}" target="_blank" '
                    'rel="noopener">'.format(u=esc(url)))
                parts.append('        <span class="q-tile-num c-ink">🔗</span>')
                parts.append('        <span class="q-tile-txt">')
                parts.append('          <span class="q-tile-title">{}</span>'.format(
                    esc(txt)))
                parts.append('        </span>')
                parts.append('        <span class="q-tile-arrow" aria-hidden="true">→</span>')
                parts.append("      </a>")
            else:
                parts.append('      <div class="q-card"><p class="q-body">{}</p></div>'
                             .format(esc(txt)))
        parts.append("    </div>")
        parts.append("  </div>\n")

    parts.append(FOOT)
    return "\n".join(parts)


def index_block(people):
    out = []
    for i, p in enumerate(people):
        line = p.get("title") or p.get("subtitle") or ""
        role = p.get("role") or p.get("field") or ""
        out.append('      <a class="person" href="personen/{id}.html">'.format(
            id=p["id"]))
        out.append("        " + avatar(p, i).replace("../../../assets/team/",
                                                     "../../assets/team/")
                   .replace('<span class="avatar', '<span translate="no" class="avatar', 1))
        out.append('        <span class="p-txt">')
        out.append('          <span class="p-name" translate="no">{}</span>'.format(
            esc(p["name"])))
        lang = esc(p.get("lang") or "en")
        if role:
            out.append('          <span class="p-role" lang="{}">{}</span>'.format(
                lang, esc(role)))
        if line:
            out.append('          <span class="p-line" lang="{}">{}</span>'.format(
                lang, esc(line)))
        out.append("        </span>")
        out.append('        <span class="q-tile-arrow" aria-hidden="true">→</span>')
        out.append("      </a>\n")
    return "\n".join(out)


def main():
    data = json.load(io.open(DATA, encoding="utf-8"))
    people = pick_people(data)

    if not os.path.isdir(PERSONEN):
        os.makedirs(PERSONEN)
    for i, p in enumerate(people):
        path = os.path.join(PERSONEN, p["id"] + ".html")
        io.open(path, "w", encoding="utf-8", newline="\n").write(person_page(p, i))

    src = io.open(INDEX, encoding="utf-8").read()
    block = index_block(people)
    new, n = re.subn(
        r"(<!-- BEGIN GENERATED -->\n).*?([ \t]*<!-- END GENERATED -->)",
        lambda m: m.group(1) + block + m.group(2),
        src,
        flags=re.S,
    )
    if n != 1:
        raise SystemExit("Marker BEGIN/END GENERATED nicht gefunden in " + INDEX)
    io.open(INDEX, "w", encoding="utf-8", newline="\n").write(new)

    print("{} Personen gebaut:".format(len(people)))
    for p in people:
        flag = "Foto" if p.get("photo") else "Monogramm"
        print("  - {:24s} {:3s} {}".format(p["id"], p.get("lang", ""), flag))
    todo = [(p["name"], t) for p in people for t in (p.get("todo") or [])]
    if todo:
        print("\nOffen laut team-data.json:")
        for name, t in todo:
            print("  - {}: {}".format(name, t))


if __name__ == "__main__":
    main()
