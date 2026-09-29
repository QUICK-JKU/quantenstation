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
      title: 'Für Kinder',
      short: 'Kinder-Quiz',
      sub: 'ab ca. 8 Jahren · zum Staunen, ohne Rechnen',
      icon: '🐣',
      color: 'c-green',
      note: 'Alles mit Alltagsbildern erklärt. Wer nichts weiß, rät einfach — falsch ist hier nur halb so wild.'
    },
    {
      id: 'schule',
      title: 'Für Schüler:innen',
      short: 'Schul-Quiz',
      sub: 'Unter- und Oberstufe · Begriffe und Zusammenhänge',
      icon: '🎒',
      color: 'c-purple',
      note: 'Physikunterricht hilft, ist aber keine Bedingung. Vereinzelt wird gerechnet — im Kopf.'
    },
    {
      id: 'studium',
      title: 'Für Studierende',
      short: 'Studi-Quiz',
      sub: 'Bachelor-Niveau · mit echter Rechnung',
      icon: '🎓',
      color: 'c-red',
      note: 'Formalismus, Zahlenwerte, Einheiten. Taschenrechner oder Handy-Rechner bereitlegen.'
    }
  ],

  quizzes: [

    /* ==========================================================
       LEVEL 1 · KINDER
       ========================================================== */

    {
      id: 'kinder-1',
      level: 'kinder',
      title: 'Die Katze im Karton',
      sub: 'Schrödingers berühmtester Einfall',
      code: '1207',
      questions: [
        {
          q: 'Erwin Schrödinger hat sich die Katze im Karton ausgedacht. Warum?',
          a: [
            'Er wollte zeigen, wie seltsam es klingt, wenn man die Regeln der Winzlinge auf große Dinge überträgt',
            'Er wollte beweisen, dass Katzen zaubern können',
            'Er hatte einen Karton übrig und wusste nicht, wohin damit',
            'Er suchte einen Namen für seine eigene Katze'
          ],
          why: 'Schrödinger fand die Idee selbst albern — genau das war der Punkt. Er wollte zeigen: Was für winzige Teilchen gilt, klingt bei einer Katze völlig verrückt.',
          hint: 'Er fand die Sache mit der Katze eigentlich <strong>unsinnig</strong> — und hat sie trotzdem erzählt.'
        },
        {
          q: 'Solange niemand in den Karton schaut, sagt die Quantenphysik über ein winziges Teilchen darin:',
          a: [
            'Es kann mehrere Möglichkeiten gleichzeitig haben',
            'Es verschwindet einfach',
            'Es schläft',
            'Es wird größer'
          ],
          why: 'Ein Teilchen muss sich vor dem Nachschauen nicht entscheiden. Fachleute sagen dazu <strong>Superposition</strong>.'
        },
        {
          q: 'Was passiert genau in dem Moment, in dem jemand nachschaut?',
          a: [
            'Es kommt genau ein Ergebnis heraus',
            'Alle Möglichkeiten bleiben erhalten',
            'Das Teilchen fliegt weg',
            'Der Karton wird durchsichtig'
          ],
          why: 'Beim Messen zeigt sich immer nur <strong>ein</strong> Ergebnis. Vorher waren mehrere möglich, nachher ist eines übrig.'
        },
        {
          q: 'Gibt es in echt Katzen, die gleichzeitig schlafen und wach sind?',
          a: [
            'Nein — nur winzige Dinge wie Atome können so etwas',
            'Ja, aber nur schwarze Katzen',
            'Ja, jede Katze kann das nachts',
            'Ja, wenn der Karton fest zu ist'
          ],
          why: 'Je größer ein Ding ist, desto schneller entscheidet es sich. Eine Katze besteht aus unfassbar vielen Teilchen — sie ist immer eindeutig wach oder eindeutig nicht.'
        },
        {
          q: 'Wie heißt das Fachwort für „mehrere Möglichkeiten auf einmal“?',
          a: ['Superposition', 'Supermarkt', 'Superkleber', 'Sonnenposition'],
          why: '<strong>Super</strong> heißt „über“ und <strong>Position</strong> heißt „Lage“ — also mehrere Lagen übereinander.'
        },
        {
          q: 'Wenn Forschende dasselbe Quanten-Experiment 100-mal machen, bekommen sie:',
          a: [
            'mal das eine, mal das andere Ergebnis — aber in verlässlichen Anteilen',
            'jedes Mal exakt dasselbe Ergebnis',
            'jedes Mal ein völlig neues, noch nie gesehenes Ergebnis',
            'gar kein Ergebnis'
          ],
          why: 'Die einzelne Messung ist Zufall. Aber wie oft welches Ergebnis kommt, lässt sich vorher genau ausrechnen — wie beim Würfeln.'
        }
      ]
    },

    {
      id: 'kinder-2',
      level: 'kinder',
      title: 'Licht macht Faxen',
      sub: 'Farben, Regenbogen und Lichtteilchen',
      code: '3418',
      questions: [
        {
          q: 'Licht besteht aus winzigen Portionen. Wie heißen sie?',
          a: ['Photonen', 'Protonen', 'Pralinen', 'Pixel'],
          why: 'Ein <strong>Photon</strong> ist das kleinste Stückchen Licht, das es gibt. Kleiner geht nicht.'
        },
        {
          q: 'Warum sehen wir im Regenbogen viele Farben?',
          a: [
            'Weil weißes Licht aus vielen Farben gemischt ist und Wassertropfen sie auffächern',
            'Weil die Sonne die Farben nacheinander anschaltet',
            'Weil Regen bunt ist',
            'Weil unsere Augen müde werden'
          ],
          why: 'Sonnenlicht sieht weiß aus, steckt aber voller Farben. Ein Wassertropfen sortiert sie — wie ein Prisma.'
        },
        {
          q: 'Bei welcher Farbe tragen die Lichtportionen am meisten Energie?',
          a: ['Violett', 'Rot', 'Gelb', 'Alle gleich'],
          why: 'Am blauen und violetten Ende steckt in jedem Photon am meisten Energie. Am roten Ende am wenigsten.'
        },
        {
          q: 'Warum wirst du am Strand von der Sonne braun oder rot?',
          a: [
            'Weil UV-Photonen so viel Energie haben, dass sie die Haut verändern',
            'Weil die Sonne so heiß ist wie ein Bügeleisen',
            'Weil Sand die Wärme speichert',
            'Weil Salzwasser die Haut färbt'
          ],
          why: 'UV-Licht können wir nicht sehen, aber seine Photonen sind besonders energiereich. Deshalb Sonnencreme.'
        },
        {
          q: 'Kann man einzelne Lichtteilchen zählen?',
          a: [
            'Ja — es gibt Detektoren, die wirklich Photon für Photon zählen',
            'Nein, Licht ist unteilbar wie Wasser',
            'Nur mit einer richtig guten Lupe',
            'Nur nachts'
          ],
          why: 'In Laboren — auch an der JKU — zählen empfindliche Detektoren einzelne Photonen. Damit macht man Quanten-Experimente.'
        },
        {
          q: 'Licht ist eine Welle. Licht ist auch ein Teilchen. Was stimmt?',
          a: [
            'Beides — je nachdem, welches Experiment man macht',
            'Nur die Welle, das mit den Teilchen ist ein Irrtum',
            'Nur das Teilchen, Wellen gibt es nicht',
            'Keins von beidem'
          ],
          why: 'Das nennt man <strong>Welle-Teilchen-Dualismus</strong>. Licht ist einfach etwas Eigenes — mal passt das eine Bild besser, mal das andere.'
        }
      ]
    },

    {
      id: 'kinder-3',
      level: 'kinder',
      title: 'Klitzeklein',
      sub: 'Wie winzig ist ein Atom wirklich?',
      code: '5092',
      questions: [
        {
          q: 'Was ist kleiner?',
          a: ['Ein Atom', 'Ein Sandkorn', 'Ein Staubkorn', 'Ein Haar'],
          why: 'In ein einziges Sandkorn passen ungefähr so viele Atome, wie es Sterne in vielen Galaxien gibt.'
        },
        {
          q: 'Woraus besteht ein Atom?',
          a: [
            'Aus einem Kern in der Mitte und Elektronen drumherum',
            'Aus lauter kleinen Atomen',
            'Aus Luft',
            'Aus Zellen'
          ],
          why: 'Der Kern sitzt winzig in der Mitte, die Elektronen halten sich in einer Art Wolke darum auf.'
        },
        {
          q: 'Wo genau ist ein Elektron im Atom?',
          a: [
            'Das lässt sich nicht genau sagen — es gibt nur eine Wolke aus Wahrscheinlichkeiten',
            'Es steht still an einer festen Stelle',
            'Es sitzt mitten im Kern',
            'Es fliegt auf einer Kreisbahn wie ein Planet'
          ],
          why: 'Das Bild mit der Planetenbahn steht in alten Büchern, stimmt aber nicht. Man kann nur sagen, <strong>wo es wahrscheinlich ist</strong>.'
        },
        {
          q: 'Ein Atom ist fast vollständig …',
          a: ['leer', 'aus Metall', 'aus Wasser', 'randvoll'],
          why: 'Wäre der Kern so groß wie eine Erbse, läge das nächste Elektron ungefähr 100 Meter weit weg. Dazwischen: nichts.'
        },
        {
          q: 'Warum fällt deine Hand dann nicht durch den Tisch, wenn alles fast leer ist?',
          a: [
            'Weil sich die Elektronen von Hand und Tisch gegenseitig wegdrücken',
            'Weil der Tisch aus Holz ist',
            'Weil die Schwerkraft es verhindert',
            'Weil Luft dazwischen ist'
          ],
          why: 'Was sich „fest“ anfühlt, ist in Wahrheit eine Abstoßung zwischen Elektronen. Berühren im echten Sinn tut sich da gar nichts.'
        },
        {
          q: 'Wie viele Atome hat ein Mensch ungefähr?',
          a: [
            'Mehr als es Sandkörner auf allen Stränden der Erde gibt',
            'Etwa eine Million',
            'Etwa so viele wie du Haare hast',
            'Genau 60'
          ],
          why: 'Rund 7 000 000 000 000 000 000 000 000 000 Stück. Das ist eine 7 mit 27 Nullen.'
        }
      ]
    },

    {
      id: 'kinder-4',
      level: 'kinder',
      title: 'Zufall und Würfel',
      sub: 'Warum die Natur manchmal würfelt',
      code: '2736',
      questions: [
        {
          q: 'Du wirfst eine Münze. Bevor sie landet, ist das Ergebnis …',
          a: [
            'noch offen — Kopf und Zahl sind beide möglich',
            'schon von Anfang an sicher Kopf',
            'immer Zahl',
            'gar nicht vorhanden'
          ],
          why: 'Eine Münze ist ein gutes Bild für Superposition — auch wenn eine echte Münze eigentlich nur schnell wackelt.'
        },
        {
          q: 'Du hast fünfmal hintereinander Kopf geworfen. Wie stehen die Chancen beim nächsten Wurf?',
          a: [
            'Genau wie immer: halbe-halbe',
            'Jetzt kommt sicher Zahl',
            'Jetzt kommt noch mal Kopf',
            'Die Münze ist kaputt'
          ],
          why: 'Die Münze hat kein Gedächtnis. Jeder Wurf fängt bei null an — das gilt für Quantenteilchen genauso.'
        },
        {
          q: 'Wie viele Möglichkeiten hat ein normaler Würfel?',
          a: ['6', '4', '12', 'Unendlich viele'],
          keep: true,
          why: 'Sechs Seiten, sechs Ergebnisse — und jedes gleich wahrscheinlich.'
        },
        {
          q: 'Was ist der Unterschied zwischen einem Würfel und einem Quantenteilchen?',
          a: [
            'Beim Würfel steht das Ergebnis schon während des Rollens fest, beim Teilchen erst beim Messen',
            'Es gibt gar keinen Unterschied',
            'Quantenteilchen sind bunt',
            'Der Würfel ist schneller'
          ],
          why: 'Beim Würfel könnte man mit perfekter Physik alles vorausberechnen. Beim Quantenteilchen geht das grundsätzlich nicht — der Zufall ist echt.'
        },
        {
          q: 'Ein Zufallsgenerator aus Quantenteilchen ist besonders gut, weil …',
          a: [
            'sein Zufall wirklich unvorhersehbar ist',
            'er besonders schnell ist',
            'er leise ist',
            'er bunte Zahlen macht'
          ],
          why: 'Computer erzeugen nur „so-tun-als-ob“-Zufall nach einer Rechenregel. Quantenzufall lässt sich nicht nachrechnen — perfekt für Geheimcodes.'
        },
        {
          q: 'Kann man mit Quantenphysik in die Zukunft sehen?',
          a: [
            'Nein — man kann nur sagen, wie wahrscheinlich etwas passiert',
            'Ja, aber nur bis morgen',
            'Ja, mit einem starken Mikroskop',
            'Ja, aber nur für Katzen'
          ],
          why: 'Die Quantenphysik ist erstaunlich genau — sie sagt aber Wahrscheinlichkeiten voraus, keine Einzelereignisse.'
        }
      ]
    },

    {
      id: 'kinder-5',
      level: 'kinder',
      title: 'Der Quantencomputer',
      sub: 'Was macht der eigentlich?',
      code: '8153',
      questions: [
        {
          q: 'Ein normaler Computer rechnet mit …',
          a: ['Nullen und Einsen', 'Buchstaben', 'Farben', 'Zahlen von 1 bis 10'],
          why: 'Jedes Bild, jedes Lied und jede Nachricht auf deinem Handy ist am Ende eine lange Reihe aus 0 und 1.'
        },
        {
          q: 'Ein Quantencomputer rechnet mit Qubits. Was kann ein Qubit zusätzlich?',
          a: [
            'Es kann 0 und 1 zugleich sein',
            'Es kann bis 100 zählen',
            'Es kann sprechen',
            'Es braucht keinen Strom'
          ],
          why: 'Das ist wieder Superposition — diesmal als Werkzeug zum Rechnen.'
        },
        {
          q: 'Wird ein Quantencomputer bald dein Handy ersetzen?',
          a: [
            'Nein — er ist nur bei ganz bestimmten Aufgaben besser',
            'Ja, nächstes Jahr',
            'Ja, er ist bei allem schneller',
            'Ja, aber nur für Spiele'
          ],
          why: 'Für Videos, Chats und Spiele bleibt der normale Computer klar im Vorteil. Quantencomputer sind Spezialisten.'
        },
        {
          q: 'Warum stehen Quantencomputer in riesigen Kühlgeräten?',
          a: [
            'Weil Qubits nur bei extremer Kälte ruhig genug sind',
            'Damit sie nicht schmelzen',
            'Damit die Forschenden Eis essen können',
            'Weil sie sonst zu laut sind'
          ],
          why: 'Viele Qubits arbeiten bei etwa −273 °C — kälter als im Weltall. Schon kleinste Wärme stört sie.'
        },
        {
          q: 'Was stört ein Qubit am meisten?',
          a: [
            'Wärme, Erschütterung und Strahlung von außen',
            'Helles Licht im Raum',
            'Laute Musik',
            'Zu viele Menschen im Labor'
          ],
          why: 'Wird ein Qubit von der Umgebung „angeschaut“, entscheidet es sich vorzeitig. Das nennt man <strong>Dekohärenz</strong>.'
        },
        {
          q: 'Wofür könnten Quantencomputer später einmal richtig nützlich sein?',
          a: [
            'Neue Medikamente und Materialien am Rechner entwerfen',
            'Videos schneller abspielen',
            'Das WLAN verbessern',
            'Hausaufgaben machen'
          ],
          why: 'Moleküle sind selbst Quantensysteme. Ein Quantencomputer kann sie deshalb besonders gut nachbilden.'
        }
      ]
    },

    {
      id: 'kinder-6',
      level: 'kinder',
      title: 'Im Labor',
      sub: 'Laser, Spiegel und ganz viel Geduld',
      code: '4671',
      questions: [
        {
          q: 'Womit arbeiten Quantenforschende im Labor besonders oft?',
          a: ['Mit Lasern und Spiegeln', 'Mit Hammer und Säge', 'Mit Farbe und Pinsel', 'Mit Mehl und Zucker'],
          why: 'Ein Laser liefert sehr sauberes Licht. Mit Spiegeln schickt man es genau dorthin, wo es hin soll.'
        },
        {
          q: 'Warum stehen die Experimente auf schweren Tischen mit Luftfedern?',
          a: [
            'Damit vorbeifahrende Autos das Experiment nicht verwackeln',
            'Damit man sie leichter schieben kann',
            'Damit sie hübsch aussehen',
            'Damit sie warm bleiben'
          ],
          why: 'Ein Millionstel Millimeter Wackeln reicht schon, um ein Experiment zu ruinieren. Deshalb schwebt der Tisch praktisch.'
        },
        {
          q: 'Ein Interferometer teilt einen Lichtstrahl auf und führt ihn wieder zusammen. Was sieht man dann?',
          a: [
            'Ein Streifenmuster aus hell und dunkel',
            'Nur einen einzigen Punkt',
            'Gar nichts',
            'Einen Regenbogen'
          ],
          why: 'Wo die Wellenberge zusammenpassen, wird es hell; wo Berg auf Tal trifft, dunkel. So ein Gerät gehört in vielen Quantenlaboren zur Grundausstattung.'
        },
        {
          q: 'Wie lange dauert es, bis so ein Experiment funktioniert?',
          a: [
            'Oft Wochen oder Monate — es wird sehr viel justiert',
            'Ein paar Minuten',
            'Man drückt einfach auf Start',
            'Einen Nachmittag'
          ],
          why: 'Der größte Teil der Arbeit ist Justieren, Messen, Nachbessern. Das ist ganz normal in der Forschung.'
        },
        {
          q: 'Braucht man für Quantenforschung sehr gute Noten in allen Fächern?',
          a: [
            'Nein — Neugier und Durchhaltevermögen zählen mehr',
            'Ja, überall lauter Einser',
            'Ja, vor allem in Turnen',
            'Ja, sonst darf man nicht ins Labor'
          ],
          why: 'Mathe und Physik helfen natürlich. Aber der wichtigste Antrieb ist die Lust, Dinge herauszufinden.'
        },
        {
          q: 'Die JKU gibt es seit 1966. Wie alt wird sie 2026?',
          a: ['60 Jahre', '30 Jahre', '100 Jahre', '16 Jahre'],
          keep: true,
          why: '60 Jahre Johannes Kepler Universität Linz — und dafür stehen wir heute mit dieser Station hier.'
        }
      ]
    },

    /* ==========================================================
       LEVEL 2 · SCHÜLER:INNEN
       ========================================================== */

    {
      id: 'schule-1',
      level: 'schule',
      title: 'Superposition & Messung',
      sub: 'Der Kern der Sache',
      code: '9284',
      questions: [
        {
          q: 'Ein Qubit im Zustand |ψ⟩ = α|0⟩ + β|1⟩. Was bedeuten α und β?',
          a: [
            'Amplituden — ihre Betragsquadrate geben die Messwahrscheinlichkeiten',
            'Die beiden möglichen Messergebnisse selbst',
            'Die Anzahl der Messungen',
            'Die Energie der beiden Zustände'
          ],
          why: 'Es gilt P(0) = |α|² und P(1) = |β|², und wegen |α|² + |β|² = 1 kommt immer genau ein Ergebnis heraus.'
        },
        {
          q: 'Warum ist eine Superposition <em>kein</em> „wir wissen es nur noch nicht“?',
          a: [
            'Weil sich Superpositionen überlagern und auslöschen können — bloßes Unwissen kann das nicht',
            'Weil Superpositionen länger halten',
            'Weil man Unwissen messen kann',
            'Es ist tatsächlich dasselbe'
          ],
          why: 'Der Unterschied zeigt sich in der <strong>Interferenz</strong>. Wäre der Zustand nur unbekannt, gäbe es keine Auslöschung — man sähe keine Streifen.'
        },
        {
          q: 'Ein Qubit ist in (|0⟩ + |1⟩)/√2. Du misst und bekommst 1. Was liefert eine sofortige zweite Messung?',
          a: [
            'Wieder 1, mit Sicherheit',
            'Wieder zufällig 0 oder 1',
            'Immer 0',
            'Das lässt sich nicht sagen'
          ],
          why: 'Nach der Messung ist der Zustand auf |1⟩ kollabiert. Eine Wiederholung bestätigt das Ergebnis — solange nichts dazwischenkommt.'
        },
        {
          q: 'Was ist Dekohärenz?',
          a: [
            'Der Verlust der Superposition durch unkontrollierte Wechselwirkung mit der Umgebung',
            'Das absichtliche Ausschalten eines Qubits',
            'Ein Rechenfehler in der Software',
            'Die Aufheizung des Kryostaten'
          ],
          why: 'Die Umgebung „misst“ ständig mit. Deshalb sind Superpositionen bei großen, warmen Objekten praktisch sofort verschwunden.'
        },
        {
          q: 'Ein Qubit ist im Zustand 0,6|0⟩ + 0,8|1⟩. Wie wahrscheinlich ist das Ergebnis 1?',
          a: ['64 %', '80 %', '50 %', '20 %'],
          keep: true,
          why: 'P(1) = |0,8|² = 0,64. Man quadriert die Amplitude — nicht einfach übernehmen.'
        },
        {
          q: 'Braucht es für einen „Kollaps“ zwingend einen bewussten Beobachter?',
          a: [
            'Nein — jede ausreichende Wechselwirkung mit der Umgebung genügt',
            'Ja, ein Mensch muss hinsehen',
            'Ja, mindestens eine Kamera',
            'Ja, aber ein Tier reicht auch'
          ],
          why: 'Ein hartnäckiger Mythos. „Messung“ heißt Wechselwirkung, die Information nach außen trägt — ein Detektor tut das auch nachts, wenn niemand im Labor ist.'
        }
      ]
    },

    {
      id: 'schule-2',
      level: 'schule',
      title: 'Doppelspalt & Interferenz',
      sub: 'Das Experiment, das alles zeigt',
      code: '1365',
      questions: [
        {
          q: 'Elektronen werden einzeln nacheinander auf einen Doppelspalt geschossen. Was entsteht auf dem Schirm?',
          a: [
            'Nach vielen Elektronen ein Interferenzmuster aus Streifen',
            'Zwei scharfe Striche hinter den Spalten',
            'Ein gleichmäßig grauer Fleck',
            'Gar nichts — einzelne Elektronen interferieren nicht'
          ],
          why: 'Jedes Elektron landet als einzelner Punkt. Erst das Muster aus vielen Punkten zeigt die Wellennatur — jedes Elektron interferiert mit sich selbst.'
        },
        {
          q: 'Nun wird an einem Spalt ein Detektor angebracht, der den Weg registriert. Was passiert mit dem Muster?',
          a: [
            'Es verschwindet — übrig bleiben zwei Häufungen',
            'Es wird schärfer',
            'Es verschiebt sich zur Seite',
            'Es bleibt unverändert'
          ],
          why: 'Sobald die Weg-Information prinzipiell verfügbar ist, gibt es keine Interferenz mehr. Das nennt man <strong>Komplementarität</strong>.'
        },
        {
          q: 'Wo auf dem Schirm liegen die hellen Streifen?',
          a: [
            'Dort, wo der Gangunterschied ein ganzzahliges Vielfaches der Wellenlänge ist',
            'Dort, wo der Gangunterschied eine halbe Wellenlänge beträgt',
            'Immer genau hinter den Spalten',
            'Zufällig verteilt'
          ],
          why: 'Konstruktive Interferenz bei Δs = n·λ, destruktive bei Δs = (n + ½)·λ.'
        },
        {
          q: 'Was passiert mit dem Streifenabstand, wenn man die Spalte weiter auseinanderschiebt?',
          a: [
            'Die Streifen rücken enger zusammen',
            'Die Streifen rücken weiter auseinander',
            'Der Abstand bleibt gleich',
            'Das Muster kippt um 90°'
          ],
          why: 'Der Abstand ist Δy ≈ λ·L/d — größeres d im Nenner bedeutet kleineren Abstand.'
        },
        {
          q: 'Funktioniert der Doppelspalt auch mit ganzen Molekülen?',
          a: [
            'Ja, sogar mit Molekülen aus tausenden Atomen — im Labor nachgewiesen',
            'Nein, nur mit Licht',
            'Nein, nur mit Elektronen',
            'Nur theoretisch, praktisch noch nie'
          ],
          why: 'Interferenz wurde unter anderem mit Fullerenen und noch deutlich größeren Molekülen gezeigt. Je schwerer das Teilchen, desto kürzer die Wellenlänge — und desto schwieriger das Experiment.'
        },
        {
          q: 'Grünes Licht (λ ≈ 500 nm) wird durch rotes ersetzt (λ ≈ 700 nm). Die Streifen …',
          a: [
            'werden breiter',
            'werden schmäler',
            'bleiben gleich',
            'verschwinden'
          ],
          why: 'Δy ist proportional zu λ. Längere Wellenlänge, größerer Streifenabstand — deshalb liegt Rot im Muster weiter außen.'
        }
      ]
    },

    {
      id: 'schule-3',
      level: 'schule',
      title: 'Photonen & Photoeffekt',
      sub: 'Wie die Quantenphysik angefangen hat',
      code: '7048',
      questions: [
        {
          q: 'Beim Photoeffekt löst Licht Elektronen aus Metall. Wovon hängt ihre maximale kinetische Energie ab?',
          a: [
            'Von der Frequenz des Lichts',
            'Von der Helligkeit des Lichts',
            'Von der Dauer der Bestrahlung',
            'Von der Farbe des Metalls'
          ],
          why: 'E<sub>kin</sub> = h·f − W<sub>A</sub>. Mehr Helligkeit bringt <em>mehr</em> Elektronen, aber keine schnelleren — genau das war der Bruch mit der klassischen Physik.'
        },
        {
          q: 'Rotes Licht löst bei einem Metall keine Elektronen aus — auch bei größter Helligkeit nicht. Warum?',
          a: [
            'Jedes einzelne Photon hat zu wenig Energie, um die Austrittsarbeit zu überwinden',
            'Rotes Licht wird vom Metall vollständig reflektiert',
            'Die Lampe ist einfach zu schwach',
            'Rotes Licht besteht nicht aus Photonen'
          ],
          why: 'Ein Elektron nimmt genau ein Photon auf. Viele zu schwache Photonen helfen nicht — Energie sammeln geht nicht.'
        },
        {
          q: 'Wie hängen Energie und Frequenz eines Photons zusammen?',
          a: ['E = h·f', 'E = m·c²', 'E = ½·m·v²', 'E = U·I·t'],
          why: 'Das Plancksche Wirkungsquantum h ≈ 6,63·10⁻³⁴ J·s ist die Naturkonstante der Quantenphysik.'
        },
        {
          q: 'Wer erklärte den Photoeffekt 1905 — und bekam dafür den Nobelpreis?',
          a: ['Albert Einstein', 'Isaac Newton', 'Marie Curie', 'Niels Bohr'],
          why: 'Nicht für die Relativitätstheorie, sondern für den Photoeffekt. Der Nobelpreis kam 1921.'
        },
        {
          q: 'Ein Photon hat 2 eV Energie. Ein zweites hat die doppelte Wellenlänge. Wie viel Energie hat es?',
          a: ['1 eV', '4 eV', '2 eV', '0,5 eV'],
          keep: true,
          why: 'E ist proportional zu 1/λ. Doppelte Wellenlänge bedeutet halbe Energie.'
        },
        {
          q: 'Warum leuchtet eine Herdplatte erst dunkelrot und dann heller, wenn sie heißer wird?',
          a: [
            'Weil sich die Wärmestrahlung mit steigender Temperatur zu kürzeren Wellenlängen verschiebt',
            'Weil sich das Metall chemisch verändert',
            'Weil sie mehr Strom zieht',
            'Weil die Luft darüber zu brennen beginnt'
          ],
          why: 'Das ist das Wiensche Verschiebungsgesetz. Plancks Erklärung der Wärmestrahlung war 1900 die Geburtsstunde der Quantenphysik.'
        }
      ]
    },

    {
      id: 'schule-4',
      level: 'schule',
      title: 'Atome & Spektren',
      sub: 'Warum Neonröhren nur bestimmte Farben können',
      code: '2519',
      questions: [
        {
          q: 'Warum kann ein Elektron im Atom nicht jede beliebige Energie haben?',
          a: [
            'Weil nur stehende Wellen hineinpassen — das ergibt diskrete Energieniveaus',
            'Weil der Kern es zu fest anzieht',
            'Weil Energie generell nicht teilbar ist',
            'Weil es sonst zu heiß würde'
          ],
          why: 'Wie bei einer Gitarrensaite passen nur bestimmte Schwingungsmuster hinein. Alles dazwischen löscht sich selbst aus.'
        },
        {
          q: 'Ein Elektron springt von einem höheren auf ein tieferes Niveau. Was passiert?',
          a: [
            'Es wird ein Photon mit genau der Energiedifferenz abgestrahlt',
            'Es wird Wärme frei, aber kein Licht',
            'Das Atom wird schwerer',
            'Nichts Messbares'
          ],
          why: 'h·f = E<sub>hoch</sub> − E<sub>tief</sub>. Deshalb ist jede Spektrallinie der Fingerabdruck eines bestimmten Übergangs.'
        },
        {
          q: 'Warum kann man aus dem Licht eines fernen Sterns ablesen, woraus er besteht?',
          a: [
            'Weil jedes Element ein eigenes, unverwechselbares Linienmuster hat',
            'Weil Sterne ihre Zusammensetzung abstrahlen wie ein Funkspruch',
            'Weil Sonden Proben nehmen',
            'Weil alle Sterne gleich aufgebaut sind'
          ],
          why: 'Spektroskopie — die wichtigste Methode der Astrophysik. Helium wurde zuerst in der Sonne gefunden, nicht auf der Erde.'
        },
        {
          q: 'Was ist an Bohrs Atommodell mit den Elektronenbahnen falsch?',
          a: [
            'Elektronen bewegen sich nicht auf festen Bahnen — es gibt nur Aufenthaltswahrscheinlichkeiten',
            'Die Energieniveaus sind frei erfunden',
            'Der Kern sitzt nicht in der Mitte',
            'Es gibt gar keine Elektronen'
          ],
          why: 'Die Energieniveaus stimmen für Wasserstoff erstaunlich gut. Die Kreisbahnen sind trotzdem ein überholtes Bild — richtig ist das Orbital.'
        },
        {
          q: 'Warum leuchtet eine Neonröhre orange-rot und eine Natriumdampflampe gelb?',
          a: [
            'Weil die Gase unterschiedliche Energieniveaus und damit unterschiedliche Übergänge haben',
            'Weil das Glas unterschiedlich gefärbt ist',
            'Weil unterschiedliche Spannungen anliegen',
            'Weil die Röhren verschieden heiß werden'
          ],
          why: 'Die Farbe verrät das Gas. Die gelben Straßenlampen früher waren Natriumdampf — mit einer dominanten Doppellinie bei 589 nm.'
        },
        {
          q: 'Was passiert, wenn ein Photon mit genau der passenden Energiedifferenz auf ein Atom trifft?',
          a: [
            'Es kann absorbiert werden und hebt das Elektron auf das höhere Niveau',
            'Es prallt immer ab',
            'Es zerteilt sich in zwei Photonen',
            'Es wird vollständig zu Wärme'
          ],
          why: 'Absorption ist der umgekehrte Vorgang zur Emission. Passt die Energie nicht, geht das Photon meist einfach durch — deshalb ist Glas durchsichtig.'
        }
      ]
    },

    {
      id: 'schule-5',
      level: 'schule',
      title: 'Qubits & Gatter',
      sub: 'Rechnen mit Drehungen',
      code: '6837',
      questions: [
        {
          q: 'Wie viele Zahlen bräuchte man, um den Zustand von 20 Qubits vollständig zu beschreiben?',
          a: [
            'Über eine Million — nämlich 2²⁰ Amplituden',
            'Genau 20',
            'Genau 40',
            '400'
          ],
          why: '2²⁰ = 1 048 576 komplexe Amplituden. Deshalb wird die Simulation eines Quantencomputers auf klassischen Rechnern so schnell aussichtslos.'
        },
        {
          q: 'Was macht das Hadamard-Gatter H mit dem Zustand |0⟩?',
          a: [
            'Es erzeugt die Gleichverteilung (|0⟩ + |1⟩)/√2',
            'Es macht daraus |1⟩',
            'Es lässt |0⟩ unverändert',
            'Es misst das Qubit'
          ],
          why: 'H ist das Standardwerkzeug, um überhaupt erst eine Superposition herzustellen — fast jeder Algorithmus beginnt damit.'
        },
        {
          q: 'Wendet man H zweimal hintereinander auf |0⟩ an, erhält man:',
          a: [
            'wieder exakt |0⟩',
            '(|0⟩ + |1⟩)/√2',
            '|1⟩',
            'ein zufälliges Ergebnis'
          ],
          why: 'H ist zu sich selbst invers: H·H = 1. Die zweite Anwendung löscht die Superposition durch Interferenz wieder aus — ein handfester Beleg, dass Superposition mehr ist als Unwissen.'
        },
        {
          q: 'Was tut das X-Gatter?',
          a: [
            'Es vertauscht |0⟩ und |1⟩ — das Quanten-NOT',
            'Es löscht das Qubit',
            'Es verdoppelt das Qubit',
            'Es misst in x-Richtung'
          ],
          why: 'X ist die Drehung um 180° um die x-Achse der Bloch-Kugel.'
        },
        {
          q: 'Warum müssen alle Quantengatter umkehrbar sein?',
          a: [
            'Weil die Zeitentwicklung unitär ist — Information geht dabei nicht verloren',
            'Weil man sonst zu viel Strom braucht',
            'Damit man Tippfehler korrigieren kann',
            'Das müssen sie gar nicht'
          ],
          why: 'Ein klassisches AND ist nicht umkehrbar: Aus der 0 am Ausgang lässt sich der Eingang nicht rekonstruieren. Quantengatter sind immer Drehungen — und die kann man zurückdrehen.'
        },
        {
          q: 'Das CNOT-Gatter wirkt auf zwei Qubits. Was macht es?',
          a: [
            'Es kippt das zweite Qubit genau dann, wenn das erste 1 ist',
            'Es misst beide Qubits gleichzeitig',
            'Es vertauscht die beiden Qubits',
            'Es kopiert das erste auf das zweite'
          ],
          why: 'Aus H plus CNOT baut man ein verschränktes Paar. Kopieren geht übrigens grundsätzlich nicht — das ist das No-Cloning-Theorem.'
        }
      ]
    },

    {
      id: 'schule-6',
      level: 'schule',
      title: 'Verschränkung & Mythen',
      sub: 'Was geht wirklich — und was nicht',
      code: '3902',
      questions: [
        {
          q: 'Zwei Qubits im Zustand (|00⟩ + |11⟩)/√2. Du misst das erste und bekommst 0. Was liefert das zweite?',
          a: [
            'Ebenfalls 0, mit Sicherheit',
            'Zufällig 0 oder 1',
            'Sicher 1',
            'Das hängt vom Abstand der beiden ab'
          ],
          why: 'Die Ergebnisse sind perfekt korreliert. Einzeln betrachtet ist jedes Qubit aber völlig zufällig — 50 zu 50.'
        },
        {
          q: 'Kann man mit Verschränkung Nachrichten schneller als Licht übertragen?',
          a: [
            'Nein — die Einzelergebnisse sind reiner Zufall, ohne klassischen Kanal erfährt man nichts',
            'Ja, das ist gerade der Sinn der Sache',
            'Ja, aber nur über kurze Strecken',
            'Ja, allerdings nur einmal pro Paar'
          ],
          why: 'Der hartnäckigste Mythos überhaupt. Wer nur seine eigene Seite ansieht, sieht Rauschen. Die Korrelation zeigt sich erst beim Vergleich der Listen — und die müssen ganz normal verschickt werden.'
        },
        {
          q: 'Was hat John Bell 1964 gezeigt?',
          a: [
            'Dass sich Quantenmechanik und lokaler Realismus messbar unterscheiden',
            'Dass Verschränkung unmöglich ist',
            'Dass Einstein in dieser Frage recht hatte',
            'Dass jede Messung zwangsläufig stört'
          ],
          why: 'Bell verwandelte eine philosophische Debatte in ein Experiment. Die Messungen fielen zugunsten der Quantenmechanik aus — Nobelpreis 2022 für Aspect, Clauser und Zeilinger.'
        },
        {
          q: 'Wobei hilft Verschränkung in der Praxis heute schon?',
          a: [
            'Beim abhörsicheren Schlüsselaustausch (Quantenkryptografie)',
            'Beim schnelleren Internet',
            'Beim Laden von Akkus',
            'Bei der Wettervorhersage'
          ],
          why: 'Ein Lauscher stört die Zustände zwangsläufig und verrät sich dadurch. Solche Strecken sind zwischen Städten und sogar per Satellit bereits demonstriert.'
        },
        {
          q: 'Stimmt es, dass Quantenphysik nur für die allerkleinsten Dinge gilt?',
          a: [
            'Nein — Laser, LEDs, Transistoren und MRT beruhen alle darauf',
            'Ja, im Alltag spielt sie keine Rolle',
            'Ja, sie gilt erst unterhalb von −270 °C',
            'Ja, nur in Teilchenbeschleunigern'
          ],
          why: 'Ein erheblicher Teil moderner Technik wäre ohne Quantenmechanik überhaupt nicht erklärbar — und damit auch nicht baubar.'
        },
        {
          q: 'Ein Quantencomputer probiert alle Möglichkeiten gleichzeitig durch und liest die richtige ab. Stimmt das?',
          a: [
            'Nein — die falschen Antworten müssen gezielt weginterferiert werden, sonst misst man nur Zufall',
            'Ja, genau so funktioniert er',
            'Ja, aber nur bei Suchproblemen',
            'Ja, wenn man oft genug misst'
          ],
          why: 'Die Superposition allein bringt nichts: Beim Messen käme ein zufälliges Ergebnis heraus. Die Kunst ist die <strong>Interferenz</strong> — falsche Pfade auslöschen, richtige verstärken.'
        }
      ]
    },

    /* ==========================================================
       LEVEL 3 · STUDIERENDE
       ========================================================== */

    {
      id: 'studium-1',
      level: 'studium',
      title: 'Zustände & Normierung',
      sub: 'Amplituden, Phasen, Hilbertraum',
      code: '8426',
      questions: [
        {
          q: 'Ein Qubit ist im Zustand |ψ⟩ = 0,6·|0⟩ + b·|1⟩ mit reellem b > 0. Wie groß ist b?',
          given: 'Normierung: |α|² + |β|² = 1',
          num: 0.8, tol: 0.005,
          why: 'b² = 1 − 0,36 = 0,64, also b = 0,8. Amplituden sind keine Wahrscheinlichkeiten — erst ihre Betragsquadrate.',
          hint: 'Stell die Normierungsbedingung nach b² um.'
        },
        {
          q: 'Für |ψ⟩ = N·(|0⟩ + 2·|1⟩) mit reellem N > 0: Wie groß ist N?',
          num: 0.447, tol: 0.004,
          why: 'N²·(1² + 2²) = 1, also N = 1/√5 ≈ 0,4472.',
          hint: 'Summiere erst die Betragsquadrate der unnormierten Amplituden.'
        },
        {
          q: 'Wie groß ist für diesen Zustand P(1)?',
          num: 0.8, tol: 0.005,
          why: 'P(1) = |2N|² = 4/5 = 0,8. Und passend dazu P(0) = 1/5.'
        },
        {
          q: 'Wie viele komplexe Amplituden hat der Zustandsvektor eines Systems aus 10 Qubits?',
          num: 1024, tol: 0,
          why: '2¹⁰ = 1024. Der Hilbertraum von n Qubits hat Dimension 2ⁿ — der Grund, warum klassische Simulation exponentiell teuer wird.'
        },
        {
          q: 'Welchen physikalischen Effekt hat eine <em>globale</em> Phase e<sup>iφ</sup>·|ψ⟩?',
          a: [
            'Keinen — alle Messwahrscheinlichkeiten und Erwartungswerte bleiben identisch',
            'Sie vertauscht |0⟩ und |1⟩',
            'Sie zerstört die Normierung',
            'Sie verändert P(0) um den Faktor cos φ'
          ],
          why: 'Deshalb ist der Zustandsraum eines Qubits der projektive Raum ℂP¹ — die Bloch-Kugel — und nicht die volle Einheitssphäre in ℂ².'
        },
        {
          q: 'Und die <em>relative</em> Phase in (|0⟩ + e<sup>iφ</sup>|1⟩)/√2?',
          a: [
            'Sie ist physikalisch messbar — in der z-Basis nicht, in der x/y-Basis sehr wohl',
            'Sie ist genauso irrelevant wie die globale Phase',
            'Sie ändert nur die Normierung',
            'Sie ist nur bei verschränkten Zuständen relevant'
          ],
          why: 'φ ist der Azimutwinkel auf der Bloch-Kugel. In der z-Basis gilt zwar immer P(0) = P(1) = ½, aber ⟨σ<sub>x</sub>⟩ = cos φ.'
        }
      ]
    },

    {
      id: 'studium-2',
      level: 'studium',
      title: 'Born-Regel & Erwartungswerte',
      sub: 'Von der Amplitude zur Messgröße',
      code: '1794',
      questions: [
        {
          q: 'Ein Qubit hat P(0) = 0,75 und P(1) = 0,25. Wie groß ist ⟨σ<sub>z</sub>⟩?',
          given: 'σ<sub>z</sub>|0⟩ = +|0⟩, σ<sub>z</sub>|1⟩ = −|1⟩',
          num: 0.5, tol: 0.005,
          why: '⟨σ<sub>z</sub>⟩ = (+1)·0,75 + (−1)·0,25 = 0,5.',
          hint: 'Erwartungswert = Summe aus Eigenwert mal zugehöriger Wahrscheinlichkeit.'
        },
        {
          q: 'Wie groß ist ⟨σ<sub>z</sub>⟩ für |+⟩ = (|0⟩ + |1⟩)/√2?',
          num: 0, tol: 0.001,
          why: 'Beide Ergebnisse sind gleich wahrscheinlich, die Beiträge +1 und −1 heben sich auf. Der Erwartungswert 0 kommt dabei als Einzelmesswert nie vor.'
        },
        {
          q: 'Ein Qubit ist präpariert in |0⟩ und wird in der x-Basis gemessen. Wie groß ist P(+)?',
          num: 0.5, tol: 0.005,
          why: '|0⟩ = (|+⟩ + |−⟩)/√2, also |⟨+|0⟩|² = ½. Eigenzustand der einen Observablen heißt maximale Unbestimmtheit der komplementären.'
        },
        {
          q: 'Ein Zweiniveausystem hat E<sub>0</sub> = 0 eV und E<sub>1</sub> = 4 eV. Der Zustand liefert P(E<sub>0</sub>) = 0,25. Wie groß ist ⟨E⟩?',
          num: 3, tol: 0.05, unit: 'eV',
          why: '⟨E⟩ = 0·0,25 + 4·0,75 = 3 eV.'
        },
        {
          q: 'Die Varianz einer Observablen A im Zustand |ψ⟩ verschwindet genau dann, wenn …',
          a: [
            '|ψ⟩ ein Eigenzustand von A ist',
            '⟨A⟩ = 0 gilt',
            'A hermitesch ist',
            '|ψ⟩ normiert ist'
          ],
          why: 'ΔA² = ⟨A²⟩ − ⟨A⟩² = 0 bedeutet: jede Einzelmessung liefert denselben Wert. Genau das ist die Definition eines Eigenzustands.'
        },
        {
          q: 'Warum müssen Observablen hermitesch sein?',
          a: [
            'Damit die Eigenwerte reell sind und die Eigenzustände eine Orthonormalbasis bilden',
            'Damit sie invertierbar sind',
            'Damit sie mit dem Hamiltonoperator kommutieren',
            'Damit die Zeitentwicklung unitär bleibt'
          ],
          why: 'Messwerte sind reelle Zahlen — das erzwingt A = A<sup>†</sup>. Die Unitarität der Zeitentwicklung folgt separat daraus, dass H hermitesch ist.'
        }
      ]
    },

    {
      id: 'studium-3',
      level: 'studium',
      title: 'Materiewellen & Unschärfe',
      sub: 'de Broglie, Heisenberg, Größenordnungen',
      code: '5361',
      questions: [
        {
          q: 'Ein Teilchen hat den Impuls p = 6,63·10⁻²⁴ kg·m/s. Wie groß ist seine de-Broglie-Wellenlänge?',
          given: 'λ = h/p mit h = 6,626·10⁻³⁴ J·s',
          num: 0.1, tol: 0.004, unit: 'nm',
          why: 'λ = 6,626·10⁻³⁴ / 6,63·10⁻²⁴ ≈ 1,0·10⁻¹⁰ m = 0,1 nm — also gerade Atomgröße. Deshalb funktioniert Elektronenbeugung an Kristallen.',
          hint: 'Rechne zuerst in Metern, dann 1 nm = 10⁻⁹ m.'
        },
        {
          q: 'Ein Elektron ist auf Δx = 1,0·10⁻¹⁰ m lokalisiert. Wie groß ist die minimale Impulsunschärfe Δp?',
          given: 'Δx·Δp ≥ ħ/2 mit ħ = 1,055·10⁻³⁴ J·s · Antwort in Einheiten von 10⁻²⁵ kg·m/s',
          num: 5.3, tol: 0.2,
          why: 'Δp = ħ/(2Δx) = 1,055·10⁻³⁴ / (2·10⁻¹⁰) ≈ 5,3·10⁻²⁵ kg·m/s. Das entspricht einer Geschwindigkeitsunschärfe von rund 580 km/s.',
          hint: 'Δp = ħ/(2·Δx) — und danach die Zehnerpotenz 10⁻²⁵ abspalten.'
        },
        {
          q: 'Welche Energie hat ein Photon mit λ = 620 nm?',
          given: 'Praktische Faustformel: E[eV] = 1240 / λ[nm]',
          num: 2, tol: 0.05, unit: 'eV',
          why: '1240/620 = 2,0 eV — rotes Licht. Der sichtbare Bereich liegt grob zwischen 1,6 eV (rot) und 3,1 eV (violett).'
        },
        {
          q: 'Welche Wellenlänge gehört zu einem Photon mit 3,1 eV?',
          num: 400, tol: 6, unit: 'nm',
          why: '1240/3,1 = 400 nm — der violette Rand des sichtbaren Spektrums.'
        },
        {
          q: 'Warum beobachtet man bei einem fliegenden Fußball keine Beugung?',
          a: [
            'Seine de-Broglie-Wellenlänge liegt bei etwa 10⁻³⁴ m — unmessbar klein gegen jedes Hindernis',
            'Weil er zu schnell ist',
            'Weil er aus zu vielen Atomen besteht, die einander stören',
            'Weil die Quantenmechanik für Makroskopisches schlicht nicht gilt'
          ],
          why: 'λ = h/(m·v): Bei m ≈ 0,4 kg und v ≈ 20 m/s kommt man auf rund 8·10⁻³⁵ m. Es gibt keinen Spalt, der eng genug wäre.'
        },
        {
          q: 'Was besagt die Unschärferelation <em>nicht</em>?',
          a: [
            'Dass unsere Messgeräte einfach noch zu ungenau sind',
            'Dass Δx und Δp eines Zustands nicht beide beliebig klein sein können',
            'Dass sie aus der Nichtvertauschbarkeit [x̂, p̂] = iħ folgt',
            'Dass sie auch für Energie und Zeit ein Analogon hat'
          ],
          why: 'Die Unschärfe ist eine Eigenschaft des Zustands, keine Schwäche der Apparatur. Δx und Δp sind Streuungen über viele identisch präparierte Systeme.'
        }
      ]
    },

    {
      id: 'studium-4',
      level: 'studium',
      title: 'Atomphysik & Spektren',
      sub: 'Wasserstoff, Potentialtopf, Auswahlregeln',
      code: '9028',
      questions: [
        {
          q: 'Wie groß ist die Bindungsenergie des Wasserstoff-Elektrons im Zustand n = 2?',
          given: 'E<sub>n</sub> = −13,6 eV / n²',
          num: 3.4, tol: 0.05, unit: 'eV',
          why: 'E<sub>2</sub> = −13,6/4 = −3,4 eV; die Bindungsenergie ist der Betrag davon.'
        },
        {
          q: 'Welche Energie hat das Photon beim Übergang n = 3 → n = 2?',
          num: 1.89, tol: 0.04, unit: 'eV',
          why: 'ΔE = 13,6·(1/4 − 1/9) = 13,6·5/36 ≈ 1,89 eV. Das ist die H-α-Linie der Balmer-Serie.',
          hint: 'ΔE = E<sub>3</sub> − E<sub>2</sub> — also die Differenz zweier negativer Zahlen.'
        },
        {
          q: 'Welche Wellenlänge hat diese Linie?',
          given: 'E[eV] = 1240 / λ[nm]',
          num: 656, tol: 8, unit: 'nm',
          why: '1240/1,89 ≈ 656 nm — das charakteristische Rot, in dem Wasserstoffnebel am Nachthimmel leuchten.'
        },
        {
          q: 'Wie viel Energie braucht man mindestens, um Wasserstoff aus dem Grundzustand zu ionisieren?',
          num: 13.6, tol: 0.15, unit: 'eV',
          why: 'Ionisation heißt n = 1 → n = ∞, also 13,6 eV — die Rydberg-Energie.'
        },
        {
          q: 'Im unendlich tiefen Potentialtopf gilt E<sub>n</sub> ∝ n². Wie groß ist E<sub>3</sub>/E<sub>1</sub>?',
          num: 9, tol: 0,
          why: 'Der Faktor ist 3² = 9. Anders als beim Wasserstoff rücken die Niveaus hier mit wachsendem n immer weiter auseinander.'
        },
        {
          q: 'Warum ist die Grundzustandsenergie im Potentialtopf nicht null?',
          a: [
            'Weil ein exakt ruhendes, lokalisiertes Teilchen die Unschärferelation verletzen würde',
            'Weil die Wände Energie abgeben',
            'Weil man den Nullpunkt der Energie beliebig wählen kann',
            'Weil das Teilchen thermische Energie besitzt'
          ],
          why: 'Die Einsperrung auf die Breite L erzwingt Δp ≳ ħ/(2L) und damit eine Nullpunktsenergie. Sie bleibt selbst bei T = 0 bestehen.'
        }
      ]
    },

    {
      id: 'studium-5',
      level: 'studium',
      title: 'Bloch-Kugel & Gatter',
      sub: 'Zustände als Drehungen lesen',
      code: '4287',
      questions: [
        {
          q: 'Ein Qubit ist |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩ mit θ = 60°. Wie groß ist P(1)?',
          given: 'θ ist der Polarwinkel gegen die +z-Achse der Bloch-Kugel',
          num: 0.25, tol: 0.005,
          why: 'P(1) = sin²(30°) = 0,25. Der halbe Winkel im Argument ist der Grund, warum antipodale Punkte auf der Kugel orthogonale Zustände sind.',
          hint: 'Achte auf θ/2 — nicht θ.'
        },
        {
          q: 'Welcher Polarwinkel θ ergibt P(0) = P(1) = 0,5?',
          num: 90, tol: 1, unit: '°',
          why: 'sin²(θ/2) = ½ bei θ/2 = 45°, also θ = 90° — der Äquator der Bloch-Kugel. Dort liegen |+⟩, |−⟩ und die y-Eigenzustände.'
        },
        {
          q: 'Auf |0⟩ wirkt die Drehung R<sub>y</sub>(120°). Wie groß ist danach P(1)?',
          num: 0.75, tol: 0.005,
          why: 'Eine Drehung um die y-Achse verschiebt θ direkt: θ = 120°, also P(1) = sin²(60°) = 3/4.'
        },
        {
          q: 'Was macht das Z-Gatter mit |+⟩ = (|0⟩ + |1⟩)/√2?',
          a: [
            'Es macht daraus |−⟩ = (|0⟩ − |1⟩)/√2',
            'Es lässt |+⟩ unverändert',
            'Es macht daraus |1⟩',
            'Es misst in z-Richtung'
          ],
          why: 'Z ist die 180°-Drehung um die z-Achse. Auf |0⟩ und |1⟩ wirkt es nur als (unbeobachtbare) Phase, auf Äquatorzustände dagegen sehr deutlich.'
        },
        {
          q: 'Welcher Drehung entspricht das S-Gatter?',
          a: [
            '90° um die z-Achse',
            '180° um die z-Achse',
            '90° um die x-Achse',
            '45° um die y-Achse'
          ],
          why: 'S = diag(1, i) ist die Wurzel aus Z: S² = Z. Entsprechend ist T = diag(1, e<sup>iπ/4</sup>) die Wurzel aus S.'
        },
        {
          q: 'Warum reichen zwei Winkel (θ, φ) aus, um jeden reinen Ein-Qubit-Zustand zu beschreiben?',
          a: [
            'Weil von vier reellen Parametern die Normierung einen und die globale Phase einen weiteren wegnimmt',
            'Weil komplexe Amplituden immer reell gewählt werden können',
            'Weil ein Qubit nur zwei Messergebnisse hat',
            'Weil die Bloch-Kugel eine Näherung ist'
          ],
          why: 'α und β sind zwei komplexe Zahlen, also 4 reelle Freiheitsgrade. 4 − 1 (Normierung) − 1 (globale Phase) = 2. Gemischte Zustände brauchen zusätzlich den Radius im Inneren der Kugel.'
        }
      ]
    },

    {
      id: 'studium-6',
      level: 'studium',
      title: 'Verschränkung, Bell & Algorithmen',
      sub: 'Korrelationen jenseits der klassischen Grenze',
      code: '6715',
      questions: [
        {
          q: 'Zwei Qubits sind im Bell-Zustand |Φ⁺⟩ = (|00⟩ + |11⟩)/√2. Wie groß ist P(01)?',
          num: 0, tol: 0.001,
          why: 'Die Amplitude von |01⟩ ist exakt null. Gemischte Ergebnisse kommen bei |Φ⁺⟩ nie vor — nur 00 und 11, je zur Hälfte.'
        },
        {
          q: 'Wie groß ist die Reinheit Tr(ρ²) des <em>reduzierten</em> Zustands eines einzelnen Qubits aus |Φ⁺⟩?',
          given: 'ρ<sub>A</sub> = Tr<sub>B</sub>(|Φ⁺⟩⟨Φ⁺|)',
          num: 0.5, tol: 0.01,
          why: 'ρ<sub>A</sub> = ½·1, also Tr(ρ²) = ½ — der Minimalwert für ein Qubit. Das Teilsystem ist maximal gemischt, die Verschränkungsentropie beträgt genau 1 Bit. Die volle Information steckt allein in der Korrelation.',
          hint: 'Der reduzierte Zustand ist maximal gemischt. Für ρ = ½·1 ist Tr(ρ²) = 2·(½)².'
        },
        {
          q: 'Wie groß ist der maximale CHSH-Wert, den die Quantenmechanik erlaubt?',
          given: 'Klassisch (lokal-realistisch) gilt |S| ≤ 2',
          num: 2.828, tol: 0.035,
          why: 'Die Tsirelson-Schranke ist 2√2 ≈ 2,828. Bemerkenswert: Stärkere Korrelationen wären mathematisch denkbar, ohne die Relativitätstheorie zu verletzen — die Natur schöpft das nicht aus.',
          hint: 'Der Wert ist 2·√2.'
        },
        {
          q: 'Ein experimentell nachgewiesener Bell-Verstoß schließt aus:',
          a: [
            'Theorien, die zugleich lokal und realistisch sind',
            'jede Form von Determinismus',
            'die Existenz verborgener Variablen überhaupt',
            'die Gültigkeit der Relativitätstheorie'
          ],
          why: 'Ausgeschlossen wird die <em>Konjunktion</em> aus Lokalität und Realismus. Nichtlokale verborgene Variablen — etwa die Bohmsche Mechanik — bleiben mit allen Messdaten verträglich.'
        },
        {
          q: 'Grovers Algorithmus durchsucht eine unstrukturierte Datenbank mit N = 10⁶ Einträgen. Wie viele Auswertungen braucht er ungefähr?',
          a: [
            'etwa 10³',
            'etwa 10⁶',
            'etwa 5·10⁵',
            'etwa 20'
          ],
          keep: true,
          why: 'O(√N) ≈ π/4·√10⁶ ≈ 785. Das ist ein quadratischer Vorteil — kein exponentieller. Einen exponentiellen Sprung liefern nur bestimmte Algorithmen, etwa Shors Faktorisierung.'
        },
        {
          q: 'Warum widerspricht Quantenteleportation nicht dem No-Cloning-Theorem?',
          a: [
            'Weil der ursprüngliche Zustand durch die Bell-Messung zerstört wird — es entsteht keine zweite Kopie',
            'Weil dabei nichts wirklich übertragen wird',
            'Weil sie nur mit klassischen Zuständen funktioniert',
            'Weil die Kopie stets unvollkommen bleibt'
          ],
          why: 'Teleportation ist ein Verschieben, kein Vervielfältigen. Und weil zwei klassische Bits mitgeschickt werden müssen, bleibt sie an die Lichtgeschwindigkeit gebunden.'
        }
      ]
    }

  ]
};
