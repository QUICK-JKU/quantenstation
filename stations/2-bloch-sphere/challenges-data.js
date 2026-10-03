/* ============================================================
   Quantenstation · 60 Jahre JKU
   Die 20 Vor-Ort-Challenges der Bloch-Kugel-Station.

   Herkunft: von Hand mit einem Simulator gerechnet und geprüft
   (2x2-Matrizen, numpy) — jede erwartete Antwort ist dort per
   assert abgesichert. Dieselben 20 Aufgaben (inkl. Reihenfolge
   und Zahlenwerten) stehen auch in challenge-cards/data.json,
   der Quelle für die gedruckten Referenzkarten — beide Dateien
   müssen bei einer Änderung an den Aufgaben synchron gehalten
   werden. Die Prüf-Logik hier steht in teste-selbst.js und nutzt
   assets/bloch-gates.js, um Freitext-Antworten (Level 3) direkt
   zu simulieren statt nur Strings zu vergleichen.

   Konventionen: siehe meta.conventions unten — sie sind identisch
   mit denen in assets/bloch-gates.js.
   ============================================================ */

window.BLOCH_CHALLENGES = {
  meta: {
    conventions: {
      poles: '|0⟩ = +Z (Nordpol), |1⟩ = -Z (Südpol)',
      axes: '|+⟩ = +X, |−⟩ = -X, |+i⟩ = +Y, |−i⟩ = -Y',
      theta: 'Polarwinkel ab +Z, in Grad',
      phi: 'Azimut ab +X Richtung +Y, 0-360°, an den Polen bedeutungslos',
      rotations: 'rechtshändig; Rz(90°) dreht +X nach +Y',
      gates: 'X/Y/Z/H = 180°-Drehungen, S = Rz(90°), S† = Rz(-90°), T = Rz(45°), T† = Rz(-45°)',
      global_phase: 'unsichtbar auf der Kugel — spielt nie eine Rolle'
    },
    levels: { 1: 'Leicht', 2: 'Mittel', 3: 'Schwer', 4: 'Experte' }
  },

  challenges: [
    {
      id: 'L1-1', level: 1, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['X', 'H'],
      expected: { state: '-', label: '|−⟩', theta_deg: 90.0, phi_deg: 180.0, bloch: [-1.0, 0.0, 0.0] },
      trace: [[0.0, 0.0, 1.0], [0.0, 0.0, -1.0], [-1.0, 0.0, 0.0]],
      tolerance_deg: 15
    },
    {
      id: 'L1-2', level: 1, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['H', 'Z', 'H'],
      expected: { state: '1', label: '|1⟩', theta_deg: 180.0, phi_deg: null, bloch: [0.0, 0.0, -1.0] },
      trace: [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [-1.0, 0.0, 0.0], [0.0, 0.0, -1.0]],
      tolerance_deg: 15
    },
    {
      id: 'L1-3', level: 1, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['X', 'H', 'Z'],
      expected: { state: '+', label: '|+⟩', theta_deg: 90.0, phi_deg: 0.0, bloch: [1.0, 0.0, 0.0] },
      trace: [[0.0, 0.0, 1.0], [0.0, 0.0, -1.0], [-1.0, 0.0, 0.0], [1.0, 0.0, 0.0]],
      tolerance_deg: 15
    },
    {
      id: 'L1-4', level: 1, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['H', 'S'],
      expected: { state: '+i', label: '|+i⟩', theta_deg: 90.0, phi_deg: 90.0, bloch: [0.0, 1.0, 0.0] },
      trace: [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0]],
      tolerance_deg: 15
    },
    {
      id: 'L1-5', level: 1, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['H', 'S', 'H'],
      expected: { state: '-i', label: '|−i⟩', theta_deg: 90.0, phi_deg: 270.0, bloch: [0.0, -1.0, 0.0] },
      trace: [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, -1.0, 0.0]],
      tolerance_deg: 15
    },

    {
      id: 'L2-1', level: 2, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['H', 'S', 'S', 'H'],
      expected: { state: '1', label: '|1⟩', theta_deg: 180.0, phi_deg: null, bloch: [0.0, 0.0, -1.0] },
      trace: [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [-1.0, 0.0, 0.0], [0.0, 0.0, -1.0]],
      tolerance_deg: 15
    },
    {
      id: 'L2-2', level: 2, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['H', 'S', 'Z', 'H'],
      expected: { state: '+i', label: '|+i⟩', theta_deg: 90.0, phi_deg: 90.0, bloch: [0.0, 1.0, 0.0] },
      trace: [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, -1.0, 0.0], [0.0, 1.0, 0.0]],
      tolerance_deg: 15
    },
    {
      id: 'L2-3', level: 2, type: 'sequence',
      start: '1', start_label: '|1⟩', sequence: ['H', 'S', 'S', 'S', 'H'],
      expected: { state: '-i', label: '|−i⟩', theta_deg: 90.0, phi_deg: 270.0, bloch: [0.0, -1.0, 0.0] },
      trace: [[0.0, 0.0, -1.0], [-1.0, 0.0, 0.0], [0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, -1.0, 0.0]],
      tolerance_deg: 15
    },
    {
      id: 'L2-4', level: 2, type: 'sequence',
      start: '+i', start_label: '|+i⟩', sequence: ['X', 'H', 'Sdg'],
      expected: { state: '+', label: '|+⟩', theta_deg: 90.0, phi_deg: 0.0, bloch: [1.0, 0.0, 0.0] },
      trace: [[0.0, 1.0, 0.0], [0.0, -1.0, 0.0], [0.0, 1.0, 0.0], [1.0, 0.0, 0.0]],
      tolerance_deg: 15
    },
    {
      id: 'L2-5', level: 2, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['H', 'S', 'S', 'S', 'S', 'H'],
      expected: { state: '0', label: '|0⟩', theta_deg: 0.0, phi_deg: null, bloch: [0.0, 0.0, 1.0] },
      trace: [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [-1.0, 0.0, 0.0], [0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 1.0]],
      tolerance_deg: 15
    },

    {
      id: 'L3-1', level: 3, type: 'free_sequence',
      prompt: 'Verwandle |0⟩ in |1⟩ — nur mit H und S. Geht es mit möglichst wenigen Gattern?',
      start: '0', target: '1', allowed_gates: ['H', 'S'],
      optimal_length: 4, optimal_solutions: [['H', 'S', 'S', 'H']]
    },
    {
      id: 'L3-2', level: 3, type: 'fill_gap',
      prompt: 'Füll die Lücke, sodass |0⟩ am Ende bei |1⟩ landet.',
      start: '0', template: ['H', 'S', '?', 'Sdg', 'H'], target: '1',
      options: ['X', 'Y', 'Z', 'H', 'S', 'Sdg', 'T', 'Tdg'],
      valid: ['X', 'Z', 'H']
    },
    {
      id: 'L3-3', level: 3, type: 'free_sequence',
      prompt: 'Verwandle |+⟩ in |−i⟩ — nur mit S und T. Geht es mit möglichst wenigen Gattern?',
      start: '+', target: '-i', allowed_gates: ['S', 'T'],
      optimal_length: 3, optimal_solutions: [['S', 'S', 'S']]
    },
    {
      id: 'L3-4', level: 3, type: 'count',
      prompt: 'Start bei |+⟩, wende nur T an. Wie oft, bis du wieder bei |+⟩ bist? Wie oft, bis du bei |−⟩ bist?',
      start: '+', answers: { return_to_start: 8, reach_minus: 4 }
    },
    {
      id: 'L3-5', level: 3, type: 'compare_orders',
      prompt: 'Reihenfolge zählt: von |0⟩ aus einmal A, dann getrennt B. Wo landest du jeweils?',
      start: '0',
      A: {
        sequence: ['Rx(90deg)', 'Rz(90deg)', 'Ry(90deg)'], expected: '1',
        trace: [[0.0, 0.0, 1.0], [0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, -1.0]]
      },
      B: {
        sequence: ['Ry(90deg)', 'Rz(90deg)', 'Rx(90deg)'], expected: '0',
        trace: [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]
      }
    },

    {
      id: 'L4-1', level: 4, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['H', 'T'],
      expected: { state: null, label: null, theta_deg: 90.0, phi_deg: 45.0, bloch: [0.707107, 0.707107, 0.0] },
      trace: [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.707107, 0.707107, 0.0]],
      tolerance_deg: 15
    },
    {
      id: 'L4-2', level: 4, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['H', 'T', 'S'],
      expected: { state: null, label: null, theta_deg: 90.0, phi_deg: 135.0, bloch: [-0.707107, 0.707107, 0.0] },
      trace: [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.707107, 0.707107, 0.0], [-0.707107, 0.707107, 0.0]],
      tolerance_deg: 15
    },
    {
      id: 'L4-3', level: 4, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['Rx(90deg)', 'T'],
      expected: { state: null, label: null, theta_deg: 90.0, phi_deg: 315.0, bloch: [0.707107, -0.707107, 0.0] },
      trace: [[0.0, 0.0, 1.0], [0.0, -1.0, 0.0], [0.707107, -0.707107, 0.0]],
      tolerance_deg: 15
    },
    {
      id: 'L4-4', level: 4, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['Ry(45deg)', 'Rz(90deg)'],
      expected: { state: null, label: null, theta_deg: 45.0, phi_deg: 90.0, bloch: [0.0, 0.707107, 0.707107] },
      trace: [[0.0, 0.0, 1.0], [0.707107, 0.0, 0.707107], [0.0, 0.707107, 0.707107]],
      tolerance_deg: 15
    },
    {
      id: 'L4-5', level: 4, type: 'sequence',
      start: '0', start_label: '|0⟩', sequence: ['Ry(135deg)', 'T', 'T'],
      expected: { state: null, label: null, theta_deg: 135.0, phi_deg: 90.0, bloch: [0.0, 0.707107, -0.707107] },
      trace: [[0.0, 0.0, 1.0], [0.707107, 0.0, -0.707107], [0.5, 0.5, -0.707107], [0.0, 0.707107, -0.707107]],
      tolerance_deg: 15
    }
  ]
};
