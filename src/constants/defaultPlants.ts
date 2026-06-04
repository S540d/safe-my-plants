import { Plant } from '../types/plant'

export const DEFAULT_PLANTS: Plant[] = [
  {
    id: 'default-monstera',
    name: 'Monstera',
    scientificName: 'Monstera deliciosa',
    description:
      'Die Fensterblatt-Pflanze ist eine beliebte Zimmerpflanze mit charakteristischen gelochten Blättern. Sie ist pflegeleicht und wächst schnell.',
    photos: [],
    location: 'partial-shade',
    careInfo: {
      wateringFrequencyDays: 7,
      wateringTips:
        'Erde zwischen den Wassergaben leicht antrocknen lassen. Im Winter seltener gießen. Staunässe unbedingt vermeiden.',
      fertilizingFrequencyDays: 14,
      fertilizingTips: 'Von April bis September alle zwei Wochen mit flüssigem Grünpflanzendünger düngen.',
      locationTips:
        'Helles bis halbschattiges Licht, kein direktes Mittagssonnen. Ideal: heller Platz ohne direkte Sonne.',
      temperature: { min: 16, max: 28 },
      humidity: 'medium',
    },
    diseases: [
      {
        id: 'monstera-yellowing',
        name: 'Gelbe Blätter',
        symptoms: 'Blätter verfärben sich gelb, beginnen oft bei älteren unteren Blättern.',
        treatment:
          'Überprüfe Gießmenge und Drainage. Gelbe Blätter können Staunässe oder Nährstoffmangel signalisieren.',
      },
      {
        id: 'monstera-brown-tips',
        name: 'Braune Blattspitzen',
        symptoms: 'Blattspitzen werden braun und trocken.',
        treatment: 'Luftfeuchtigkeit erhöhen (besprühen oder Luftbefeuchter) und auf regelmäßiges Gießen achten.',
      },
    ],
    lastWatered: undefined,
    lastFertilized: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-pothos',
    name: 'Efeutute',
    scientificName: 'Epipremnum aureum',
    description:
      'Die Efeutute ist eine der robustesten Zimmerpflanzen überhaupt. Sie verzeiht Pflanzenfehler und gedeiht auch in weniger idealem Licht.',
    photos: [],
    location: 'shade',
    careInfo: {
      wateringFrequencyDays: 10,
      wateringTips:
        'Erst gießen, wenn die obere Erdschicht (2–3 cm) trocken ist. Verträgt kurze Trockenperioden gut.',
      fertilizingFrequencyDays: 21,
      fertilizingTips: 'Alle drei Wochen in der Wachstumsphase (Frühling/Sommer) dünn düngen.',
      locationTips:
        'Sehr anpassungsfähig: von hell bis halbschattig. Kein direktes Sonnenlicht, das bleicht die Blätter aus.',
      temperature: { min: 15, max: 30 },
      humidity: 'low',
    },
    diseases: [
      {
        id: 'pothos-root-rot',
        name: 'Wurzelfäule',
        symptoms: 'Hängende, welke Blätter trotz feuchter Erde, schwarze faulige Wurzeln.',
        treatment:
          'Pflanze sofort umtopfen, faule Wurzeln abschneiden, in frische trockene Erde setzen. Gießverhalten überprüfen.',
      },
    ],
    lastWatered: undefined,
    lastFertilized: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-ficus',
    name: 'Gummibaum',
    scientificName: 'Ficus elastica',
    description:
      'Der Gummibaum mit seinen glänzend dunkelgrünen Blättern ist ein klassischer Zimmerbaum. Er kann über Jahre sehr groß werden.',
    photos: [],
    location: 'sun',
    careInfo: {
      wateringFrequencyDays: 10,
      wateringTips:
        'Mäßig gießen – zwischen den Wassergaben die Erde gut abtrocknen lassen. Im Winter deutlich reduzieren.',
      fertilizingFrequencyDays: 14,
      fertilizingTips: 'Während der Wachstumsphase (März–September) alle zwei Wochen flüssig düngen.',
      locationTips: 'Heller Standort, verträgt auch direkte Morgensonne. Mag keine Zugluft und keine Umsiedlung.',
      temperature: { min: 15, max: 30 },
      humidity: 'medium',
    },
    diseases: [
      {
        id: 'ficus-leaf-drop',
        name: 'Blattfall',
        symptoms: 'Plötzlicher Abwurf vieler Blätter.',
        treatment:
          'Standortwechsel, Zugluft oder Temperaturschwankungen sind häufige Ursachen. Standort stabilisieren und Gießrhythmus überprüfen.',
      },
      {
        id: 'ficus-spider-mite',
        name: 'Spinnmilben',
        symptoms: 'Feine Gespinste an Blattunterseiten, gelblich gesprenkelte Blätter.',
        treatment: 'Blätter mit feuchtem Tuch abwischen, Luftfeuchtigkeit erhöhen, bei Befall Neem-Öl sprühen.',
      },
    ],
    lastWatered: undefined,
    lastFertilized: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-aloe',
    name: 'Aloe Vera',
    description:
      'Aloe Vera ist eine sukkulente Heilpflanze, die für ihr beruhigendes Gel bekannt ist. Sie ist sehr pflegeleicht und übersteht auch längere Trockenperioden problemlos.',
    photos: [],
    location: 'sun',
    careInfo: {
      wateringFrequencyDays: 14,
      wateringTips:
        'Sehr sparsam gießen – Aloe Vera speichert Wasser in ihren Blättern. Die Erde zwischen den Wassergaben vollständig austrocknen lassen. Im Winter kaum gießen.',
      fertilizingFrequencyDays: 30,
      fertilizingTips:
        'Einmal im Monat während der Wachstumsperiode (Frühling/Sommer) mit Kaktus- oder Sukkulentendünger düngen. Im Winter komplett pausieren.',
      locationTips:
        'Sonniger bis sehr heller Standort. Verträgt auch direkte Mittagssonne. Ideal: Südfenster oder Balkon im Sommer.',
      temperature: { min: 15, max: 30 },
      humidity: 'low',
    },
    diseases: [
      {
        id: 'aloe-overwatering',
        name: 'Staunässe / Wurzelfäule',
        symptoms: 'Blätter werden weich, braun und glasig. Pflanze wirkt schlaff trotz feuchter Erde.',
        treatment:
          'Sofort umtopfen, faulige Wurzeln entfernen. Neue Erde (Kakteenmix) verwenden und deutlich weniger gießen.',
      },
      {
        id: 'aloe-sunburn',
        name: 'Sonnenbrand',
        symptoms: 'Braune, trockene Flecken an den Blattspitzen oder auf den Blättern.',
        treatment:
          'Pflanze langsam an direkte Sonne gewöhnen, besonders nach dem Winter. Verbrannte Stellen können nicht regeneriert werden.',
      },
    ],
    lastWatered: undefined,
    lastFertilized: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-zamio',
    name: 'Zamioculcas',
    scientificName: 'Zamioculcas zamiifolia',
    description:
      'Die Glücksfeder ist eine der genügsamsten Zimmerpflanzen. Sie verträgt Schatten, Trockenheit und Vernachlässigung – und sieht dabei immer elegant aus.',
    photos: [],
    location: 'shade',
    careInfo: {
      wateringFrequencyDays: 14,
      wateringTips:
        'Sehr wenig Wasser benötigt. Erde vollständig zwischen den Wassergaben abtrocknen lassen. Lieber zu wenig als zu viel gießen – Staunässe ist die größte Gefahr.',
      fertilizingFrequencyDays: 30,
      fertilizingTips:
        'Einmal im Monat von April bis September mit einem schwach dosierten Flüssigdünger versorgen. Im Winter komplett pausieren.',
      locationTips:
        'Sehr schattenverträglich – ideal für dunkle Ecken und Flure. Verträgt auch hellere Standorte, jedoch kein direktes Sonnenlicht.',
      temperature: { min: 16, max: 26 },
      humidity: 'low',
    },
    diseases: [
      {
        id: 'zamio-yellow-leaves',
        name: 'Gelbe Blätter',
        symptoms: 'Einzelne oder mehrere Blätter verfärben sich gelb.',
        treatment:
          'Häufigste Ursache ist zu viel Wasser. Gießmenge reduzieren und Drainage prüfen. Gelbe Blätter abschneiden.',
      },
      {
        id: 'zamio-spider-mites',
        name: 'Spinnmilben',
        symptoms: 'Feine Gespinste und helle Pünktchen auf den Blättern, Blätter verlieren ihren Glanz.',
        treatment:
          'Blätter mit feuchtem Tuch abwischen, Luftfeuchtigkeit erhöhen. Bei starkem Befall Neem-Öl oder Acarizid anwenden.',
      },
    ],
    lastWatered: undefined,
    lastFertilized: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-sansevieria',
    name: 'Bogenhanf',
    scientificName: 'Sansevieria trifasciata',
    description:
      'Der Bogenhanf ist eine äußerst robuste Sukkulente mit aufrechten, bandartigen Blättern. Er gilt als einer der härtesten Zimmerpflanzen und reinigt zudem die Raumluft.',
    photos: [],
    location: 'indoor',
    careInfo: {
      wateringFrequencyDays: 21,
      wateringTips:
        'Sehr selten gießen – alle 2 bis 3 Wochen reicht meist aus. Im Winter noch seltener, ca. einmal im Monat. Staunässe unbedingt vermeiden.',
      fertilizingFrequencyDays: 30,
      fertilizingTips:
        'Einmal im Monat während der Wachstumsphase (Frühling/Sommer) mit Kaktus- oder Sukkulentendünger düngen. Im Herbst und Winter pausieren.',
      locationTips:
        'Sehr anpassungsfähig: von hell bis schattig. Bevorzugt indirektes Licht, verträgt aber auch dunkle Ecken. Kein direktes Mittagssonnen-Licht.',
      temperature: { min: 15, max: 30 },
      humidity: 'low',
    },
    diseases: [
      {
        id: 'sansevieria-root-rot',
        name: 'Wurzelfäule durch Staunässe',
        symptoms: 'Weiche, matschige Basis der Blätter, unangenehmer Geruch, gelb-braune Verfärbungen.',
        treatment:
          'Pflanze aus Topf nehmen, faulige Wurzeln und Blattbasis entfernen. In frische, gut drainierte Erde (Kakteenmix) umtopfen.',
      },
      {
        id: 'sansevieria-mealybugs',
        name: 'Wollläuse',
        symptoms: 'Weiße watteartige Klümpchen in Blattachseln und an Blattbasen.',
        treatment:
          'Befall mit Alkohol-Wattestäbchen abtupfen. Bei starkem Befall mit Neem-Öl-Lösung behandeln. Pflanze isolieren.',
      },
    ],
    lastWatered: undefined,
    lastFertilized: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-orchid',
    name: 'Orchidee',
    scientificName: 'Phalaenopsis',
    description:
      'Die Phalaenopsis-Orchidee ist die beliebteste Zimmerpflanze weltweit. Mit ihren eleganten Blüten begeistert sie über Wochen – bei richtiger Pflege blüht sie regelmäßig wieder.',
    photos: [],
    location: 'partial-shade',
    careInfo: {
      wateringFrequencyDays: 10,
      wateringTips:
        'Orchideen in Rindenmix gießen, wenn die Wurzeln hellgrau aussehen (trocken). Am besten tauchen: Topf 10–15 Minuten in Wasser stellen, dann gut abtropfen lassen. Keine Staunässe!',
      fertilizingFrequencyDays: 14,
      fertilizingTips:
        'Alle zwei Wochen mit speziellem Orchideendünger in halber Dosierung düngen. Im Winter seltener (alle 4 Wochen).',
      locationTips:
        'Helles, indirektes Licht ohne direkte Mittagssonne. Ideal: Ostfenster oder etwas von einem Westfenster entfernt. Orchideen lieben Helligkeit, aber kein direktes Sonnenlicht.',
      temperature: { min: 18, max: 25 },
      humidity: 'high',
    },
    diseases: [
      {
        id: 'orchid-root-rot',
        name: 'Wurzelfäule',
        symptoms: 'Wurzeln werden braun-schwarz und matschig. Blätter verlieren Festigkeit und werden gelb.',
        treatment:
          'Befallene Wurzeln mit steriler Schere entfernen. Schnittstellen mit Zimt (natürliches Antimykotikum) bestäuben. In frischen Orchideenrindenmix umtopfen.',
      },
      {
        id: 'orchid-scale',
        name: 'Schildläuse',
        symptoms: 'Braune Schildchen auf Blättern und Stielen, klebrige Honigtau-Ausscheidungen.',
        treatment:
          'Schildläuse mechanisch mit Alkohol-Wattestäbchen entfernen. Pflanze isolieren und alle 5–7 Tage behandeln bis Befall beendet.',
      },
    ],
    lastWatered: undefined,
    lastFertilized: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-basil',
    name: 'Basilikum',
    description:
      'Basilikum ist das beliebteste Küchenkraut Europas. Er gedeiht am besten auf der Fensterbank in der Küche und liefert frische Blätter für die tägliche Küche.',
    photos: [],
    location: 'sun',
    careInfo: {
      wateringFrequencyDays: 3,
      wateringTips:
        'Regelmäßig und gleichmäßig gießen – Basilikum mag weder Austrocknen noch Staunässe. Am besten morgens von unten gießen (Untersetzer). Erde immer leicht feucht halten.',
      fertilizingFrequencyDays: 14,
      fertilizingTips:
        'Alle zwei Wochen mit flüssigem Kräuterdünger oder Universaldünger in halber Dosierung düngen. Supermarkt-Basilikum nach dem Vereinzeln in neue Erde pflanzen.',
      locationTips:
        'Vollsonniger, warmer Standort – mindestens 6 Stunden Sonne täglich. Ideal: Südküchenfenster oder Südbalkon. Keine Zugluft und keine Temperaturen unter 10°C.',
      temperature: { min: 18, max: 28 },
      humidity: 'medium',
    },
    diseases: [
      {
        id: 'basil-downy-mildew',
        name: 'Falscher Mehltau',
        symptoms: 'Gelbe Flecken auf der Blattoberseite, grau-lila Sporenbelag auf der Unterseite.',
        treatment:
          'Befallene Blätter sofort entfernen. Luftzirkulation verbessern. Pflanze weniger dicht stellen. Befallene Pflanzen nicht zum Kochen verwenden.',
      },
      {
        id: 'basil-aphids',
        name: 'Blattläuse',
        symptoms: 'Kleine grüne oder schwarze Insekten an Triebspitzen und Blattunterseiten, klebrige Blätter.',
        treatment:
          'Pflanzen mit einem starken Wasserstrahl abbrausen. Bei Küchenbasilikum keine Chemie – befallene Triebe abschneiden und mit Wasser-Seife-Lösung besprühen.',
      },
    ],
    lastWatered: undefined,
    lastFertilized: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
