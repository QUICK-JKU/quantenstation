/* ============================================================
   Minimaler QR-Code-Encoder (Byte-Modus, Version 1–10).
   Keine externen Abhängigkeiten — läuft auch offline.

   QR.make(text, ecLevel) → { size, modules }  (modules[y][x] = true/false)
   QR.svg(text, opts)     → SVG-String
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- Galois-Feld GF(256), Primitivpolynom 0x11D ---------- */
  var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11D;
    }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return EXP[LOG[a] + LOG[b]];
  }

  // Generatorpolynom für n EC-Codewörter
  function rsGenerator(n) {
    var poly = [1];
    for (var i = 0; i < n; i++) {
      var next = new Array(poly.length + 1).fill(0);
      for (var j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    var gen = rsGenerator(ecLen);
    var res = new Array(ecLen).fill(0);
    for (var i = 0; i < data.length; i++) {
      var factor = data[i] ^ res[0];
      res.shift();
      res.push(0);
      for (var j = 0; j < ecLen; j++) {
        res[j] ^= gfMul(gen[j + 1], factor);
      }
    }
    return res;
  }

  /* ---------- Tabellen (Version 1–10) ---------- */
  // Gesamtzahl der Codewörter je Version
  var TOTAL_CW = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346];

  // [EC-Codewörter je Block, Blöcke G1, Daten-CW G1, Blöcke G2, Daten-CW G2]
  var BLOCKS = {
    L: [null,
      [7,1,19,0,0], [10,1,34,0,0], [15,1,55,0,0], [20,1,80,0,0], [26,1,108,0,0],
      [18,2,68,0,0], [20,2,78,0,0], [24,2,97,0,0], [30,2,116,0,0], [18,2,68,2,69]],
    M: [null,
      [10,1,16,0,0], [16,1,28,0,0], [26,1,44,0,0], [18,2,32,0,0], [24,2,43,0,0],
      [16,4,27,0,0], [18,4,31,0,0], [22,2,38,2,39], [22,3,36,2,37], [26,4,43,1,44]],
    Q: [null,
      [13,1,13,0,0], [22,1,22,0,0], [18,2,17,0,0], [26,2,24,0,0], [18,2,15,2,16],
      [24,4,19,0,0], [18,2,14,4,15], [22,4,18,2,19], [20,4,16,4,17], [24,6,19,2,20]],
    H: [null,
      [17,1,9,0,0], [28,1,16,0,0], [22,2,13,0,0], [16,4,9,0,0], [22,2,11,2,12],
      [28,4,15,0,0], [26,4,13,1,14], [26,4,14,2,15], [24,4,12,4,13], [28,6,15,2,16]]
  };

  // Positionen der Ausrichtungsmuster
  var ALIGN = [null, [], [6,18], [6,22], [6,26], [6,30],
               [6,34], [6,22,38], [6,24,42], [6,26,46], [6,28,50]];

  var EC_BITS = { L: 1, M: 0, Q: 3, H: 2 };

  function dataCapacity(version, ec) {
    var b = BLOCKS[ec][version];
    return b[1] * b[2] + b[3] * b[4];
  }

  /* ---------- Bitstrom ---------- */
  function BitBuffer() { this.bits = []; }
  BitBuffer.prototype.put = function (value, length) {
    for (var i = length - 1; i >= 0; i--) {
      this.bits.push((value >>> i) & 1);
    }
  };

  /* ---------- BCH für Format- und Versionsinfo ---------- */
  function bchFormat(data) {
    var d = data << 10;
    for (var i = 14; i >= 10; i--) {
      if ((d >>> i) & 1) d ^= 0x537 << (i - 10);
    }
    return ((data << 10) | d) ^ 0x5412;
  }

  function bchVersion(version) {
    var d = version << 12;
    for (var i = 17; i >= 12; i--) {
      if ((d >>> i) & 1) d ^= 0x1F25 << (i - 12);
    }
    return (version << 12) | d;
  }

  /* ---------- Hauptfunktion ---------- */
  function make(text, ecLevel) {
    var ec = ecLevel || 'M';
    if (!BLOCKS[ec]) throw new Error('Unbekanntes EC-Level: ' + ec);

    // UTF-8 kodieren
    var bytes = [];
    var utf8 = unescape(encodeURIComponent(String(text)));
    for (var i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i) & 0xff);

    // Passende Version suchen
    var version = 0;
    for (var v = 1; v <= 10; v++) {
      var lenBits = v < 10 ? 8 : 16;   // Byte-Modus: 8 Bit für Version 1–9
      var need = 4 + lenBits + bytes.length * 8;
      if (need <= dataCapacity(v, ec) * 8) { version = v; break; }
    }
    if (!version) throw new Error('Text zu lang für Version 10 (' + bytes.length + ' Bytes)');

    var size = 17 + 4 * version;
    var lenBits = version < 10 ? 8 : 16;

    /* --- Datenbits zusammenbauen --- */
    var bb = new BitBuffer();
    bb.put(4, 4);                    // Modus: Byte
    bb.put(bytes.length, lenBits);
    for (var k = 0; k < bytes.length; k++) bb.put(bytes[k], 8);

    var capacityBits = dataCapacity(version, ec) * 8;
    // Terminator (bis zu 4 Nullen)
    var term = Math.min(4, capacityBits - bb.bits.length);
    bb.put(0, term);
    // Auf ganze Bytes auffüllen
    while (bb.bits.length % 8 !== 0) bb.bits.push(0);

    var dataCw = [];
    for (var b = 0; b < bb.bits.length; b += 8) {
      var byte = 0;
      for (var q = 0; q < 8; q++) byte = (byte << 1) | bb.bits[b + q];
      dataCw.push(byte);
    }
    // Mit den vorgeschriebenen Füllbytes auffüllen
    var PAD = [0xEC, 0x11], p = 0;
    while (dataCw.length < dataCapacity(version, ec)) {
      dataCw.push(PAD[p++ % 2]);
    }

    /* --- In Blöcke teilen und Fehlerkorrektur rechnen --- */
    var spec = BLOCKS[ec][version];
    var ecLen = spec[0];
    var blocks = [], pos = 0;
    for (var g = 0; g < 2; g++) {
      var count = spec[1 + g * 2], len = spec[2 + g * 2];
      for (var n = 0; n < count; n++) {
        var chunk = dataCw.slice(pos, pos + len);
        pos += len;
        blocks.push({ data: chunk, ec: rsEncode(chunk, ecLen) });
      }
    }

    /* --- Verschachteln --- */
    var final = [];
    var maxData = Math.max.apply(null, blocks.map(function (x) { return x.data.length; }));
    for (var d = 0; d < maxData; d++) {
      for (var bi = 0; bi < blocks.length; bi++) {
        if (d < blocks[bi].data.length) final.push(blocks[bi].data[d]);
      }
    }
    for (var e = 0; e < ecLen; e++) {
      for (var bj = 0; bj < blocks.length; bj++) final.push(blocks[bj].ec[e]);
    }

    /* --- Matrix vorbereiten --- */
    var modules = [], reserved = [];
    for (var y = 0; y < size; y++) {
      modules.push(new Array(size).fill(false));
      reserved.push(new Array(size).fill(false));
    }

    function setFn(x, y, val) {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      modules[y][x] = val;
      reserved[y][x] = true;
    }

    // Suchmuster + Trennlinien
    function finder(cx, cy) {
      for (var dy = -1; dy <= 7; dy++) {
        for (var dx = -1; dx <= 7; dx++) {
          var xx = cx + dx, yy = cy + dy;
          if (xx < 0 || yy < 0 || xx >= size || yy >= size) continue;
          var inRing = (dx >= 0 && dx <= 6 && (dy === 0 || dy === 6)) ||
                       (dy >= 0 && dy <= 6 && (dx === 0 || dx === 6));
          var inCore = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
          setFn(xx, yy, inRing || inCore);
        }
      }
    }
    finder(0, 0); finder(size - 7, 0); finder(0, size - 7);

    // Taktmuster
    for (var t = 8; t < size - 8; t++) {
      setFn(t, 6, t % 2 === 0);
      setFn(6, t, t % 2 === 0);
    }

    // Ausrichtungsmuster
    var ap = ALIGN[version];
    for (var ai = 0; ai < ap.length; ai++) {
      for (var aj = 0; aj < ap.length; aj++) {
        var ax = ap[ai], ay = ap[aj];
        // nicht über die Suchmuster legen
        if ((ax <= 8 && ay <= 8) ||
            (ax >= size - 9 && ay <= 8) ||
            (ax <= 8 && ay >= size - 9)) continue;
        for (var by = -2; by <= 2; by++) {
          for (var bx = -2; bx <= 2; bx++) {
            var ring = Math.max(Math.abs(bx), Math.abs(by));
            setFn(ax + bx, ay + by, ring !== 1);
          }
        }
      }
    }

    // Dunkles Modul
    setFn(8, size - 8, true);

    // Formatbereiche reservieren
    for (var f = 0; f <= 8; f++) {
      if (f !== 6) { reserved[8][f] = true; reserved[f][8] = true; }
    }
    for (var f2 = 0; f2 < 8; f2++) {
      reserved[8][size - 1 - f2] = true;
      reserved[size - 1 - f2][8] = true;
    }

    // Versionsbereiche reservieren (ab Version 7)
    if (version >= 7) {
      for (var vi = 0; vi < 6; vi++) {
        for (var vj = 0; vj < 3; vj++) {
          reserved[size - 11 + vj][vi] = true;
          reserved[vi][size - 11 + vj] = true;
        }
      }
    }

    /* --- Datenbits platzieren --- */
    var bitIndex = 0;
    var totalBits = final.length * 8;
    function nextBit() {
      if (bitIndex >= totalBits) return false;   // Restbits bleiben 0
      var bit = (final[bitIndex >> 3] >>> (7 - (bitIndex & 7))) & 1;
      bitIndex++;
      return bit === 1;
    }

    var upward = true;
    for (var col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--;                       // Taktspalte überspringen
      for (var row = 0; row < size; row++) {
        var yy2 = upward ? size - 1 - row : row;
        for (var c = 0; c < 2; c++) {
          var xx2 = col - c;
          if (reserved[yy2][xx2]) continue;
          modules[yy2][xx2] = nextBit();
        }
      }
      upward = !upward;
    }

    /* --- Maskierung wählen --- */
    function maskFn(m, x, y) {
      switch (m) {
        case 0: return (x + y) % 2 === 0;
        case 1: return y % 2 === 0;
        case 2: return x % 3 === 0;
        case 3: return (x + y) % 3 === 0;
        case 4: return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
        case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
        case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
        case 7: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
      }
    }

    function penalty(m) {
      var score = 0, x, y, run, i;

      // Regel 1: fünf oder mehr gleiche Module in Folge
      for (y = 0; y < size; y++) {
        run = 1;
        for (x = 1; x < size; x++) {
          if (m[y][x] === m[y][x - 1]) { run++; }
          else { if (run >= 5) score += 3 + (run - 5); run = 1; }
        }
        if (run >= 5) score += 3 + (run - 5);
      }
      for (x = 0; x < size; x++) {
        run = 1;
        for (y = 1; y < size; y++) {
          if (m[y][x] === m[y - 1][x]) { run++; }
          else { if (run >= 5) score += 3 + (run - 5); run = 1; }
        }
        if (run >= 5) score += 3 + (run - 5);
      }

      // Regel 2: gleichfarbige 2×2-Blöcke
      for (y = 0; y < size - 1; y++) {
        for (x = 0; x < size - 1; x++) {
          var v = m[y][x];
          if (v === m[y][x + 1] && v === m[y + 1][x] && v === m[y + 1][x + 1]) score += 3;
        }
      }

      // Regel 3: 1:1:3:1:1-Muster mit vier hellen Modulen daneben
      var P1 = [true,false,true,true,true,false,true,false,false,false,false];
      var P2 = [false,false,false,false,true,false,true,true,true,false,true];
      function matches(get, len, start, pat) {
        for (var q = 0; q < 11; q++) {
          if (start + q >= len) return false;
          if (get(start + q) !== pat[q]) return false;
        }
        return true;
      }
      for (y = 0; y < size; y++) {
        for (x = 0; x <= size - 11; x++) {
          var rowGet = (function (yy) { return function (xx) { return m[yy][xx]; }; })(y);
          if (matches(rowGet, size, x, P1)) score += 40;
          if (matches(rowGet, size, x, P2)) score += 40;
        }
      }
      for (x = 0; x < size; x++) {
        for (y = 0; y <= size - 11; y++) {
          var colGet = (function (xx) { return function (yy) { return m[yy][xx]; }; })(x);
          if (matches(colGet, size, y, P1)) score += 40;
          if (matches(colGet, size, y, P2)) score += 40;
        }
      }

      // Regel 4: Abweichung vom 50:50-Verhältnis
      var dark = 0;
      for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (m[y][x]) dark++;
      var pct = dark * 100 / (size * size);
      score += Math.floor(Math.abs(pct - 50) / 5) * 10;

      return score;
    }

    function withMask(maskNo) {
      var out = modules.map(function (r) { return r.slice(); });
      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          if (!reserved[y][x] && maskFn(maskNo, x, y)) out[y][x] = !out[y][x];
        }
      }
      // Formatinfo eintragen
      var fmt = bchFormat((EC_BITS[ec] << 3) | maskNo);
      for (var i2 = 0; i2 < 15; i2++) {
        var bit = ((fmt >>> i2) & 1) === 1;
        // Kopie 1 — senkrecht in Spalte 8 (Bits 0–7), dann waagrecht in Zeile 8 (Bits 8–14)
        if (i2 < 6)        out[i2][8] = bit;
        else if (i2 === 6) out[7][8] = bit;
        else if (i2 === 7) out[8][8] = bit;
        else if (i2 === 8) out[8][7] = bit;
        else               out[8][14 - i2] = bit;
        // Kopie 2 — waagrecht rechts (Bits 0–7), senkrecht unten (Bits 8–14)
        if (i2 < 8) out[8][size - 1 - i2] = bit;
        else        out[size - 15 + i2][8] = bit;
      }
      // Versionsinfo (ab Version 7)
      if (version >= 7) {
        var vinfo = bchVersion(version);
        for (var i3 = 0; i3 < 18; i3++) {
          var vb = ((vinfo >>> i3) & 1) === 1;
          var r3 = Math.floor(i3 / 3), c3 = i3 % 3;
          out[size - 11 + c3][r3] = vb;
          out[r3][size - 11 + c3] = vb;
        }
      }
      return out;
    }

    var best = null, bestScore = Infinity;
    for (var mk = 0; mk < 8; mk++) {
      var cand = withMask(mk);
      var sc = penalty(cand);
      if (sc < bestScore) { bestScore = sc; best = cand; }
    }

    return { size: size, version: version, ec: ec, modules: best };
  }

  /* ---------- SVG-Ausgabe ---------- */
  function svg(text, opts) {
    opts = opts || {};
    var q = make(text, opts.ec || 'M');
    var quiet = opts.quiet == null ? 4 : opts.quiet;
    var dim = q.size + quiet * 2;
    var dark = opts.dark || '#14161c';
    var light = opts.light || '#ffffff';

    var path = '';
    for (var y = 0; y < q.size; y++) {
      for (var x = 0; x < q.size; x++) {
        if (q.modules[y][x]) {
          path += 'M' + (x + quiet) + ',' + (y + quiet) + 'h1v1h-1z';
        }
      }
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dim + ' ' + dim + '" ' +
           'shape-rendering="crispEdges" role="img" aria-label="QR-Code">' +
           '<rect width="' + dim + '" height="' + dim + '" fill="' + light + '"/>' +
           '<path d="' + path + '" fill="' + dark + '"/></svg>';
  }

  global.QR = { make: make, svg: svg };
})(typeof window !== 'undefined' ? window : this);
