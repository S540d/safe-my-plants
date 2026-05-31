# Safe My Plants – CLAUDE.md

## Projektbeschreibung

Topfpflanzen-Companion-App für Android. Zeigt Pflegehinweise, Ampel-Status für Gieß-/Düngeintervalle, Krankheitsbilder und Fotos. Inhalte werden manuell als Admin eingepflegt (kein Backend, kein Cloud-Build).

## Workflow-Regeln (verbindlich)

- **PRs immer gegen `testing`**, niemals direkt gegen `main`
- **Kein Merge nach `main`** ohne explizite schriftliche Erlaubnis des Nutzers
- Vor jedem PR: `git fetch origin testing` – prüfen ob Basis aktuell ist, ggf. rebasen
- CI-Checks und Copilot-Review abwarten; Suggestions prüfen und sinnvolle umsetzen
- Nach jedem Merge: `.claude/memory.md` mit relevanten Änderungen aktualisieren
- Für den vollständigen automatisierten Workflow: `/pr` verwenden

## Öffentliches Repository – Datenschutz

Das Repository ist öffentlich. Keine vollständigen Implementierungsdetails (Schemata, Algorithmen, interne Architekturentscheidungen) in README oder öffentliche Docs – diese gehören in CLAUDE.md oder `.claude/memory.md`.

## Tech Stack

- React Native + Expo 56 (TypeScript)
- Expo Router (file-based routing, Tab-Navigation)
- AsyncStorage (lokale Datenpersistenz)
- expo-image-picker (Fotos)
- expo-linear-gradient (Header-Design)

## Projektstruktur

```
app/               – Expo Router Screens (Tabs: index, admin, settings; Dynamic: plant/[id])
src/
  components/      – TrafficLight, PlantCard, DiseaseCard
  contexts/        – PlantContext (CRUD + Persistenz)
  hooks/           – useCareStatus, usePreferences
  types/           – plant.ts (Plant, CareInfo, Disease, CareStatus)
  constants/       – defaultPlants.ts (3 Musterpflanzen)
  services/        – storage.ts (AsyncStorage-Wrapper)
  i18n/            – translations.ts (DE/EN)
```

## Entwicklung starten

```bash
npm install
npx expo start          # Expo Go / Dev-Server
npx expo start --android  # direkt im Android-Emulator
```

## Android-Build (lokal, kein EAS)

### 1. Prebuild (einmalig oder nach Dependency-Änderungen)

```bash
npx expo prebuild --platform android
```

Erzeugt den `/android`-Ordner (nicht eingecheckt, in .gitignore).

### 2. Keystore

Keystore liegt unter:
`/Users/svenstrohkark/Documents/Programmierung/Projects/Keystore/`

Neuen Keystore für diese App anlegen:
```bash
keytool -genkey -v -keystore safe_my_plants.jks \
  -alias safemyplants -keyalg RSA -keysize 2048 -validity 10000
```

Signing-Konfiguration in `android/app/build.gradle` eintragen (analog Pflanzkalender).
`keystore.properties` und `local.properties` sind in `.gitignore` – niemals einchecken.

### 3. Build

```bash
cd android
./gradlew assembleDebug        # Debug APK
./gradlew assembleRelease      # Release APK (mit Signing)
./gradlew bundleRelease        # Release AAB
```

APK-Output: `android/app/build/outputs/apk/`

## Branch-Strategie

```
main      – Produktions-Stand (kein Force-Push, kein direkter Merge ohne Erlaubnis)
testing   – Staging / QA  ← Standard-Ziel für alle PRs
feature/* – Kurzlebige Feature-Branches → testing → main
```

## Datenmodell (Überblick)

```typescript
Plant {
  id, name, scientificName?, description
  photos: string[]           // lokale URIs
  location: 'sun' | 'partial-shade' | 'shade' | 'indoor'
  careInfo: {
    wateringFrequencyDays, wateringTips
    fertilizingFrequencyDays, fertilizingTips
    locationTips
    temperature: { min, max }
    humidity: 'low' | 'medium' | 'high'
  }
  diseases: Disease[]        // { id, name, symptoms, treatment, imageUri? }
  lastWatered?, lastFertilized?   // ISO date strings
  createdAt, updatedAt
}
```

## Ampel-Logik

- **Grün (ok):** > 20% des Intervalls verbleibend
- **Gelb (soon):** 0–20% verbleibend
- **Rot (overdue):** Datum überschritten oder noch nie gegossen/gedüngt

Berechnung in `src/hooks/useCareStatus.ts`.

## Admin-Bereich

PIN-geschützt (4-stellig, in AsyncStorage). Beim ersten Start wird die PIN gesetzt.
Admin kann: Pflanzen anlegen/bearbeiten/löschen, Fotos hinzufügen, Krankheiten verwalten.

## Spätere Zusammenführung mit Pflanzkalender

- Gleiche `PlantLocation`-Typen
- Plant-IDs als UUIDs (universal)
- JSON-Export-Struktur kompatibel haltbar
