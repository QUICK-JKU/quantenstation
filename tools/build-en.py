#!/usr/bin/env python3
"""Baut die englische Fassung der Website unter en/.

Die deutschen Seiten bleiben die einzige Quelle für Aufbau, Design und
Skripte. Die englischen Seiten werden daraus erzeugt: Jeder Text wird
über die Übersetzungsdateien in i18n/en/ ersetzt, relative Pfade werden
auf die tiefere Ordnerebene angepasst. Ändert sich eine deutsche Seite,
genügt ein neuer Lauf — nur geänderte oder neue Texte fehlen dann und
werden gemeldet.

Außerdem pflegt das Skript auf BEIDEN Sprachfassungen den Sprachumschalter
(Knopf DE/EN in der Kopfleiste) und die <link rel="alternate">-Angaben,
über die assets/lang.js die gewählte Sprache merkt.

Aufrufe aus dem Projektordner:

  python tools/build-en.py                  alles bauen, Fehlendes melden
  python tools/build-en.py --missing        nur melden, nichts schreiben
  python tools/build-en.py --extract DATEI  fehlende Texte einer Datei
                                            nummeriert ausgeben
  python tools/build-en.py --merge DATEI ÜBERSETZUNG.txt
                                            nummerierte Übersetzungen
                                            ("3: Text", "4: =") in die
                                            Übersetzungsdatei übernehmen

Übersetzungsdateien (i18n/en/<pfad>.txt, dazu i18n/en/_common.txt für
Texte, die auf vielen Seiten vorkommen) bestehen aus Paaren:

  de: Ein <strong>Qubit</strong> kann beides sein.
  en: A <strong>qubit</strong> can be both.

"en: =" heißt: bleibt gleich. Leerzeichen und Zeilenumbrüche im deutschen
Original zählen nicht. Übersetzt werden:
  · jeder Textblock (das innerste Element mit eigenem Text, samt
    Formatierung darin),
  · die Attribute alt, aria-label, title, placeholder und die
    meta-Beschreibung,
  · Texte in Skripten auf der Seite und in den Datendateien (DATA_FILES).
Elemente mit translate="no" oder einem lang-Attribut ungleich "de"
werden übersprungen (z. B. die englischen Texte der Personenseiten).
"""

import io
import os
import posixpath
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
I18N = os.path.join(ROOT, "i18n", "en")
OUT = "en"

# Nicht gespiegelt: Druckvorlagen und Werkzeug-Vorlagen.
EXCLUDE_DIRS = {".git", ".idea", ".claude", "en", "i18n", "tools",
                "poster-a1", "stations/1-schroedinger/plakat",
                "stations/2-bloch-sphere/challenge-cards"}
EXCLUDE_FILES = {"stations/4-meettheteam/personen/vorlage.html"}

# Seitenbezogene Daten mit Texten: bekommen eine englische Kopie unter en/.
DATA_FILES = [
    "quiz/pool.js",
    "stations/1-schroedinger/katze-2/raetsel.js",
    "stations/2-bloch-sphere/challenges-data.js",
]

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "source", "track", "wbr"}
LETTER = re.compile(r"[A-Za-zÄÖÜäöüß]")
ATTRS = ("alt", "aria-label", "title", "placeholder")


# ---------------------------------------------------------------- Dateien

def html_pages():
    out = []
    for dirpath, dirnames, files in os.walk(ROOT):
        rel = os.path.relpath(dirpath, ROOT).replace(os.sep, "/")
        rel = "" if rel == "." else rel
        dirnames[:] = [d for d in dirnames
                       if (rel + "/" + d).lstrip("/") not in EXCLUDE_DIRS]
        for f in files:
            p = (rel + "/" + f).lstrip("/")
            if f.endswith(".html") and p not in EXCLUDE_FILES:
                out.append(p)
    return sorted(out)


def read(path):
    return io.open(os.path.join(ROOT, path), encoding="utf-8").read()


def write(path, text):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    if os.path.exists(full) and read(path) == text:
        return False
    io.open(full, "w", encoding="utf-8", newline="").write(text)
    return True


# ------------------------------------------------------ Übersetzungsdateien

def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def load_dict(path):
    d = {}
    if not os.path.exists(path):
        return d
    de = None
    for n, line in enumerate(io.open(path, encoding="utf-8"), 1):
        line = line.rstrip("\n")
        if line.startswith("de: "):
            de = norm(line[4:])
        elif line.startswith("en: "):
            if de is None:
                raise SystemExit("{}:{}: en ohne de".format(path, n))
            en = line[4:].strip()
            d[de] = de if en == "=" else en
            de = None
    return d


def dict_path(rel):
    return os.path.join(I18N, rel + ".txt")


def lookup(rel):
    d = load_dict(os.path.join(I18N, "_common.txt"))
    d.update(load_dict(dict_path(rel)))
    return d


# ------------------------------------------------------------ HTML-Analyse

class Node(object):
    __slots__ = ("tag", "attrs", "s", "tag_end", "inner_end", "parent",
                 "children", "direct")

    def __init__(self, tag, attrs, s, tag_end, parent):
        self.tag, self.attrs, self.s, self.tag_end = tag, dict(attrs), s, tag_end
        self.inner_end = None
        self.parent, self.children, self.direct = parent, [], False


class Tree(HTMLParser):
    def __init__(self, src):
        HTMLParser.__init__(self, convert_charrefs=True)
        self.src = src
        self.lines = [0]
        for m in re.finditer("\n", src):
            self.lines.append(m.end())
        self.root = Node("#root", [], 0, 0, None)
        self.stack = [self.root]
        self.tags = []          # alle Start-Tags, auch leere Elemente
        self.feed(src)
        self.close()

    def off(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def _open(self, tag, attrs, push):
        s = self.off()
        text = self.get_starttag_text()
        node = Node(tag, attrs, s, s + len(text), self.stack[-1])
        self.stack[-1].children.append(node)
        self.tags.append(node)
        if push:
            self.stack.append(node)

    def handle_starttag(self, tag, attrs):
        self._open(tag, attrs, tag not in VOID)

    def handle_startendtag(self, tag, attrs):
        self._open(tag, attrs, False)

    def handle_endtag(self, tag):
        pos = self.off()
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                for n in self.stack[i:]:
                    if n.inner_end is None:
                        n.inner_end = pos
                del self.stack[i:]
                return

    def handle_data(self, data):
        top = self.stack[-1]
        if top.tag not in ("script", "style") and LETTER.search(data):
            top.direct = True


def skipped(node):
    n = node
    while n is not None and n.tag != "#root":
        if n.attrs.get("translate") == "no":
            return True
        lang = n.attrs.get("lang")
        if lang and n.tag != "html" and not lang.startswith("de"):
            return True
        n = n.parent
    return False


def units(tree):
    """(start, ende, schlüssel) aller Textblöcke."""
    out = []

    def walk(node):
        for c in node.children:
            if c.tag in ("script", "style") or skipped(c):
                continue
            if c.direct and c.tag not in ("html", "head", "body") \
                    and c.inner_end is not None:
                raw = tree.src[c.tag_end:c.inner_end]
                out.append((c.tag_end, c.inner_end, norm(raw)))
            else:
                walk(c)
    walk(tree.root)
    return out


ATTR_RE = re.compile(r'\s(alt|aria-label|title|placeholder|content)="([^"]*)"')


def attr_units(tree, spans):
    out = []
    for node in tree.tags:
        if any(a <= node.s < b for a, b, _ in spans) or skipped(node):
            continue
        tag_src = tree.src[node.s:node.tag_end]
        for m in ATTR_RE.finditer(tag_src):
            name, val = m.group(1), m.group(2)
            if name == "content" and not (node.tag == "meta" and
                                          node.attrs.get("name") == "description"):
                continue
            if LETTER.search(val):
                a = node.s + m.start(2)
                out.append((a, a + len(val), norm(val)))
    return out


# ----------------------------------------------------- Texte in JavaScript

CODE_TOKEN = re.compile(r"[a-z0-9_\-.#:\[\]=\"'/>*$^?\\()+|,]+")


def is_prose(s):
    if not LETTER.search(s) or s.strip() in ("use strict",):
        return False
    if re.fullmatch(r"\s*(<[^>]*>\s*)+", s):        # nur Tags, z. B. '</div>'
        return False
    toks = s.split()
    if not toks:
        return False
    if s != s.strip() and len(toks) == 1 and not re.search(r"[-.#\[\]=/]", s):
        return True          # Bindewort zwischen Teilen, z. B. ' und '
    if all(CODE_TOKEN.fullmatch(t) for t in toks):
        # nur Kleinbuchstaben und Code-Zeichen: Klassen, Ids, Ereignisse …
        if len(toks) == 1 or any(re.search(r"[-.#\[\]=/]", t) for t in toks):
            return False
    if re.fullmatch(r"[A-Za-z0-9_$.]+\(.*\)", s):   # Funktionsaufrufe
        return False
    return True


def js_strings(src, base=0):
    """(start, ende, quote, inhalt) aller String-Literale."""
    out, i, n = [], 0, len(src)
    prev = ""
    while i < n:
        c = src[i]
        if c in " \t\r\n":
            i += 1
            continue
        if src.startswith("//", i):
            j = src.find("\n", i)
            i = n if j < 0 else j
            continue
        if src.startswith("/*", i):
            j = src.find("*/", i + 2)
            i = n if j < 0 else j + 2
            continue
        if c in "'\"`":
            j = i + 1
            while j < n and src[j] != c:
                j += 2 if src[j] == "\\" else 1
            out.append((base + i + 1, base + j, c, src[i + 1:j]))
            i, prev = j + 1, c
            continue
        if c == "/" and (prev == "" or prev in "(,=:[!&|?{};+-*%<>~^"):
            j, cls = i + 1, False
            while j < n and src[j] != "\n":
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "[":
                    cls = True
                elif src[j] == "]":
                    cls = False
                elif src[j] == "/" and not cls:
                    break
                j += 1
            i, prev = j + 1, "/"
            continue
        prev = c
        i += 1
    return out


# In den Datendateien sind auch einzelne kleingeschriebene Wörter Text
# (Antworten wie 'leer'), außer diesen Kennungen:
DATA_CODES = {"kinder", "schule", "studium", "sequence", "count"}


def is_data_word(s):
    return bool(re.fullmatch(r"[a-zäöüß]{3,}", s)) and s not in DATA_CODES


def js_units(src, base=0, data=False):
    out = []
    for a, b, q, raw in js_strings(src, base):
        if q == "`" and "${" in raw:
            continue
        if is_prose(raw) or (data and is_data_word(raw)):
            out.append((a, b, norm(raw), q))
    return out


def js_escape(text, quote):
    return re.sub(r"(?<!\\)" + re.escape(quote), "\\" + quote, text)


# ------------------------------------------------------------ Umschreiben

WORD = re.compile(r"[A-Za-zÄÖÜäöüß]{3,}")


def wordy(key):
    """Nur Texte mit mindestens einem Wort (ab 3 Buchstaben) — Gatternamen
    wie „H“ oder „S†“ und reine Formelzeichen bleiben unberührt."""
    return bool(WORD.search(re.sub(r"<[^>]*>", "", key)))


def all_units(rel, src):
    """Liste von (start, ende, schlüssel, art) — art: html | js<quote>."""
    return [u for u in _all_units(rel, src) if wordy(u[2])]


def _all_units(rel, src):
    if rel.endswith(".js"):
        return [(a, b, k, "js" + q) for a, b, k, q in js_units(src, data=True)]
    tree = Tree(src)
    blocks = units(tree)
    us = [(a, b, k, "html") for a, b, k in blocks]
    us += [(a, b, k, "html") for a, b, k in attr_units(tree, blocks)]
    for node in tree.tags:
        if node.tag == "script" and "src" not in node.attrs \
                and node.inner_end is not None:
            body = src[node.tag_end:node.inner_end]
            us += [(a, b, k, "js" + q)
                   for a, b, k, q in js_units(body, node.tag_end)]
    return sorted(us)


def translate(rel, src, d, missing):
    parts, last = [], 0
    for a, b, key, kind in all_units(rel, src):
        if a < last:
            continue
        en = d.get(key)
        if en is None:
            missing.append(key)
            continue
        if kind.startswith("js"):
            en = js_escape(en, kind[2:])
        raw = src[a:b]          # Leerraum am Rand bleibt, z. B. 'Frage ' + n
        lead = raw[:len(raw) - len(raw.lstrip())]
        trail = raw[len(raw.rstrip()):]
        en = lead + en + trail
        parts.append(src[last:a])
        parts.append(en)
        last = b
    parts.append(src[last:])
    return "".join(parts)


def mirrored():
    return set(html_pages()) | set(DATA_FILES)


URL_RE = re.compile(r'(\s(?:href|src)=")([^"]*)(")')


def rebase(rel, text, mirror):
    """Relative Pfade einer Seite unter en/ auf die Originale umbiegen,
    außer das Ziel hat selbst eine englische Fassung."""
    src_dir = posixpath.dirname(rel)
    out_dir = posixpath.dirname(OUT + "/" + rel)

    def fix(m):
        url = m.group(2)
        if not url or re.match(r"^([a-z][a-z0-9+.-]*:|//|#)", url, re.I):
            return m.group(0)
        path, rest = re.match(r"^([^?#]*)(.*)$", url).groups()
        if not path:
            return m.group(0)
        target = posixpath.normpath(posixpath.join(src_dir, path))
        is_dir = path.endswith("/") or os.path.isdir(os.path.join(ROOT, target))
        check = posixpath.join(target, "index.html") if is_dir else target
        if check in mirror:
            return m.group(0)
        new = posixpath.relpath(target, out_dir) + ("/" if is_dir else "")
        return m.group(1) + new + rest + m.group(3)
    return URL_RE.sub(fix, text)


# ------------------------------------------------------- Sprachumschalter

LANG_BLOCK = re.compile(r"\n?<!-- lang:start -->.*?<!-- lang:end -->", re.S)
SWITCH = re.compile(r'\s*<a class="q-lang"[^>]*>[^<]*</a>')
LANGROW = re.compile(r'\s*<div class="q-wrap q-langrow"[^>]*>\s*<a class="q-lang".*?</a>\s*</div>\n?', re.S)


def lang_markup(rel, text, lang):
    """rel ist immer der deutsche Pfad; lang die Sprache dieser Fassung."""
    here = rel if lang == "de" else OUT + "/" + rel
    d = posixpath.dirname(here)
    de_url = posixpath.relpath(rel, d)
    en_url = posixpath.relpath(OUT + "/" + rel, d)
    js = posixpath.relpath("assets/lang.js", d)
    block = ('<!-- lang:start -->\n'
             '<link rel="alternate" hreflang="de" href="{}">\n'
             '<link rel="alternate" hreflang="en" href="{}">\n'
             '<script src="{}"></script>\n'
             '<!-- lang:end -->').format(de_url, en_url, js)
    text = LANG_BLOCK.sub("", text)
    text = text.replace("</head>", block + "\n</head>", 1)

    if lang == "de":
        link = ('<a class="q-lang" href="{}" hreflang="en" lang="en" '
                'translate="no" data-q-lang="en" '
                'aria-label="English version">EN</a>').format(en_url)
    else:
        link = ('<a class="q-lang" href="{}" hreflang="de" lang="de" '
                'translate="no" data-q-lang="de" '
                'aria-label="Deutsche Version">DE</a>').format(de_url)

    text = LANGROW.sub("", text)
    text = SWITCH.sub("", text)
    if 'class="q-topbar-inner"' in text:
        badge = re.search(r'<div class="q-topbar-badge">.*?</div>', text)
        title = re.search(r'<div class="q-topbar-title"[^>]*>.*?</div>', text)
        anchor = badge or title
        text = text[:anchor.end()] + "\n    " + link + text[anchor.end():]
    else:
        m = re.search(r'<main class="q-main"[^>]*>\s*(<div class="q-glow"></div>)?', text)
        if m:
            row = ('\n  <div class="q-wrap q-langrow" translate="no">' + link +
                   '</div>\n')
            text = text[:m.end()] + row + text[m.end():]
    return text


# ------------------------------------------------------------------ Bauen

def build_file(rel, mirror, missing, dry):
    src = read(rel)
    d = lookup(rel)
    miss = []
    text = translate(rel, src, d, miss)
    missing[rel] = miss
    changed = []
    if rel.endswith(".html"):
        text = re.sub(r'<html lang="[^"]*"', '<html lang="en"', text, 1)
        text = rebase(rel, text, mirror)
        text = lang_markup(rel, text, "en")
        de_new = lang_markup(rel, src, "de")
        if not dry and write(rel, de_new):
            changed.append(rel)
    if not dry and write(OUT + "/" + rel, text):
        changed.append(OUT + "/" + rel)
    return changed


def keys_missing(rel):
    src = read(rel)
    d = lookup(rel)
    seen, out = set(), []
    for a, b, key, kind in all_units(rel, src):
        if key not in d and key not in seen:
            seen.add(key)
            out.append(key)
    return out


def cmd_extract(rel):
    for i, k in enumerate(keys_missing(rel), 1):
        print("{}: {}".format(i, k))


def cmd_merge(rel, trfile, target=None):
    keys = keys_missing(rel)
    tr = {}
    for line in io.open(trfile, encoding="utf-8"):
        m = re.match(r"^(\d+):\s?(.*)$", line.rstrip("\n"))
        if m:
            tr[int(m.group(1))] = m.group(2).strip()
    path = target or dict_path(rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    add = []
    for i, k in enumerate(keys, 1):
        if i in tr and tr[i]:
            add.append("de: {}\nen: {}\n".format(k, tr[i]))
    head = "" if os.path.exists(path) else \
        "# Englische Texte für {} — siehe tools/build-en.py\n\n".format(rel)
    io.open(path, "a", encoding="utf-8", newline="\n").write(
        head + "\n".join(add) + ("\n" if add else ""))
    print("{} Übersetzungen übernommen, {} offen".format(
        len(add), len(keys) - len(add)))


def main(argv):
    if argv[:1] == ["--extract"]:
        return cmd_extract(argv[1])
    if argv[:1] == ["--merge"]:
        return cmd_merge(argv[1], argv[2], argv[3] if len(argv) > 3 else None)
    dry = argv[:1] == ["--missing"]
    mirror = mirrored()
    missing, changed = {}, []
    for rel in sorted(mirror):
        changed += build_file(rel, mirror, missing, dry)
    total = sum(len(v) for v in missing.values())
    for rel, miss in sorted(missing.items()):
        if miss:
            print("{}: {} Texte ohne Übersetzung".format(rel, len(miss)))
    if not dry:
        for c in changed:
            print("  geschrieben:", c)
        print("{} Dateien geschrieben".format(len(changed)))
    print("fehlend insgesamt: {}".format(total))
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
