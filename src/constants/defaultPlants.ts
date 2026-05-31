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
]
