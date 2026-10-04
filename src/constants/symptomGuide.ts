import { Language } from '../i18n/translations'

export type Localized = Record<Language, string>

export interface SymptomCause {
  id: string
  title: Localized
  /** So findest du heraus, ob das die Ursache ist. */
  check: Localized
  /** Was jetzt zu tun ist. */
  fix: Localized
}

export interface Symptom {
  id: string
  icon: string
  title: Localized
  /** Ursachen, wahrscheinlichste zuerst (bei Anfängern fast immer: Gießen). */
  causes: SymptomCause[]
}

/**
 * Allgemeiner Problem-Ratgeber nach Symptom, unabhängig von der einzelnen Pflanze.
 * Bewusst konservativ formuliert: nur verbreitete, gut belegte Ursachen und
 * einfache Maßnahmen ohne Chemie als ersten Schritt.
 * Quellen: siehe .claude/memory.md (Abschnitt „Symptom-Ratgeber").
 */
export const SYMPTOM_GUIDE: Symptom[] = [
  {
    id: 'yellow-leaves',
    icon: '🍂',
    title: { de: 'Gelbe Blätter', en: 'Yellow leaves' },
    causes: [
      {
        id: 'too-wet',
        title: { de: 'Zu viel Wasser', en: 'Too much water' },
        check: {
          de: 'Erde fühlt sich dauerhaft nass an, auch 2 cm tief. Gelbe Blätter sind oft weich. Bei einem Blick auf die Wurzeln sind sie dunkelbraun bis schwarz.',
          en: 'The soil stays wet, even 2 cm deep. Yellow leaves are often soft. The roots look dark brown to black.',
        },
        fix: {
          de: 'Nicht mehr gießen, bis die Erde oben angetrocknet ist. Wasser nie im Übertopf stehen lassen. Bei schwarzen, matschigen Wurzeln: Pflanze austopfen, faule Wurzeln abschneiden, in frische Erde mit Abzugsloch setzen.',
          en: 'Stop watering until the top of the soil has dried. Never leave water standing in the outer pot. If roots are black and mushy: unpot, cut off the rotten roots, repot into fresh soil in a pot with a drainage hole.',
        },
      },
      {
        id: 'too-dry',
        title: { de: 'Zu wenig Wasser', en: 'Too little water' },
        check: {
          de: 'Erde ist knochentrocken und löst sich vom Topfrand. Zuerst werden meist die älteren, unteren Blätter gelb und fallen ab.',
          en: 'The soil is bone dry and pulls away from the pot. Usually the older, lower leaves turn yellow and drop first.',
        },
        fix: {
          de: 'Gründlich gießen, bis Wasser unten herausläuft, und den Überschuss nach etwa 15 Minuten wegkippen. Danach wieder den Fingertest machen, statt nach Kalender zu gießen.',
          en: 'Water thoroughly until water runs out at the bottom and empty the excess after about 15 minutes. After that, use the finger test instead of watering by the calendar.',
        },
      },
      {
        id: 'light-nutrients',
        title: { de: 'Zu wenig Licht oder Nährstoffe', en: 'Too little light or nutrients' },
        check: {
          de: 'Erde ist weder nass noch trocken. Die Pflanze steht dunkel oder wurde lange nicht gedüngt. Blattadern bleiben grün, die Fläche dazwischen wird hell.',
          en: 'The soil is neither wet nor dry. The plant stands in a dark spot or has not been fertilized for a long time. Leaf veins stay green while the tissue between them turns pale.',
        },
        fix: {
          de: 'Heller stellen (ohne pralle Mittagssonne). In der Wachstumszeit (Frühling bis Sommer) nach Packungsangabe düngen, nicht mehr.',
          en: 'Move to a brighter spot (without harsh midday sun). Fertilize during the growing season (spring to summer) as directed on the pack, no more.',
        },
      },
    ],
  },
  {
    id: 'brown-tips',
    icon: '🥀',
    title: { de: 'Braune Blattspitzen und -ränder', en: 'Brown leaf tips and edges' },
    causes: [
      {
        id: 'dry-air',
        title: { de: 'Trockene Heizungsluft', en: 'Dry heating air' },
        check: {
          de: 'Es ist Heizsaison, die Pflanze steht nahe an Heizkörper oder Ofen. Die Spitzen sind trocken und knusprig.',
          en: 'It is heating season and the plant stands close to a radiator or stove. The tips are dry and crispy.',
        },
        fix: {
          de: 'Von Heizquellen wegstellen, Pflanzen gruppieren, gelegentlich lüften. Braune Spitzen mit einer sauberen Schere nachschneiden.',
          en: 'Move away from heat sources, group plants together, ventilate now and then. Trim brown tips with clean scissors.',
        },
      },
      {
        id: 'watering',
        title: { de: 'Unregelmäßiges Gießen', en: 'Irregular watering' },
        check: {
          de: 'Die Erde war zwischendurch komplett trocken oder lange nass. Auch die Blätter welken zwischendurch.',
          en: 'The soil was completely dry at times or wet for a long time. The leaves also wilt now and then.',
        },
        fix: {
          de: 'Gleichmäßig gießen: erst wenn die Erde oben angetrocknet ist, dann gründlich.',
          en: 'Water evenly: only once the top of the soil has dried, then thoroughly.',
        },
      },
      {
        id: 'salt',
        title: { de: 'Salze von Dünger oder Leitungswasser', en: 'Salts from fertilizer or tap water' },
        check: {
          de: 'Auf der Erde oder am Topfrand zeigt sich ein weißer Belag. Du düngst häufig oder hast sehr hartes Wasser. Empfindlich sind z. B. Grünlilie und Calathea.',
          en: 'A white crust shows on the soil or pot rim. You fertilize often or have very hard water. Spider plants and calatheas are sensitive, for example.',
        },
        fix: {
          de: 'Düngung pausieren und die Erde einmal gründlich durchspülen. Danach Wasser abtropfen lassen. Bei empfindlichen Pflanzen Regenwasser oder abgestandenes Wasser nutzen.',
          en: 'Pause fertilizing and flush the soil thoroughly once. Let it drain afterwards. For sensitive plants use rainwater or water that has stood for a while.',
        },
      },
    ],
  },
  {
    id: 'drooping',
    icon: '😞',
    title: { de: 'Hängende, schlaffe Blätter', en: 'Drooping, limp leaves' },
    causes: [
      {
        id: 'too-dry',
        title: { de: 'Durst', en: 'Thirst' },
        check: {
          de: 'Erde ist trocken, der Topf fühlt sich leicht an. Blätter richten sich nach dem Gießen innerhalb von Stunden wieder auf.',
          en: 'The soil is dry and the pot feels light. Leaves perk up again within hours after watering.',
        },
        fix: {
          de: 'Gründlich gießen und Überschuss nach etwa 15 Minuten wegkippen.',
          en: 'Water thoroughly and empty the excess after about 15 minutes.',
        },
      },
      {
        id: 'root-rot',
        title: { de: 'Wurzelfäule durch Staunässe', en: 'Root rot from waterlogging' },
        check: {
          de: 'Erde ist nass und die Pflanze hängt trotzdem. Eventuell riecht es muffig oder faulig. Wurzeln sind dunkelbraun bis schwarz und weich (gesunde Wurzeln sind hell).',
          en: 'The soil is wet and the plant still droops. It may smell musty or rotten. Roots are dark brown to black and soft (healthy roots are light).',
        },
        fix: {
          de: 'Nicht nachgießen! Pflanze austopfen, faule Wurzeln entfernen, in frische, durchlässige Erde und einen Topf mit Abzugsloch setzen. Danach sparsam gießen.',
          en: 'Do not water more! Unpot, remove rotten roots, repot into fresh, well-draining soil in a pot with a drainage hole. Water sparingly afterwards.',
        },
      },
    ],
  },
  {
    id: 'leaf-drop',
    icon: '🍃',
    title: { de: 'Blätter fallen ab', en: 'Leaves are dropping' },
    causes: [
      {
        id: 'change',
        title: { de: 'Standort- oder Temperaturwechsel', en: 'Change of spot or temperature' },
        check: {
          de: 'Die Pflanze wurde kürzlich umgestellt, gekauft oder steht im Zug oder neben einer Heizung. Es fallen viele Blätter auf einmal.',
          en: 'The plant was moved or bought recently, or stands in a draught or next to a heater. Many leaves drop at once.',
        },
        fix: {
          de: 'Einen hellen, zugfreien Platz mit gleichmäßiger Temperatur suchen und dort lassen. Die Pflanze braucht einige Wochen zur Eingewöhnung.',
          en: 'Pick a bright, draught-free spot with an even temperature and leave the plant there. It needs a few weeks to settle in.',
        },
      },
      {
        id: 'watering',
        title: { de: 'Gießfehler', en: 'Watering mistakes' },
        check: {
          de: 'Erde ist dauernd nass oder oft ganz ausgetrocknet. Gelbe Blätter fallen zuerst.',
          en: 'The soil is constantly wet or often completely dry. Yellow leaves drop first.',
        },
        fix: {
          de: 'Fingertest machen und nach dem Ergebnis gießen. Siehe auch „Gelbe Blätter“.',
          en: 'Do the finger test and water according to the result. See also "Yellow leaves".',
        },
      },
    ],
  },
  {
    id: 'mushy',
    icon: '🤢',
    title: { de: 'Weiche, matschige oder schwarze Stellen', en: 'Soft, mushy or black spots' },
    causes: [
      {
        id: 'rot',
        title: { de: 'Fäulnis durch Nässe', en: 'Rot from wetness' },
        check: {
          de: 'Stängel oder Stammbasis sind weich und dunkel, die Erde ist nass, es riecht faulig.',
          en: 'The stem or base of the trunk is soft and dark, the soil is wet and smells rotten.',
        },
        fix: {
          de: 'Sofort nicht mehr gießen. Pflanze austopfen, alles Weiche und Schwarze mit sauberem Messer entfernen, in frische Erde mit Abzugsloch setzen. Ist der Stängel durchgehend matschig, lässt sich die Pflanze oft nur noch über gesunde Triebspitzen als Steckling retten.',
          en: 'Stop watering immediately. Unpot, remove everything soft and black with a clean knife, repot into fresh soil with a drainage hole. If the stem is mushy all the way through, the plant can often only be saved as a cutting from healthy shoot tips.',
        },
      },
    ],
  },
  {
    id: 'mold',
    icon: '🍄',
    title: { de: 'Weißer Belag oder Schimmel auf der Erde', en: 'White coating or mould on the soil' },
    causes: [
      {
        id: 'wet-soil',
        title: { de: 'Dauerfeuchte Erde, wenig Luft', en: 'Constantly damp soil, little airflow' },
        check: {
          de: 'Watteartiger weißer Belag auf der Erdoberfläche, die Erde trocknet kaum ab. Meist ein harmloser Pilz, der von feuchter, organischer Erde lebt.',
          en: 'A cotton-like white coating on the soil surface and the soil hardly dries. Usually a harmless fungus living on damp, organic soil.',
        },
        fix: {
          de: 'Obere Erdschicht abtragen und ersetzen, Erde zwischen dem Gießen stärker abtrocknen lassen, für Luftbewegung sorgen, Abzugsloch frei halten.',
          en: 'Scrape off and replace the top layer of soil, let the soil dry out more between waterings, improve airflow, keep the drainage hole clear.',
        },
      },
    ],
  },
  {
    id: 'pests',
    icon: '🐛',
    title: { de: 'Schädlinge', en: 'Pests' },
    causes: [
      {
        id: 'spider-mites',
        title: { de: 'Spinnmilben', en: 'Spider mites' },
        check: {
          de: 'Feine Gespinste an Blattunterseiten und Triebspitzen, Blätter mit hellen oder gelblichen Pünktchen. Tritt bei warmer, trockener Luft auf.',
          en: 'Fine webbing on leaf undersides and shoot tips, leaves with pale or yellowish speckles. Occurs in warm, dry air.',
        },
        fix: {
          de: 'Befallene Pflanze von anderen trennen, kräftig abduschen, Luftfeuchtigkeit erhöhen. Bei starkem Befall Kaliseife-Präparat nach Packungsangabe, das nur bei direktem Kontakt wirkt.',
          en: 'Separate the plant from others, rinse it off firmly, raise humidity. For heavy infestations use an insecticidal soap as directed; it only works on direct contact.',
        },
      },
      {
        id: 'mealybugs-scale',
        title: { de: 'Wollläuse und Schildläuse', en: 'Mealybugs and scale insects' },
        check: {
          de: 'Weiße, watteartige Flocken (Wollläuse) oder kleine, braune, schildartige Höcker an Stängeln und Blättern (Schildläuse), oft klebrige Blätter.',
          en: 'White, cotton-like tufts (mealybugs) or small brown shell-like bumps on stems and leaves (scale insects), often sticky leaves.',
        },
        fix: {
          de: 'Pflanze trennen, Tiere abstreifen oder mit einem feuchten Tuch bzw. Wattestäbchen entfernen, abduschen. Bei Bedarf Kaliseife oder Öl-Präparat, das für die Pflanzenart geeignet ist. Nach 1–2 Wochen erneut kontrollieren.',
          en: 'Separate the plant, scrape off the insects or wipe them off with a damp cloth or cotton swab, rinse. If needed use insecticidal soap or an oil product suitable for the plant species. Check again after 1–2 weeks.',
        },
      },
      {
        id: 'fungus-gnats',
        title: { de: 'Trauermücken', en: 'Fungus gnats' },
        check: {
          de: 'Kleine dunkle Fliegen, die beim Gießen aus der Erde aufsteigen. Die Larven leben in feuchter Erde.',
          en: 'Small dark flies rising from the soil when you water. The larvae live in damp soil.',
        },
        fix: {
          de: 'Erde zwischen dem Gießen gut abtrocknen lassen. Gelbtafeln (Klebefallen) fangen die erwachsenen Mücken.',
          en: 'Let the soil dry well between waterings. Yellow sticky traps catch the adult gnats.',
        },
      },
    ],
  },
  {
    id: 'leggy',
    icon: '📏',
    title: { de: 'Lange, dünne Triebe mit kleinen, blassen Blättern', en: 'Long, thin shoots with small, pale leaves' },
    causes: [
      {
        id: 'low-light',
        title: { de: 'Zu wenig Licht', en: 'Too little light' },
        check: {
          de: 'Große Abstände zwischen den Blättern, die Pflanze wächst zum Fenster hin.',
          en: 'Large gaps between leaves and the plant grows towards the window.',
        },
        fix: {
          de: 'Heller stellen, am besten nah ans Fenster (ohne pralle Mittagssonne). Im Winter hilft eine Pflanzenlampe. Zu lange Triebe kannst du einkürzen.',
          en: 'Move to a brighter spot, ideally close to a window (without harsh midday sun). A grow light helps in winter. You can trim overly long shoots.',
        },
      },
    ],
  },
]
