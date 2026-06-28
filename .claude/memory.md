# Safe My Plants – Projekt-Memory

## Was ist das?

Topfpflanzen-Companion-App für Android (React Native + Expo 56, TypeScript).
Offline-first, kein Backend, kein EAS Cloud-Build.

## Wichtige Dateipfade

- `app/` – Expo Router Screens; **kein Tab-Footer mehr**, nur Stack-Navigation
  - `index.tsx` – Hauptscreen (SectionList nach Raum)
  - `add-plant.tsx` – Pflanze hinzufügen (Template-Suche + Raum, kein PIN)
  - `manage-plants.tsx` – Pflanzenliste bearbeiten/löschen (kein PIN)
  - `admin.tsx` – Legacy-Admin mit PinGuard (bleibt erhalten, aber nicht im Hauptpfad)
  - `settings.tsx`, `stats.tsx`, `plant/[id].tsx` – unverändert
- `src/contexts/PlantContext.tsx` – zentraler State + AsyncStorage-Persistenz + CareLog-Writes
- `src/hooks/useCareStatus.ts` – Ampel-Berechnung (ok / soon / overdue)
- `src/hooks/useCareLog.ts` – CareLog CRUD
- `src/types/plant.ts` – Datenmodell inkl. `room?: string` (seit Schema v4)
- `src/types/careLog.ts` – CareAction, CareActionType
- `src/constants/defaultPlants.ts` – 3 vorinstallierte Musterpflanzen
- `src/i18n/translations.ts` – DE/EN-Strings
- `src/components/HeaderMenu.tsx` – ⋮-Menü oben rechts (add-plant / manage-plants / stats / settings)
- `src/components/PlantCard.tsx` – Karte mit Inline-Buttons „💧 Gegossen" / „🌿 Gedüngt"

## Entscheidungen & Einschränkungen

- **Kein Backend** – alle Daten in AsyncStorage; Plant-IDs sind strings (`default-*` für Musterpflanzen, `plant-<timestamp>-<random>` für neue)
- **Kein EAS** – APK-Build lokal mit `./gradlew assembleRelease`
- **Kein Force-Push auf main**
- Keystore liegt lokal (außerhalb des Repos), Pfad via `keystore.properties` – niemals einchecken
- **CareLog** (`smp-carelog`): additiver Store, `lastWatered`/`lastFertilized` bleiben als Schnellzugriff
- **useCareLog Subscriber-Pattern**: module-level Subscribers, `notifyCareLogUpdate()` nach externen Writes aufrufen
- **Kein PinGuard im Standardpfad** (seit Phase D, Issue #72): add-plant und manage-plants ohne PIN; admin.tsx bleibt für PIN-Flows erhalten

## Navigation (seit Issue #72 Phase A)

Kein Tab-Footer mehr. Alle Screens über Stack-Navigation:
- Hauptscreen (`/`) → ⋮-Menü → `/add-plant`, `/manage-plants`, `/stats`, `/settings`
- Pflanzdetail: `router.push('/plant/<id>')`
- Admin (Legacy): über `/admin` erreichbar (noch mit PinGuard)

## AsyncStorage-Keys

| Key | Inhalt |
|-----|--------|
| `smp-plants` | `Plant[]` |
| `smp-admin-pin` | PIN-String |
| `smp-language` | `'de' \| 'en'` |
| `smp-theme` | `'light' \| 'dark' \| 'system'` |
| `smp-carelog` | `CareAction[]` |
| `smp-schema-version` | `number` (aktuell: **4**) |

## Schema-Migrationen

| Von → Nach | Was |
|-----------|-----|
| v1 → v2 | `lastWatered`/`lastFertilized` → CareLog-Einträge |
| v2 → v3 | `photos: string[]` → `photos: PlantPhoto[]` |
| v3 → v4 | `room?: string` hinzugefügt (optional, bestehende Pflanzen = „Ohne Raum") |

## Datenmodell Plant (aktuell)

```typescript
Plant {
  id, name, scientificName?, description
  photos: PlantPhoto[]        // { uri, takenAt }
  location: PlantLocation     // 'sun'|'partial-shade'|'shade'|'indoor'
  room?: string               // Raum/Aufstellort für Gruppierung (seit v4)
  careInfo: CareInfo
  diseases: Disease[]
  lastWatered?, lastFertilized?
  createdAt, updatedAt
}
```

## Branch-Strategie

- `main` – Produktions-Stand
- `testing` – Staging/QA (PRs immer gegen testing)
- `feature/*` – kurzlebig → testing → main

## Ampel-Schwellen

- Grün: > 20 % Intervall verbleibend
- Gelb: 0–20 %
- Rot: überfällig oder nie gegossen/gedüngt

## Offene Phasen aus Issue #72

- **Phase E** – Lokaler Katalog ausbauen (~50–100 Pflanzen, lokalisierbare Namen)
- **Phase F** – Auto-Spracherkennung via `expo-localization` (kein hartkodiertes `'de'`)
- **Phase G** – Design-Tokens aus `theme.ts` konsequent, Dark-Mode-Audit

## Aktuelle Abhängigkeiten (Stand 2026-05)

- expo ~56.0.8
- react 19.2.3 / react-native 0.85.3
- expo-router ~56.2.8
- typescript ~6.0.3
