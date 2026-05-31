# Safe My Plants – Projekt-Memory

## Was ist das?

Topfpflanzen-Companion-App für Android (React Native + Expo 56, TypeScript).
Offline-first, kein Backend, kein EAS Cloud-Build.

## Wichtige Dateipfade

- `app/` – Expo Router Screens (Tabs: index, admin, settings; Dynamic: plant/[id])
- `src/contexts/PlantContext.tsx` – zentraler State + AsyncStorage-Persistenz
- `src/hooks/useCareStatus.ts` – Ampel-Berechnung (ok / soon / overdue)
- `src/types/plant.ts` – vollständiges Datenmodell (Plant, CareInfo, Disease)
- `src/constants/defaultPlants.ts` – 3 vorinstallierte Musterpflanzen
- `src/i18n/translations.ts` – DE/EN-Strings

## Entscheidungen & Einschränkungen

- **Kein Backend** – alle Daten in AsyncStorage, Plant-IDs sind UUIDs
- **Kein EAS** – APK-Build lokal mit `./gradlew assembleRelease`
- **Kein Force-Push auf main**
- Keystore-Pfad lokal: `~/Documents/Programmierung/Projects/Keystore/`
- `keystore.properties` und `local.properties` niemals einchecken

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
- UUID-basierte Plant-IDs bleiben kompatibel
- JSON-Export-Struktur kompatibel halten

## Aktuelle Abhängigkeiten (Stand 2026-05)

- expo ~56.0.8
- react 19.2.3 / react-native 0.85.3
- expo-router ~56.2.8
- typescript ~6.0.3
