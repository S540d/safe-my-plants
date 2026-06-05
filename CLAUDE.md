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
  components/      – TrafficLight, PlantCard, DiseaseCard, DashboardSummary, HeroPlantCard
  contexts/        – PlantContext (CRUD + Persistenz + CareLog-Writes)
  hooks/           – useCareStatus, usePreferences, useCareLog
  types/           – plant.ts, careLog.ts (CareAction, CareActionType)
  constants/       – defaultPlants.ts (3 Musterpflanzen)
  services/        – storage.ts (AsyncStorage-Wrapper inkl. CareLog + Schema-Version)
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
main (production) ← testing ← feature/issue-XXX
```

- `testing` ist Standard-Ziel für alle PRs — nie direkt auf `main`
- `gh pr merge <nr> --squash --delete-branch` für Feature→testing
- `gh pr merge <nr> --squash` für testing→main (kein `--delete-branch`!)
- **Vor Push:** lokale Tests (`npm test`); kein Merge bei CI-Fail

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
  lastWatered?, lastFertilized?   // ISO date strings (bleiben als Schnellzugriff)
  createdAt, updatedAt
}

// Neu (Schema v2):
CareAction {
  id: string
  plantId: string
  type: 'water' | 'fertilize' | 'repot' | 'prune' | 'note'
  timestamp: string          // ISO-8601
  note?: string
}
```

## AsyncStorage-Keys

| Key | Inhalt |
|-----|--------|
| `smp-plants` | `Plant[]` |
| `smp-admin-pin` | PIN-String |
| `smp-language` | `'de' \| 'en'` |
| `smp-theme` | `'light' \| 'dark' \| 'system'` |
| `smp-carelog` | `CareAction[]` (neu, Schema v2) |
| `smp-schema-version` | `number` (aktuell: 2) |

## Schema-Migration

`PlantContext` führt beim App-Start eine idempotente Migration durch:
- v1 → v2: bestehende `lastWatered`/`lastFertilized` werden als initiale CareLog-Einträge übernommen (IDs: `migration-water-{plantId}`, `migration-fertilize-{plantId}`)
- `smp-schema-version` wird auf `2` gesetzt

## CareLog-Architektur

- `src/services/storage.ts` → `addCareAction`, `getCareLog`, `saveCareLog`
- `src/hooks/useCareLog.ts` → React-Hook mit **module-level Subscriber-Pattern**: alle Instanzen bleiben via `notifyCareLogUpdate()` synchron
- `PlantContext.markWatered/markFertilized` rufen `addCareAction` + `notifyCareLogUpdate()` auf
- Neue externe Writes immer über `notifyCareLogUpdate()` abschließen

## Ampel-Logik

- **Grün (ok):** > 20% des Intervalls verbleibend
- **Gelb (soon):** 0–20% verbleibend
- **Rot (overdue):** Datum überschritten oder noch nie gegossen/gedüngt (`lastWatered`/`lastFertilized` fehlt → direkt `overdue`)

Berechnung in `src/hooks/useCareStatus.ts`.

## Admin-Bereich

PIN-geschützt (4-stellig, in AsyncStorage). Beim ersten Start wird die PIN gesetzt.
Admin kann: Pflanzen anlegen/bearbeiten/löschen, Fotos hinzufügen, Krankheiten verwalten.

## Feature-Roadmap (GitHub Issues: s540d/safe-my-plants)

Vollständige Planung: Issue #16 (Tracking-Issue)

### Phase 1 – MVP ✅/🔄
| Issue | Feature | Status |
|-------|---------|--------|
| #2 | CareLog-Datenmodell + History-Hook | ✅ merged (PR #17) |
| #3 | Dashboard-Karten + Hero-Tile am Index | ✅ merged (PR #17) |
| #4 | Suchleiste + Filter-Chips + Sortierung | 🔜 |
| #5 | In-App-Reminder-Banner + Tab-Badge | 🔜 |
| #6 | Plant-Detail: History-Liste + Quick-Actions | 🔜 (benötigt #2) |

### Phase 2 – Polish
| Issue | Feature | Status |
|-------|---------|--------|
| #7 | Foto-Galerie + Schema-Migration (photos: PlantPhoto[]) | 🔜 |
| #8 | Theme-Tokens + Empty-States + Dark-Mode-Audit | 🔜 |
| #9 | Animationen (Reanimated) + Haptik | 🔜 |
| #10 | Notizen pro Pflanze | 🔜 |
| #11 | First-Run-Onboarding (3 Slides) | 🔜 |
| #12 | Statistik-Screen: Streak, Counts | 🔜 |
| #13 | Pflanzen-Templates | 🔜 |

### Phase 3 – Stretch
| Issue | Feature | Status |
|-------|---------|--------|
| #14 | Push-Notifications (expo-notifications) | 🔜 |
| #15 | JSON-Export / Import (expo-sharing) | 🔜 |

## Spätere Zusammenführung mit Pflanzkalender

- Gleiche `PlantLocation`-Typen
- Plant-IDs als UUIDs (universal)
- JSON-Export-Struktur kompatibel haltbar
- CareLog-Einträge enthalten `plantId` als UUID → direkt portierbar
