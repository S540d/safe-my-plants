# Safe My Plants – Projekt-Memory

## Was ist das?

Topfpflanzen-Companion-App für Android (React Native + Expo 56, TypeScript).
Offline-first, kein Backend, kein EAS Cloud-Build.

## Wichtige Dateipfade

- `app/` – Expo Router Screens (Tabs: index, admin, settings; Dynamic: plant/[id])
- `src/contexts/PlantContext.tsx` – zentraler State + AsyncStorage-Persistenz + CareLog-Writes
- `src/hooks/useCareStatus.ts` – Ampel-Berechnung (ok / soon / overdue)
- `src/hooks/useCareLog.ts` – CareLog CRUD (addAction, getActionsForPlant, getRecentActions)
- `src/types/plant.ts` – vollständiges Datenmodell (Plant, CareInfo, Disease)
- `src/types/careLog.ts` – CareAction, CareActionType (Schema v2)
- `src/constants/defaultPlants.ts` – 3 vorinstallierte Musterpflanzen
- `src/i18n/translations.ts` – DE/EN-Strings
- `src/components/DashboardSummary.tsx` – 3 Filter-Karten (overdue/soon/ok) + Counts
- `src/components/HeroPlantCard.tsx` – Hero-Tile für dringendste Pflanze

## Entscheidungen & Einschränkungen

- **Kein Backend** – alle Daten in AsyncStorage; Plant-IDs sind strings (`default-*` für Musterpflanzen, `plant-<timestamp>-<random>` für neue)
- **Kein EAS** – APK-Build lokal mit `./gradlew assembleRelease`
- **Kein Force-Push auf main**
- Keystore liegt lokal (außerhalb des Repos), Pfad via `keystore.properties` – niemals einchecken
- **CareLog** (`smp-carelog`): additiver Store, `lastWatered`/`lastFertilized` bleiben als Schnellzugriff erhalten
- **Schema-Version** (`smp-schema-version`): aktuell 2; idempotente Migration in `PlantContext` beim Start
- **useCareLog Subscriber-Pattern**: module-level Subscribers, `notifyCareLogUpdate()` nach externen Writes aufrufen

## AsyncStorage-Keys

| Key | Inhalt |
|-----|--------|
| `smp-plants` | `Plant[]` |
| `smp-admin-pin` | PIN-String |
| `smp-language` | `'de' \| 'en'` |
| `smp-theme` | `'light' \| 'dark' \| 'system'` |
| `smp-carelog` | `CareAction[]` |
| `smp-schema-version` | `number` (aktuell: 2) |

## Branch-Strategie

- `main` – Produktions-Stand
- `testing` – Staging/QA (von main abgezweigt)
- `feature/*` – kurzlebig → testing → main

## Ampel-Schwellen

- Grün: > 20 % Intervall verbleibend
- Gelb: 0–20 %
- Rot: überfällig oder nie gegossen/gedüngt

## Künftige Zusammenführung mit Pflanzkalender

- Gleiche `PlantLocation`-Typen verwenden
- Plant-IDs auf UUID-Format umstellen (TODO: vor Zusammenführung)
- JSON-Export-Struktur kompatibel halten

## Aktuelle Abhängigkeiten (Stand 2026-05)

- expo ~56.0.8
- react 19.2.3 / react-native 0.85.3
- expo-router ~56.2.8
- typescript ~6.0.3
