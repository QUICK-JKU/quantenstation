/* ============================================================
   Quantenstation · 60 Jahre JKU
   Fragenpool für die Quizze.

   Aufbau eines Quiz:
     {
       id:    'kinder-1',        // eindeutig, steckt in der URL
       level: 'kinder',          // siehe levels weiter unten
       title: 'Die Katze im Karton',
       sub:   'kurze Zeile für die Kachel',
       code:  '1207',            // vierstelliger Schlusscode
       questions: [ … ]
     }

   Aufbau einer Frage — zwei Sorten:

     Auswahl    { q:'Frage?', a:['richtig','falsch','falsch'], why:'…' }
                Die ERSTE Antwort ist immer die richtige. Der Motor
                mischt sie beim Anzeigen. Soll die Reihenfolge stehen
                bleiben (z. B. bei Zahlenreihen), dann keep:true setzen.

     Zahl       { q:'Frage?', num:0.8, tol:0.01, unit:'eV', why:'…' }
                Komma und Punkt sind beide erlaubt.

   Optional bei beiden: given:'…'  (Angabe-Block über den Antworten)
                        hint:'…'   (Text nach einem Fehlversuch)

   In q, given, why und hint ist HTML erlaubt — praktisch für
   <sub>, <sup> und Formelzeichen.
   ============================================================ */

window.QUIZPOOL = {

  levels: [
    {
      id: 'kinder',
      title: 'For children',
      short: 'Children\'s quiz',
      sub: 'from about age 8 · for marvelling, no calculating',
      icon: '🐣',
      color: 'c-green',
      note: 'Everything explained with everyday pictures. If you don\'t know, just guess — getting it wrong is no big deal here.'
    },
    {
      id: 'schule',
      title: 'For school students',
      short: 'School quiz',
      sub: 'lower and upper secondary · terms and connections',
      icon: '🎒',
      color: 'c-purple',
      note: 'Physics lessons help, but they\'re not required. Occasionally there\'s some calculating — in your head.'
    },
    {
      id: 'studium',
      title: 'For university students',
      short: 'Uni quiz',
      sub: 'bachelor level · with real calculations',
      icon: '🎓',
      color: 'c-red',
      note: 'Formalism, numerical values, units. Have a calculator or your phone\'s calculator ready.'
    }
  ],

  quizzes: [

    /* ==========================================================
       LEVEL 1 · KINDER
       ========================================================== */

    {
      id: 'kinder-1',
      level: 'kinder',
      title: 'The cat in the box',
      sub: 'Schrödinger\'s most famous idea',
      code: '1207',
      questions: [
        {
          q: 'Erwin Schrödinger came up with the cat in the box. Why?',
          a: [
            'He wanted to show how strange it sounds when you apply the rules of tiny things to big things',
            'He wanted to prove that cats can do magic',
            'He had a spare box and didn\'t know what to do with it',
            'He was looking for a name for his own cat'
          ],
          why: 'Schrödinger himself found the idea silly — that was exactly the point. He wanted to show: what holds for tiny particles sounds completely crazy for a cat.',
          hint: 'He actually thought the cat story was <strong>nonsense</strong> — and told it anyway.'
        },
        {
          q: 'As long as nobody looks into the box, quantum physics says about a tiny particle inside it:',
          a: [
            'It can have several possibilities at the same time',
            'It simply disappears',
            'It is sleeping',
            'It gets bigger'
          ],
          why: 'A particle doesn\'t have to decide before anyone looks. Experts call this <strong>superposition</strong>.'
        },
        {
          q: 'What happens at the very moment someone looks?',
          a: [
            'Exactly one result comes out',
            'All possibilities remain',
            'The particle flies away',
            'The box becomes see-through'
          ],
          why: 'When you measure, only <strong>one</strong> result ever shows up. Before, several were possible; afterwards, one is left.'
        },
        {
          q: 'Are there real cats that are asleep and awake at the same time?',
          a: [
            'No — only tiny things like atoms can do that',
            'Yes, but only black cats',
            'Yes, every cat can do it at night',
            'Yes, if the box is shut tight'
          ],
          why: 'The bigger a thing is, the faster it decides. A cat is made of unbelievably many particles — it is always clearly awake or clearly not.'
        },
        {
          q: 'What is the technical term for “several possibilities at once”?',
          a: ['Superposition', 'Supermarket', 'Superglue', 'Sun position'],
          why: '<strong>Super</strong> means “over” and <strong>position</strong> means “place” — so several places on top of each other.'
        },
        {
          q: 'When researchers do the same quantum experiment 100 times, they get:',
          a: [
            'sometimes one result, sometimes the other — but in reliable proportions',
            'exactly the same result every time',
            'a completely new, never-seen-before result every time',
            'no result at all'
          ],
          why: 'A single measurement is chance. But how often each result comes up can be calculated precisely in advance — like with dice.'
        }
      ]
    },

    {
      id: 'kinder-2',
      level: 'kinder',
      title: 'Light plays tricks',
      sub: 'Colours, rainbows and particles of light',
      code: '3418',
      questions: [
        {
          q: 'Light is made of tiny portions. What are they called?',
          a: ['Photons', 'Protons', 'Pralines', 'Pixels'],
          why: 'A <strong>photon</strong> is the smallest bit of light there is. It doesn\'t get any smaller.'
        },
        {
          q: 'Why do we see many colours in a rainbow?',
          a: [
            'Because white light is a mix of many colours and water droplets fan them out',
            'Because the sun switches the colours on one after another',
            'Because rain is colourful',
            'Because our eyes get tired'
          ],
          why: 'Sunlight looks white but is full of colours. A water droplet sorts them — like a prism.'
        },
        {
          q: 'For which colour do the portions of light carry the most energy?',
          a: ['Violet', 'Red', 'Yellow', 'All the same'],
          why: 'At the blue and violet end, each photon carries the most energy. At the red end, the least.'
        },
        {
          q: 'Why do you get tanned or sunburnt at the beach?',
          a: [
            'Because UV photons have so much energy that they change your skin',
            'Because the sun is as hot as an iron',
            'Because sand stores the heat',
            'Because salt water colours your skin'
          ],
          why: 'We can\'t see UV light, but its photons are particularly energetic. Hence sunscreen.'
        },
        {
          q: 'Can you count individual particles of light?',
          a: [
            'Yes — there are detectors that really count photon by photon',
            'No, light is indivisible, like water',
            'Only with a really good magnifying glass',
            'Only at night'
          ],
          why: 'In labs — including at JKU — sensitive detectors count single photons. That\'s how quantum experiments are done.'
        },
        {
          q: 'Light is a wave. Light is also a particle. Which is true?',
          a: [
            'Both — depending on which experiment you do',
            'Only the wave; the particle thing is a mistake',
            'Only the particle; there are no waves',
            'Neither'
          ],
          why: 'This is called <strong>wave–particle duality</strong>. Light is simply something of its own — sometimes one picture fits better, sometimes the other.'
        }
      ]
    },

    {
      id: 'kinder-3',
      level: 'kinder',
      title: 'Teeny-tiny',
      sub: 'How tiny is an atom really?',
      code: '5092',
      questions: [
        {
          q: 'Which is smaller?',
          a: ['An atom', 'A grain of sand', 'A speck of dust', 'A hair'],
          why: 'A single grain of sand holds roughly as many atoms as there are stars in many galaxies.'
        },
        {
          q: 'What is an atom made of?',
          a: [
            'Of a nucleus in the middle and electrons around it',
            'Of lots of little atoms',
            'Of air',
            'Of cells'
          ],
          why: 'The nucleus sits tiny in the middle; the electrons hang around it in a kind of cloud.'
        },
        {
          q: 'Where exactly is an electron in an atom?',
          a: [
            'That can\'t be said exactly — there is only a cloud of probabilities',
            'It stands still in a fixed spot',
            'It sits right in the nucleus',
            'It flies on a circular orbit like a planet'
          ],
          why: 'The picture with the planetary orbit is in old books, but it\'s wrong. You can only say <strong>where it is likely to be</strong>.'
        },
        {
          q: 'An atom is almost completely …',
          a: ['empty', 'made of metal', 'made of water', 'packed full'],
          why: 'If the nucleus were the size of a pea, the nearest electron would be about 100 metres away. In between: nothing.'
        },
        {
          q: 'So why doesn\'t your hand fall through the table if everything is almost empty?',
          a: [
            'Because the electrons of your hand and the table push each other away',
            'Because the table is made of wood',
            'Because gravity prevents it',
            'Because there\'s air in between'
          ],
          why: 'What feels “solid” is really a repulsion between electrons. Nothing actually touches in the true sense.'
        },
        {
          q: 'Roughly how many atoms does a human have?',
          a: [
            'More than there are grains of sand on all the beaches on Earth',
            'About a million',
            'About as many as you have hairs',
            'Exactly 60'
          ],
          why: 'Around 7 000 000 000 000 000 000 000 000 000 of them. That\'s a 7 with 27 zeros.'
        }
      ]
    },

    {
      id: 'kinder-4',
      level: 'kinder',
      title: 'Chance and dice',
      sub: 'Why nature sometimes rolls the dice',
      code: '2736',
      questions: [
        {
          q: 'You toss a coin. Before it lands, the result is …',
          a: [
            'still open — heads and tails are both possible',
            'certain to be heads right from the start',
            'always tails',
            'not there at all'
          ],
          why: 'A coin is a good picture for superposition — even though a real coin is actually just wobbling quickly.'
        },
        {
          q: 'You\'ve thrown heads five times in a row. What are the chances on the next throw?',
          a: [
            'Same as always: fifty-fifty',
            'Now it\'s sure to be tails',
            'Now it\'ll be heads again',
            'The coin is broken'
          ],
          why: 'The coin has no memory. Every throw starts from zero — and the same goes for quantum particles.'
        },
        {
          q: 'How many possible results does a normal die have?',
          a: ['6', '4', '12', 'Infinitely many'],
          keep: true,
          why: 'Six sides, six results — and each one equally likely.'
        },
        {
          q: 'What is the difference between a die and a quantum particle?',
          a: [
            'For the die, the result is already fixed while it\'s rolling; for the particle, only when it is measured',
            'There\'s no difference at all',
            'Quantum particles are colourful',
            'The die is faster'
          ],
          why: 'With perfect physics you could calculate everything about the die in advance. With a quantum particle that\'s fundamentally impossible — the randomness is real.'
        },
        {
          q: 'A random number generator made from quantum particles is especially good because …',
          a: [
            'its randomness is truly unpredictable',
            'it is especially fast',
            'it is quiet',
            'it makes colourful numbers'
          ],
          why: 'Computers only produce “make-believe” randomness from a calculation rule. Quantum randomness can\'t be recalculated — perfect for secret codes.'
        },
        {
          q: 'Can quantum physics let you see into the future?',
          a: [
            'No — you can only say how likely something is to happen',
            'Yes, but only until tomorrow',
            'Yes, with a powerful microscope',
            'Yes, but only for cats'
          ],
          why: 'Quantum physics is astonishingly precise — but it predicts probabilities, not individual events.'
        }
      ]
    },

    {
      id: 'kinder-5',
      level: 'kinder',
      title: 'The quantum computer',
      sub: 'What does it actually do?',
      code: '8153',
      questions: [
        {
          q: 'A normal computer calculates with …',
          a: ['zeros and ones', 'letters', 'colours', 'numbers from 1 to 10'],
          why: 'Every picture, every song and every message on your phone is, in the end, a long row of 0s and 1s.'
        },
        {
          q: 'A quantum computer calculates with qubits. What can a qubit do in addition?',
          a: [
            'It can be 0 and 1 at the same time',
            'It can count to 100',
            'It can talk',
            'It doesn\'t need electricity'
          ],
          why: 'That\'s superposition again — this time as a tool for computing.'
        },
        {
          q: 'Will a quantum computer replace your phone soon?',
          a: [
            'No — it is only better at very specific tasks',
            'Yes, next year',
            'Yes, it\'s faster at everything',
            'Yes, but only for games'
          ],
          why: 'For videos, chats and games, the normal computer stays clearly ahead. Quantum computers are specialists.'
        },
        {
          q: 'Why are quantum computers kept in huge cooling machines?',
          a: [
            'Because qubits are only calm enough at extreme cold',
            'So that they don\'t melt',
            'So that the researchers can eat ice cream',
            'Because otherwise they\'re too loud'
          ],
          why: 'Many qubits work at about −273 °C — colder than outer space. Even the tiniest bit of heat disturbs them.'
        },
        {
          q: 'What disturbs a qubit most?',
          a: [
            'Heat, vibrations and radiation from outside',
            'Bright light in the room',
            'Loud music',
            'Too many people in the lab'
          ],
          why: 'If a qubit gets “looked at” by its surroundings, it decides too early. This is called <strong>decoherence</strong>.'
        },
        {
          q: 'What could quantum computers one day be really useful for?',
          a: [
            'Designing new medicines and materials on the computer',
            'Playing videos faster',
            'Improving the Wi-Fi',
            'Doing homework'
          ],
          why: 'Molecules are quantum systems themselves. That\'s why a quantum computer can imitate them especially well.'
        }
      ]
    },

    {
      id: 'kinder-6',
      level: 'kinder',
      title: 'In the lab',
      sub: 'Lasers, mirrors and lots of patience',
      code: '4671',
      questions: [
        {
          q: 'What do quantum researchers work with especially often in the lab?',
          a: ['With lasers and mirrors', 'With hammer and saw', 'With paint and brush', 'With flour and sugar'],
          why: 'A laser gives very clean light. With mirrors you send it exactly where it needs to go.'
        },
        {
          q: 'Why do the experiments stand on heavy tables with air springs?',
          a: [
            'So that passing cars don\'t shake the experiment',
            'So that they are easier to push',
            'So that they look nice',
            'So that they stay warm'
          ],
          why: 'A millionth of a millimetre of wobble is enough to ruin an experiment. That\'s why the table practically floats.'
        },
        {
          q: 'An interferometer splits a beam of light and brings it back together. What do you see then?',
          a: [
            'A pattern of light and dark stripes',
            'Just a single dot',
            'Nothing at all',
            'A rainbow'
          ],
          why: 'Where the wave crests match up it gets bright; where crest meets trough, dark. A device like this is standard equipment in many quantum labs.'
        },
        {
          q: 'How long does it take until an experiment like this works?',
          a: [
            'Often weeks or months — there\'s a lot of adjusting',
            'A few minutes',
            'You just press start',
            'One afternoon'
          ],
          why: 'Most of the work is adjusting, measuring, improving. That\'s completely normal in research.'
        },
        {
          q: 'Do you need very good grades in all subjects for quantum research?',
          a: [
            'No — curiosity and perseverance count for more',
            'Yes, top marks everywhere',
            'Yes, especially in PE',
            'Yes, otherwise you\'re not allowed into the lab'
          ],
          why: 'Maths and physics help, of course. But the most important drive is the desire to find things out.'
        },
        {
          q: 'JKU has existed since 1966. How old will it be in 2026?',
          a: ['60 years', '30 years', '100 years', '16 years'],
          keep: true,
          why: '60 years of Johannes Kepler University Linz — and that\'s why we\'re here today with this station.'
        }
      ]
    },

    /* ==========================================================
       LEVEL 2 · SCHÜLER:INNEN
       ========================================================== */

    {
      id: 'schule-1',
      level: 'schule',
      title: 'Superposition & measurement',
      sub: 'The heart of the matter',
      code: '9284',
      questions: [
        {
          q: 'A qubit in the state |ψ⟩ = α|0⟩ + β|1⟩. What do α and β mean?',
          a: [
            'Amplitudes — their squared magnitudes give the measurement probabilities',
            'The two possible measurement results themselves',
            'The number of measurements',
            'The energy of the two states'
          ],
          why: 'P(0) = |α|² and P(1) = |β|², and because |α|² + |β|² = 1, exactly one result always comes out.'
        },
        {
          q: 'Why is a superposition <em>not</em> “we just don\'t know yet”?',
          a: [
            'Because superpositions can overlap and cancel out — mere ignorance can\'t do that',
            'Because superpositions last longer',
            'Because you can measure ignorance',
            'It really is the same thing'
          ],
          why: 'The difference shows up in <strong>interference</strong>. If the state were merely unknown, there would be no cancellation — you wouldn\'t see any stripes.'
        },
        {
          q: 'A qubit is in (|0⟩ + |1⟩)/√2. You measure and get 1. What does an immediate second measurement give?',
          a: [
            '1 again, with certainty',
            'Randomly 0 or 1 again',
            'Always 0',
            'That can\'t be said'
          ],
          why: 'After the measurement, the state has collapsed to |1⟩. Repeating it confirms the result — as long as nothing interferes in between.'
        },
        {
          q: 'What is decoherence?',
          a: [
            'The loss of superposition through uncontrolled interaction with the surroundings',
            'Deliberately switching off a qubit',
            'A calculation error in the software',
            'The heating up of the cryostat'
          ],
          why: 'The surroundings are constantly “measuring” along. That\'s why superpositions in large, warm objects vanish practically instantly.'
        },
        {
          q: 'A qubit is in the state 0.6|0⟩ + 0.8|1⟩. How likely is the result 1?',
          a: ['64 %', '80 %', '50 %', '20 %'],
          keep: true,
          why: 'P(1) = |0.8|² = 0.64. You square the amplitude — don\'t just take it as it is.'
        },
        {
          q: 'Does a “collapse” necessarily require a conscious observer?',
          a: [
            'No — any sufficient interaction with the surroundings will do',
            'Yes, a human has to look',
            'Yes, at least a camera',
            'Yes, but an animal will do too'
          ],
          why: 'A stubborn myth. “Measurement” means an interaction that carries information to the outside — a detector does that at night too, when nobody is in the lab.'
        }
      ]
    },

    {
      id: 'schule-2',
      level: 'schule',
      title: 'Double slit & interference',
      sub: 'The experiment that shows it all',
      code: '1365',
      questions: [
        {
          q: 'Electrons are fired one at a time at a double slit. What appears on the screen?',
          a: [
            'After many electrons, an interference pattern of stripes',
            'Two sharp lines behind the slits',
            'An evenly grey patch',
            'Nothing — single electrons don\'t interfere'
          ],
          why: 'Each electron lands as a single dot. Only the pattern of many dots shows the wave nature — every electron interferes with itself.'
        },
        {
          q: 'Now a detector that registers the path is attached to one slit. What happens to the pattern?',
          a: [
            'It disappears — two clusters remain',
            'It gets sharper',
            'It shifts to the side',
            'It stays unchanged'
          ],
          why: 'As soon as the path information is available in principle, there is no more interference. This is called <strong>complementarity</strong>.'
        },
        {
          q: 'Where on the screen are the bright stripes?',
          a: [
            'Where the path difference is a whole-number multiple of the wavelength',
            'Where the path difference is half a wavelength',
            'Always directly behind the slits',
            'Randomly distributed'
          ],
          why: 'Constructive interference at Δs = n·λ, destructive at Δs = (n + ½)·λ.'
        },
        {
          q: 'What happens to the spacing of the stripes when you move the slits further apart?',
          a: [
            'The stripes move closer together',
            'The stripes move further apart',
            'The spacing stays the same',
            'The pattern tilts by 90°'
          ],
          why: 'The spacing is Δy ≈ λ·L/d — a larger d in the denominator means a smaller spacing.'
        },
        {
          q: 'Does the double slit also work with whole molecules?',
          a: [
            'Yes, even with molecules of thousands of atoms — demonstrated in the lab',
            'No, only with light',
            'No, only with electrons',
            'Only in theory, never in practice'
          ],
          why: 'Interference has been shown with fullerenes, among others, and with considerably larger molecules. The heavier the particle, the shorter the wavelength — and the harder the experiment.'
        },
        {
          q: 'Green light (λ ≈ 500 nm) is replaced by red (λ ≈ 700 nm). The stripes …',
          a: [
            'get wider',
            'get narrower',
            'stay the same',
            'disappear'
          ],
          why: 'Δy is proportional to λ. Longer wavelength, larger stripe spacing — that\'s why red lies further out in the pattern.'
        }
      ]
    },

    {
      id: 'schule-3',
      level: 'schule',
      title: 'Photons & the photoelectric effect',
      sub: 'How quantum physics began',
      code: '7048',
      questions: [
        {
          q: 'In the photoelectric effect, light knocks electrons out of metal. What does their maximum kinetic energy depend on?',
          a: [
            'On the frequency of the light',
            'On the brightness of the light',
            'On how long it is irradiated',
            'On the colour of the metal'
          ],
          why: 'E<sub>kin</sub> = h·f − W<sub>A</sub>. More brightness brings <em>more</em> electrons, but not faster ones — that was exactly the break with classical physics.'
        },
        {
          q: 'Red light doesn\'t knock any electrons out of a metal — not even at the greatest brightness. Why?',
          a: [
            'Each individual photon has too little energy to overcome the work function',
            'Red light is completely reflected by the metal',
            'The lamp is simply too weak',
            'Red light doesn\'t consist of photons'
          ],
          why: 'An electron absorbs exactly one photon. Many photons that are too weak don\'t help — energy can\'t be collected.'
        },
        {
          q: 'How are the energy and frequency of a photon related?',
          a: ['E = h·f', 'E = m·c²', 'E = ½·m·v²', 'E = U·I·t'],
          why: 'Planck\'s constant h ≈ 6.63·10⁻³⁴ J·s is the fundamental constant of quantum physics.'
        },
        {
          q: 'Who explained the photoelectric effect in 1905 — and won the Nobel Prize for it?',
          a: ['Albert Einstein', 'Isaac Newton', 'Marie Curie', 'Niels Bohr'],
          why: 'Not for the theory of relativity, but for the photoelectric effect. The Nobel Prize came in 1921.'
        },
        {
          q: 'A photon has 2 eV of energy. A second one has double the wavelength. How much energy does it have?',
          a: ['1 eV', '4 eV', '2 eV', '0,5 eV'],
          keep: true,
          why: 'E is proportional to 1/λ. Double the wavelength means half the energy.'
        },
        {
          q: 'Why does a hotplate glow dark red first and then brighter as it gets hotter?',
          a: [
            'Because thermal radiation shifts to shorter wavelengths as the temperature rises',
            'Because the metal changes chemically',
            'Because it draws more current',
            'Because the air above it starts to burn'
          ],
          why: 'That\'s Wien\'s displacement law. Planck\'s explanation of thermal radiation in 1900 was the birth of quantum physics.'
        }
      ]
    },

    {
      id: 'schule-4',
      level: 'schule',
      title: 'Atoms & spectra',
      sub: 'Why neon tubes can only do certain colours',
      code: '2519',
      questions: [
        {
          q: 'Why can\'t an electron in an atom have just any energy?',
          a: [
            'Because only standing waves fit inside — that gives discrete energy levels',
            'Because the nucleus attracts it too strongly',
            'Because energy is generally indivisible',
            'Because it would otherwise get too hot'
          ],
          why: 'As with a guitar string, only certain patterns of vibration fit. Everything in between cancels itself out.'
        },
        {
          q: 'An electron jumps from a higher to a lower level. What happens?',
          a: [
            'A photon with exactly the energy difference is emitted',
            'Heat is released, but no light',
            'The atom gets heavier',
            'Nothing measurable'
          ],
          why: 'h·f = E<sub>high</sub> − E<sub>low</sub>. That\'s why every spectral line is the fingerprint of a particular transition.'
        },
        {
          q: 'Why can you tell from the light of a distant star what it is made of?',
          a: [
            'Because every element has its own unmistakable pattern of lines',
            'Because stars broadcast their composition like a radio message',
            'Because probes take samples',
            'Because all stars are built the same way'
          ],
          why: 'Spectroscopy — the most important method in astrophysics. Helium was first found in the Sun, not on Earth.'
        },
        {
          q: 'What is wrong with Bohr\'s atomic model with its electron orbits?',
          a: [
            'Electrons don\'t move on fixed orbits — there are only probabilities of where they are',
            'The energy levels are completely made up',
            'The nucleus isn\'t in the middle',
            'There are no electrons at all'
          ],
          why: 'The energy levels are astonishingly accurate for hydrogen. The circular orbits are still an outdated picture — the orbital is correct.'
        },
        {
          q: 'Why does a neon tube glow orange-red and a sodium vapour lamp yellow?',
          a: [
            'Because the gases have different energy levels and therefore different transitions',
            'Because the glass is coloured differently',
            'Because different voltages are applied',
            'Because the tubes get differently hot'
          ],
          why: 'The colour gives away the gas. The yellow street lamps of the past were sodium vapour — with a dominant double line at 589 nm.'
        },
        {
          q: 'What happens when a photon with exactly the right energy difference hits an atom?',
          a: [
            'It can be absorbed and lifts the electron to the higher level',
            'It always bounces off',
            'It splits into two photons',
            'It turns completely into heat'
          ],
          why: 'Absorption is the reverse of emission. If the energy doesn\'t fit, the photon usually just passes through — that\'s why glass is transparent.'
        }
      ]
    },

    {
      id: 'schule-5',
      level: 'schule',
      title: 'Qubits & gates',
      sub: 'Computing with rotations',
      code: '6837',
      questions: [
        {
          q: 'How many numbers would you need to fully describe the state of 20 qubits?',
          a: [
            'Over a million — namely 2²⁰ amplitudes',
            'Exactly 20',
            'Exactly 40',
            '400'
          ],
          why: '2²⁰ = 1 048 576 complex amplitudes. That\'s why simulating a quantum computer on classical computers becomes hopeless so quickly.'
        },
        {
          q: 'What does the Hadamard gate H do to the state |0⟩?',
          a: [
            'It creates the equal superposition (|0⟩ + |1⟩)/√2',
            'It turns it into |1⟩',
            'It leaves |0⟩ unchanged',
            'It measures the qubit'
          ],
          why: 'H is the standard tool for creating a superposition in the first place — almost every algorithm starts with it.'
        },
        {
          q: 'If you apply H twice in a row to |0⟩, you get:',
          a: [
            'exactly |0⟩ again',
            '(|0⟩ + |1⟩)/√2',
            '|1⟩',
            'a random result'
          ],
          why: 'H is its own inverse: H·H = 1. The second application cancels the superposition again through interference — tangible proof that superposition is more than ignorance.'
        },
        {
          q: 'What does the X gate do?',
          a: [
            'It swaps |0⟩ and |1⟩ — the quantum NOT',
            'It deletes the qubit',
            'It doubles the qubit',
            'It measures in the x direction'
          ],
          why: 'X is the rotation by 180° about the x-axis of the Bloch sphere.'
        },
        {
          q: 'Why must all quantum gates be reversible?',
          a: [
            'Because time evolution is unitary — no information is lost',
            'Because otherwise you\'d need too much electricity',
            'So that you can correct typos',
            'They don\'t have to be at all'
          ],
          why: 'A classical AND is not reversible: from the 0 at the output you can\'t reconstruct the input. Quantum gates are always rotations — and those can be turned back.'
        },
        {
          q: 'The CNOT gate acts on two qubits. What does it do?',
          a: [
            'It flips the second qubit exactly when the first one is 1',
            'It measures both qubits at the same time',
            'It swaps the two qubits',
            'It copies the first onto the second'
          ],
          why: 'H plus CNOT makes an entangled pair. Copying, by the way, is fundamentally impossible — that\'s the no-cloning theorem.'
        }
      ]
    },

    {
      id: 'schule-6',
      level: 'schule',
      title: 'Entanglement & myths',
      sub: 'What really works — and what doesn\'t',
      code: '3902',
      questions: [
        {
          q: 'Two qubits in the state (|00⟩ + |11⟩)/√2. You measure the first and get 0. What does the second give?',
          a: [
            '0 as well, with certainty',
            'Randomly 0 or 1',
            'Certainly 1',
            'That depends on the distance between the two'
          ],
          why: 'The results are perfectly correlated. Seen individually, however, each qubit is completely random — 50 to 50.'
        },
        {
          q: 'Can entanglement transmit messages faster than light?',
          a: [
            'No — the individual results are pure chance; without a classical channel you learn nothing',
            'Yes, that\'s the whole point',
            'Yes, but only over short distances',
            'Yes, but only once per pair'
          ],
          why: 'The most stubborn myth of all. Anyone looking only at their own side sees noise. The correlation only shows up when the lists are compared — and they have to be sent the normal way.'
        },
        {
          q: 'What did John Bell show in 1964?',
          a: [
            'That quantum mechanics and local realism differ measurably',
            'That entanglement is impossible',
            'That Einstein was right on this question',
            'That every measurement inevitably disturbs'
          ],
          why: 'Bell turned a philosophical debate into an experiment. The measurements came out in favour of quantum mechanics — Nobel Prize 2022 for Aspect, Clauser and Zeilinger.'
        },
        {
          q: 'Where does entanglement already help in practice today?',
          a: [
            'In eavesdropping-proof key exchange (quantum cryptography)',
            'In faster internet',
            'In charging batteries',
            'In weather forecasting'
          ],
          why: 'An eavesdropper inevitably disturbs the states and thereby gives themselves away. Such links have already been demonstrated between cities and even via satellite.'
        },
        {
          q: 'Is it true that quantum physics only applies to the very smallest things?',
          a: [
            'No — lasers, LEDs, transistors and MRI all rely on it',
            'Yes, it plays no role in everyday life',
            'Yes, it only applies below −270 °C',
            'Yes, only in particle accelerators'
          ],
          why: 'A considerable part of modern technology couldn\'t even be explained without quantum mechanics — and therefore couldn\'t be built.'
        },
        {
          q: 'A quantum computer tries all possibilities at once and reads off the right one. Is that true?',
          a: [
            'No — the wrong answers have to be deliberately interfered away, otherwise you only measure chance',
            'Yes, that\'s exactly how it works',
            'Yes, but only for search problems',
            'Yes, if you measure often enough'
          ],
          why: 'Superposition alone achieves nothing: measuring would give a random result. The art is <strong>interference</strong> — cancel out wrong paths, reinforce right ones.'
        }
      ]
    },

    /* ==========================================================
       LEVEL 3 · STUDIERENDE
       ========================================================== */

    {
      id: 'studium-1',
      level: 'studium',
      title: 'States & normalisation',
      sub: 'Amplitudes, phases, Hilbert space',
      code: '8426',
      questions: [
        {
          q: 'A qubit is in the state |ψ⟩ = 0.6·|0⟩ + b·|1⟩ with real b > 0. How large is b?',
          given: 'Normalisation: |α|² + |β|² = 1',
          num: 0.8, tol: 0.005,
          why: 'b² = 1 − 0.36 = 0.64, so b = 0.8. Amplitudes are not probabilities — only their squared magnitudes are.',
          hint: 'Rearrange the normalisation condition for b².'
        },
        {
          q: 'For |ψ⟩ = N·(|0⟩ + 2·|1⟩) with real N > 0: how large is N?',
          num: 0.447, tol: 0.004,
          why: 'N²·(1² + 2²) = 1, so N = 1/√5 ≈ 0.4472.',
          hint: 'First add up the squared magnitudes of the unnormalised amplitudes.'
        },
        {
          q: 'What is P(1) for this state?',
          num: 0.8, tol: 0.005,
          why: 'P(1) = |2N|² = 4/5 = 0.8. And accordingly P(0) = 1/5.'
        },
        {
          q: 'How many complex amplitudes does the state vector of a system of 10 qubits have?',
          num: 1024, tol: 0,
          why: '2¹⁰ = 1024. The Hilbert space of n qubits has dimension 2ⁿ — the reason why classical simulation becomes exponentially expensive.'
        },
        {
          q: 'What physical effect does a <em>global</em> phase e<sup>iφ</sup>·|ψ⟩ have?',
          a: [
            'None — all measurement probabilities and expectation values stay identical',
            'It swaps |0⟩ and |1⟩',
            'It destroys the normalisation',
            'It changes P(0) by the factor cos φ'
          ],
          why: 'That\'s why the state space of a qubit is the projective space ℂP¹ — the Bloch sphere — and not the full unit sphere in ℂ².'
        },
        {
          q: 'And the <em>relative</em> phase in (|0⟩ + e<sup>iφ</sup>|1⟩)/√2?',
          a: [
            'It is physically measurable — not in the z basis, but very much so in the x/y basis',
            'It is just as irrelevant as the global phase',
            'It only changes the normalisation',
            'It is only relevant for entangled states'
          ],
          why: 'φ is the azimuthal angle on the Bloch sphere. In the z basis, P(0) = P(1) = ½ always holds, but ⟨σ<sub>x</sub>⟩ = cos φ.'
        }
      ]
    },

    {
      id: 'studium-2',
      level: 'studium',
      title: 'Born rule & expectation values',
      sub: 'From amplitude to measured quantity',
      code: '1794',
      questions: [
        {
          q: 'A qubit has P(0) = 0.75 and P(1) = 0.25. What is ⟨σ<sub>z</sub>⟩?',
          given: 'σ<sub>z</sub>|0⟩ = +|0⟩, σ<sub>z</sub>|1⟩ = −|1⟩',
          num: 0.5, tol: 0.005,
          why: '⟨σ<sub>z</sub>⟩ = (+1)·0,75 + (−1)·0,25 = 0,5.',
          hint: 'Expectation value = sum of eigenvalue times the corresponding probability.'
        },
        {
          q: 'What is ⟨σ<sub>z</sub>⟩ for |+⟩ = (|0⟩ + |1⟩)/√2?',
          num: 0, tol: 0.001,
          why: 'Both results are equally likely, the contributions +1 and −1 cancel. The expectation value 0 never occurs as a single measured value.'
        },
        {
          q: 'A qubit is prepared in |0⟩ and measured in the x basis. What is P(+)?',
          num: 0.5, tol: 0.005,
          why: '|0⟩ = (|+⟩ + |−⟩)/√2, so |⟨+|0⟩|² = ½. An eigenstate of one observable means maximum uncertainty of the complementary one.'
        },
        {
          q: 'A two-level system has E<sub>0</sub> = 0 eV and E<sub>1</sub> = 4 eV. The state gives P(E<sub>0</sub>) = 0.25. What is ⟨E⟩?',
          num: 3, tol: 0.05, unit: 'eV',
          why: '⟨E⟩ = 0·0,25 + 4·0,75 = 3 eV.'
        },
        {
          q: 'The variance of an observable A in the state |ψ⟩ vanishes exactly when …',
          a: [
            '|ψ⟩ is an eigenstate of A',
            '⟨A⟩ = 0 holds',
            'A is Hermitian',
            '|ψ⟩ is normalised'
          ],
          why: 'ΔA² = ⟨A²⟩ − ⟨A⟩² = 0 means: every single measurement gives the same value. That is exactly the definition of an eigenstate.'
        },
        {
          q: 'Why must observables be Hermitian?',
          a: [
            'So that the eigenvalues are real and the eigenstates form an orthonormal basis',
            'So that they are invertible',
            'So that they commute with the Hamiltonian',
            'So that time evolution stays unitary'
          ],
          why: 'Measured values are real numbers — that forces A = A<sup>†</sup>. The unitarity of time evolution follows separately from H being Hermitian.'
        }
      ]
    },

    {
      id: 'studium-3',
      level: 'studium',
      title: 'Matter waves & uncertainty',
      sub: 'de Broglie, Heisenberg, orders of magnitude',
      code: '5361',
      questions: [
        {
          q: 'A particle has momentum p = 6.63·10⁻²⁴ kg·m/s. What is its de Broglie wavelength?',
          given: 'λ = h/p with h = 6.626·10⁻³⁴ J·s',
          num: 0.1, tol: 0.004, unit: 'nm',
          why: 'λ = 6.626·10⁻³⁴ / 6.63·10⁻²⁴ ≈ 1.0·10⁻¹⁰ m = 0.1 nm — just about the size of an atom. That\'s why electron diffraction works on crystals.',
          hint: 'Calculate in metres first, then 1 nm = 10⁻⁹ m.'
        },
        {
          q: 'An electron is localised to Δx = 1.0·10⁻¹⁰ m. What is the minimum momentum uncertainty Δp?',
          given: 'Δx·Δp ≥ ħ/2 with ħ = 1.055·10⁻³⁴ J·s · answer in units of 10⁻²⁵ kg·m/s',
          num: 5.3, tol: 0.2,
          why: 'Δp = ħ/(2Δx) = 1.055·10⁻³⁴ / (2·10⁻¹⁰) ≈ 5.3·10⁻²⁵ kg·m/s. That corresponds to a velocity uncertainty of around 580 km/s.',
          hint: 'Δp = ħ/(2·Δx) — and then split off the power of ten 10⁻²⁵.'
        },
        {
          q: 'What is the energy of a photon with λ = 620 nm?',
          given: 'Practical rule of thumb: E[eV] = 1240 / λ[nm]',
          num: 2, tol: 0.05, unit: 'eV',
          why: '1240/620 = 2.0 eV — red light. The visible range lies roughly between 1.6 eV (red) and 3.1 eV (violet).'
        },
        {
          q: 'Which wavelength belongs to a photon with 3.1 eV?',
          num: 400, tol: 6, unit: 'nm',
          why: '1240/3.1 = 400 nm — the violet edge of the visible spectrum.'
        },
        {
          q: 'Why don\'t you observe diffraction with a flying football?',
          a: [
            'Its de Broglie wavelength is about 10⁻³⁴ m — immeasurably small compared with any obstacle',
            'Because it\'s too fast',
            'Because it consists of too many atoms that disturb each other',
            'Because quantum mechanics simply doesn\'t apply to macroscopic things'
          ],
          why: 'λ = h/(m·v): with m ≈ 0.4 kg and v ≈ 20 m/s you get around 8·10⁻³⁵ m. There is no slit narrow enough.'
        },
        {
          q: 'What does the uncertainty principle <em>not</em> say?',
          a: [
            'That our measuring devices are simply still too imprecise',
            'That Δx and Δp of a state can\'t both be arbitrarily small',
            'That it follows from the non-commutativity [x̂, p̂] = iħ',
            'That it also has an analogue for energy and time'
          ],
          why: 'The uncertainty is a property of the state, not a weakness of the apparatus. Δx and Δp are spreads over many identically prepared systems.'
        }
      ]
    },

    {
      id: 'studium-4',
      level: 'studium',
      title: 'Atomic physics & spectra',
      sub: 'Hydrogen, potential well, selection rules',
      code: '9028',
      questions: [
        {
          q: 'What is the binding energy of the hydrogen electron in the state n = 2?',
          given: 'E<sub>n</sub> = −13,6 eV / n²',
          num: 3.4, tol: 0.05, unit: 'eV',
          why: 'E<sub>2</sub> = −13.6/4 = −3.4 eV; the binding energy is its absolute value.'
        },
        {
          q: 'What is the energy of the photon in the transition n = 3 → n = 2?',
          num: 1.89, tol: 0.04, unit: 'eV',
          why: 'ΔE = 13.6·(1/4 − 1/9) = 13.6·5/36 ≈ 1.89 eV. That is the H-α line of the Balmer series.',
          hint: 'ΔE = E<sub>3</sub> − E<sub>2</sub> — i.e. the difference of two negative numbers.'
        },
        {
          q: 'What is the wavelength of this line?',
          given: 'E[eV] = 1240 / λ[nm]',
          num: 656, tol: 8, unit: 'nm',
          why: '1240/1.89 ≈ 656 nm — the characteristic red in which hydrogen nebulae glow in the night sky.'
        },
        {
          q: 'What is the minimum energy needed to ionise hydrogen from the ground state?',
          num: 13.6, tol: 0.15, unit: 'eV',
          why: 'Ionisation means n = 1 → n = ∞, so 13.6 eV — the Rydberg energy.'
        },
        {
          q: 'In an infinitely deep potential well, E<sub>n</sub> ∝ n². What is E<sub>3</sub>/E<sub>1</sub>?',
          num: 9, tol: 0,
          why: 'The factor is 3² = 9. Unlike in hydrogen, the levels here move further and further apart as n grows.'
        },
        {
          q: 'Why is the ground-state energy in the potential well not zero?',
          a: [
            'Because a particle that is exactly at rest and localised would violate the uncertainty principle',
            'Because the walls give off energy',
            'Because the zero point of energy can be chosen freely',
            'Because the particle has thermal energy'
          ],
          why: 'Confinement to the width L forces Δp ≳ ħ/(2L) and thus a zero-point energy. It remains even at T = 0.'
        }
      ]
    },

    {
      id: 'studium-5',
      level: 'studium',
      title: 'Bloch sphere & gates',
      sub: 'Reading states as rotations',
      code: '4287',
      questions: [
        {
          q: 'A qubit is |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩ with θ = 60°. What is P(1)?',
          given: 'θ is the polar angle measured from the +z-axis of the Bloch sphere',
          num: 0.25, tol: 0.005,
          why: 'P(1) = sin²(30°) = 0.25. The half angle in the argument is the reason why antipodal points on the sphere are orthogonal states.',
          hint: 'Watch out for θ/2 — not θ.'
        },
        {
          q: 'Which polar angle θ gives P(0) = P(1) = 0.5?',
          num: 90, tol: 1, unit: '°',
          why: 'sin²(θ/2) = ½ at θ/2 = 45°, so θ = 90° — the equator of the Bloch sphere. That\'s where |+⟩, |−⟩ and the y eigenstates lie.'
        },
        {
          q: 'The rotation R<sub>y</sub>(120°) acts on |0⟩. What is P(1) afterwards?',
          num: 0.75, tol: 0.005,
          why: 'A rotation about the y-axis shifts θ directly: θ = 120°, so P(1) = sin²(60°) = 3/4.'
        },
        {
          q: 'What does the Z gate do to |+⟩ = (|0⟩ + |1⟩)/√2?',
          a: [
            'It turns it into |−⟩ = (|0⟩ − |1⟩)/√2',
            'It leaves |+⟩ unchanged',
            'It turns it into |1⟩',
            'It measures in the z direction'
          ],
          why: 'Z is the 180° rotation about the z-axis. On |0⟩ and |1⟩ it only acts as an (unobservable) phase, but on equator states very clearly.'
        },
        {
          q: 'Which rotation does the S gate correspond to?',
          a: [
            '90° about the z-axis',
            '180° about the z-axis',
            '90° about the x-axis',
            '45° about the y-axis'
          ],
          why: 'S = diag(1, i) is the square root of Z: S² = Z. Correspondingly, T = diag(1, e<sup>iπ/4</sup>) is the square root of S.'
        },
        {
          q: 'Why are two angles (θ, φ) enough to describe every pure single-qubit state?',
          a: [
            'Because of four real parameters, normalisation removes one and the global phase another',
            'Because complex amplitudes can always be chosen real',
            'Because a qubit only has two measurement results',
            'Because the Bloch sphere is an approximation'
          ],
          why: 'α and β are two complex numbers, i.e. 4 real degrees of freedom. 4 − 1 (normalisation) − 1 (global phase) = 2. Mixed states additionally need the radius inside the sphere.'
        }
      ]
    },

    {
      id: 'studium-6',
      level: 'studium',
      title: 'Entanglement, Bell & algorithms',
      sub: 'Correlations beyond the classical limit',
      code: '6715',
      questions: [
        {
          q: 'Two qubits are in the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2. What is P(01)?',
          num: 0, tol: 0.001,
          why: 'The amplitude of |01⟩ is exactly zero. Mixed results never occur for |Φ⁺⟩ — only 00 and 11, half the time each.'
        },
        {
          q: 'What is the purity Tr(ρ²) of the <em>reduced</em> state of a single qubit from |Φ⁺⟩?',
          given: 'ρ<sub>A</sub> = Tr<sub>B</sub>(|Φ⁺⟩⟨Φ⁺|)',
          num: 0.5, tol: 0.01,
          why: 'ρ<sub>A</sub> = ½·1, so Tr(ρ²) = ½ — the minimum value for a qubit. The subsystem is maximally mixed, the entanglement entropy is exactly 1 bit. All the information lies in the correlation alone.',
          hint: 'The reduced state is maximally mixed. For ρ = ½·1, Tr(ρ²) = 2·(½)².'
        },
        {
          q: 'What is the maximum CHSH value that quantum mechanics allows?',
          given: 'Classically (local-realistically), |S| ≤ 2',
          num: 2.828, tol: 0.035,
          why: 'The Tsirelson bound is 2√2 ≈ 2.828. Remarkably, stronger correlations would be mathematically conceivable without violating relativity — nature doesn\'t use them.',
          hint: 'The value is 2·√2.'
        },
        {
          q: 'An experimentally demonstrated Bell violation rules out:',
          a: [
            'Theories that are both local and realistic',
            'any form of determinism',
            'the existence of hidden variables at all',
            'the validity of the theory of relativity'
          ],
          why: 'What is ruled out is the <em>conjunction</em> of locality and realism. Non-local hidden variables — such as Bohmian mechanics — remain compatible with all measured data.'
        },
        {
          q: 'Grover\'s algorithm searches an unstructured database with N = 10⁶ entries. Roughly how many evaluations does it need?',
          a: [
            'about 10³',
            'about 10⁶',
            'about 5·10⁵',
            'about 20'
          ],
          keep: true,
          why: 'O(√N) ≈ π/4·√10⁶ ≈ 785. That\'s a quadratic advantage — not an exponential one. Only certain algorithms, such as Shor\'s factorisation, deliver an exponential leap.'
        },
        {
          q: 'Why doesn\'t quantum teleportation contradict the no-cloning theorem?',
          a: [
            'Because the original state is destroyed by the Bell measurement — no second copy is created',
            'Because nothing is really transmitted',
            'Because it only works with classical states',
            'Because the copy always remains imperfect'
          ],
          why: 'Teleportation is moving, not copying. And because two classical bits have to be sent along, it remains bound to the speed of light.'
        }
      ]
    }

  ]
};
