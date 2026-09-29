/* ============================================================
   Quantenstation · 60 Jahre JKU
   Gemeinsame Bloch-Kugel-Mechanik für Station 2.

   Ein Qubit-Zustand wird hier als 3D-Einheitsvektor [x,y,z] auf
   der Kugel geführt (nicht als komplexer 2-Spinor) — das reicht
   für alles, was auf der Kugel sichtbar ist: Jedes Gatter ist
   eine Drehung um eine Achse um einen Winkel (Rodrigues-Formel),
   und globale Phase fällt dabei automatisch weg, weil sie den
   Punkt auf der Kugel gar nicht bewegt.

   Konventionen (siehe auch challenges-data.js):
     |0> = +Z, |1> = -Z, |+> = +X, |-> = -X, |+i> = +Y, |-i> = -Y
     Rechtshändige Drehungen; Rz(90°) dreht +X nach +Y.
   ============================================================ */
(function (global) {
  'use strict';

  var S2 = 1 / Math.SQRT2;

  // Sprache der Seite — die englischen Seiten unter en/ tragen <html lang="en">.
  var EN = /^en/i.test(document.documentElement.lang || '');
  function tr(de, en) { return EN ? en : de; }

  var GATES = {
    X:   { axis: [1, 0, 0],   angle: 180, desc: tr('X — halbe Drehung um x. Aus |0⟩ wird |1⟩.',
                                               'X — half a turn about x. |0⟩ becomes |1⟩.') },
    Y:   { axis: [0, 1, 0],   angle: 180, desc: tr('Y — halbe Drehung um y. Pole getauscht, andere Phase.',
                                               'Y — half a turn about y. Poles swapped, different phase.') },
    Z:   { axis: [0, 0, 1],   angle: 180, desc: tr('Z — halbe Drehung um z. Die Pole bleiben, die Phase kippt.',
                                               'Z — half a turn about z. The poles stay, the phase flips.') },
    H:   { axis: [S2, 0, S2], angle: 180, desc: tr('H — Hadamard. Bringt |0⟩ auf den Äquator: Superposition!',
                                               'H — Hadamard. Brings |0⟩ to the equator: superposition!') },
    S:   { axis: [0, 0, 1],   angle: 90,  desc: tr('S — Rz(90°). Vierteldrehung um z, Richtung |+i⟩.',
                                               'S — Rz(90°). Quarter turn about z, towards |+i⟩.') },
    Sdg: { axis: [0, 0, 1],   angle: -90, desc: tr('S† — Rz(−90°). Die inverse Drehung zu S, Richtung |−i⟩.',
                                               'S† — Rz(−90°). The inverse rotation of S, towards |−i⟩.') },
    T:   { axis: [0, 0, 1],   angle: 45,  desc: tr('T — Rz(45°). Die feinste übliche Phasenschraube.',
                                               'T — Rz(45°). The finest common phase screw.') },
    Tdg: { axis: [0, 0, 1],   angle: -45, desc: tr('T† — Rz(−45°). Die inverse Drehung zu T.',
                                               'T† — Rz(−45°). The inverse rotation of T.') }
  };

  var STATE_VEC = {
    '0':  [0, 0, 1],
    '1':  [0, 0, -1],
    '+':  [1, 0, 0],
    '-':  [-1, 0, 0],
    '+i': [0, 1, 0],
    '-i': [0, -1, 0]
  };

  var STATE_LABEL = {
    '0': '|0⟩', '1': '|1⟩', '+': '|+⟩', '-': '|−⟩', '+i': '|+i⟩', '-i': '|−i⟩'
  };

  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  function clean(v) {
    return v.map(function (x) { return Math.abs(x) < 1e-9 ? 0 : x; });
  }

  /* Rodrigues-Formel: Vektor v um Einheitsachse k mit Winkel a (Grad) drehen. */
  function rotate(v, k, angleDeg) {
    var a = angleDeg * Math.PI / 180;
    var c = Math.cos(a), s = Math.sin(a);
    var cross = [
      k[1] * v[2] - k[2] * v[1],
      k[2] * v[0] - k[0] * v[2],
      k[0] * v[1] - k[1] * v[0]
    ];
    var kv = dot(k, v);
    return clean([
      v[0] * c + cross[0] * s + k[0] * kv * (1 - c),
      v[1] * c + cross[1] * s + k[1] * kv * (1 - c),
      v[2] * c + cross[2] * s + k[2] * kv * (1 - c)
    ]);
  }

  /* "X" -> GATES.X ; "Rx(90deg)" / "Ry(45deg)" / "Rz(-90deg)" -> {axis, angle} */
  function resolveGate(token) {
    if (GATES[token]) return GATES[token];
    var m = /^(Rx|Ry|Rz)\((-?[\d.]+)deg\)$/.exec(token);
    if (!m) return null;
    var axis = { Rx: [1, 0, 0], Ry: [0, 1, 0], Rz: [0, 0, 1] }[m[1]];
    return { axis: axis, angle: parseFloat(m[2]) };
  }

  function applyGate(v, token) {
    var g = resolveGate(token);
    return g ? rotate(v, g.axis, g.angle) : v.slice();
  }

  function run(startKey, sequence) {
    var v = STATE_VEC[startKey].slice();
    var trace = [v.slice()];
    sequence.forEach(function (tok) {
      v = applyGate(v, tok);
      trace.push(v.slice());
    });
    return { vec: v, trace: trace };
  }

  /* theta = Polarwinkel ab +Z, phi = Azimut ab +X Richtung +Y, 0..360, null an den Polen. */
  function angles(v) {
    var z = Math.max(-1, Math.min(1, v[2]));
    var theta = Math.acos(z) * 180 / Math.PI;
    if (Math.abs(v[2]) > 0.999999) return { theta: theta, phi: null };
    var phi = Math.atan2(v[1], v[0]) * 180 / Math.PI;
    if (phi < 0) phi += 360;
    return { theta: theta, phi: phi };
  }

  function nameOf(v, eps) {
    eps = eps == null ? 1e-6 : eps;
    for (var k in STATE_VEC) {
      if (!STATE_VEC.hasOwnProperty(k)) continue;
      var s = STATE_VEC[k];
      if (Math.abs(s[0] - v[0]) < eps && Math.abs(s[1] - v[1]) < eps && Math.abs(s[2] - v[2]) < eps) return k;
    }
    return null;
  }

  function sameVec(v, w, eps) {
    eps = eps == null ? 1e-6 : eps;
    return Math.abs(v[0] - w[0]) < eps && Math.abs(v[1] - w[1]) < eps && Math.abs(v[2] - w[2]) < eps;
  }

  /* kürzester Abstand zweier Winkel auf dem Kreis, in Grad, immer 0..180 */
  function angleDiff(a, b) {
    var d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  }

  global.BlochGates = {
    GATES: GATES,
    STATE_VEC: STATE_VEC,
    STATE_LABEL: STATE_LABEL,
    rotate: rotate,
    resolveGate: resolveGate,
    applyGate: applyGate,
    run: run,
    angles: angles,
    nameOf: nameOf,
    sameVec: sameVec,
    angleDiff: angleDiff
  };
})(window);
