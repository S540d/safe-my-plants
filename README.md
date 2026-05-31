# Safe My Plants 🌿

Eine Topfpflanzen-Companion-App für Android. Zeigt Pflegehinweise, Ampel-Status für Gieß- und Düngeintervalle, Krankheitsbilder und Fotos. Inhalte werden manuell über einen PIN-geschützten Admin-Bereich gepflegt.

## Features

- **Pflanzenübersicht** – alle Pflanzen auf einen Blick mit Ampel-Status
- **Ampel-System** – Grün / Gelb / Rot zeigt, wann Gießen oder Düngen fällig ist
- **Detailansicht** – Pflegetipps, Fotos, Standort, Temperatur- und Feuchtigkeitsbedarf
- **Krankheitsbilder** – Symptome und Behandlungshinweise je Pflanze
- **Admin-Bereich** – PIN-geschützt; Pflanzen anlegen, bearbeiten, löschen
- **Mehrsprachig** – Deutsch und Englisch (DE/EN)
- **Offline-first** – alle Daten lokal via AsyncStorage, kein Backend

## Tech Stack

| Technologie | Version |
|---|---|
| React Native + Expo | 56 |
| Expo Router | ~56.2 |
| TypeScript | ~6.0 |
| AsyncStorage | 2.2 |
| expo-image-picker | ~56.0 |
| expo-linear-gradient | ~56.0 |

## Projektstruktur

```
safe-my-plants/
├── app/                    # Expo Router Screens
│   ├── _layout.tsx         # Tab-Navigation (Root Layout)
│   ├── index.tsx           # Pflanzenübersicht
│   ├── admin.tsx           # Admin-Bereich (PIN-geschützt)
│   ├── settings.tsx        # Einstellungen (Sprache, PIN)
│   └── plant/[id].tsx      # Pflanzen-Detailansicht
├── src/
│   ├── components/         # TrafficLight, PlantCard, DiseaseCard
│   ├── contexts/           # PlantContext (CRUD + Persistenz)
│   ├── hooks/              # useCareStatus, usePreferences
│   ├── types/              # plant.ts (Datenmodell)
│   ├── constants/          # defaultPlants.ts (3 Musterpflanzen)
│   ├── services/           # storage.ts (AsyncStorage-Wrapper)
│   └── i18n/              # translations.ts (DE/EN)
├── assets/                 # Icons, Splash Screen
├── CLAUDE.md               # KI-Kontext und Entwicklungshinweise
└── package.json
```

## Entwicklung starten

### Voraussetzungen

- Node.js ≥ 18
- npm
- Expo Go App auf Android-Gerät **oder** Android-Emulator

### Setup

```bash
git clone https://github.com/s540d/safe-my-plants.git
cd safe-my-plants
npm install
npx expo start
```

Dann QR-Code mit Expo Go scannen oder `a` drücken für Android-Emulator.

## Android-Build (lokal)

```bash
# 1. Native Projektstruktur erzeugen (einmalig / nach Dependency-Änderungen)
npx expo prebuild --platform android

# 2. Build
cd android
./gradlew assembleDebug     # Debug APK
./gradlew assembleRelease   # Release APK (Signing erforderlich)
./gradlew bundleRelease     # Release AAB für Play Store
```

APK-Output: `android/app/build/outputs/apk/`

> **Hinweis:** `keystore.properties` und `local.properties` niemals einchecken – diese sind in `.gitignore`.

## Ampel-Logik

| Status | Farbe | Bedingung |
|---|---|---|
| `ok` | Grün | > 20 % des Intervalls verbleibend |
| `soon` | Gelb | 0–20 % verbleibend |
| `overdue` | Rot | Datum überschritten oder noch nie gegossen/gedüngt |

Berechnung in `src/hooks/useCareStatus.ts`.

## Datenmodell

```typescript
interface Plant {
  id: string                   // UUID
  name: string
  scientificName?: string
  description: string
  photos: string[]             // lokale URIs
  location: 'sun' | 'partial-shade' | 'shade' | 'indoor'
  careInfo: {
    wateringFrequencyDays: number
    wateringTips: string
    fertilizingFrequencyDays: number
    fertilizingTips: string
    locationTips: string
    temperature: { min: number; max: number }
    humidity: 'low' | 'medium' | 'high'
  }
  diseases: Disease[]
  lastWatered?: string         // ISO date string
  lastFertilized?: string
  createdAt: string
  updatedAt: string
}
```

## Branch-Strategie

```
main      – Produktions-Stand (kein Force-Push)
testing   – Staging / QA
feature/* – Kurzlebige Feature-Branches → testing → main
```

## Lizenz

Siehe [LICENSE](LICENSE).
