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
  - `settings.tsx`, `stats.tsx`, `plant/[id].tsx` – seit PR #87 über `useThemeColors()` (Dark-Mode-fähig, siehe Issue #85 Block C)
- `src/contexts/PlantContext.tsx` – zentraler State + AsyncStorage-Persistenz + CareLog-Writes
- `src/hooks/useCareStatus.ts` – Ampel-Berechnung (ok / soon / overdue)
- `src/hooks/useCareLog.ts` – CareLog CRUD
- `src/types/plant.ts` – Datenmodell inkl. `room?: string` (seit Schema v4)
- `src/types/careLog.ts` – CareAction, CareActionType
- `src/constants/defaultPlants.ts` – 3 vorinstallierte Musterpflanzen
- `src/i18n/translations.ts` – DE/EN-Strings
- `src/components/HeaderMenu.tsx` – ⋮-Menü oben rechts (add-plant / manage-plants / stats / settings), Trigger + Einträge über `AnimatedPressable` (seit PR #83)
- `src/components/PlantCard.tsx` – Karte mit Inline-Buttons „💧 Gegossen" / „🌿 Gedüngt", Press-Scale + gestaffelte Eintritts-Animation (Reanimated)
- `src/components/QuickActionBar.tsx` – Aktionsleiste im Plant-Detail (water/fertilize/repot/prune/note), Press-Scale-Buttons, `onWater`/`onFertilize`-Callbacks
- `src/components/WaterDropAnimation.tsx`, `src/components/CareConfetti.tsx` – Reanimated-Effekte, ausgelöst über `QuickActionBar`-Callbacks im Plant-Detail-Screen (seit PR #82)
- `src/components/EmptyState.tsx` – wiederverwendbarer Leerzustand mit Fade-/Zoom-Eintrittsanimation, genutzt in `index.tsx` und `manage-plants.tsx`
- `src/components/AnimatedPressable.tsx` – wiederverwendbarer Press-Scale-Wrapper (Reanimated `withTiming`, `Pressable`-basiert, optionaler `hitSlop`); genutzt in `HeaderMenu` und `app/plant/[id].tsx` (Header-Foto, Zurück-Button). `PlantCard`/`QuickActionBar` nutzen weiterhin ihre eigene inline `useSharedValue`-Variante aus PR #82 (nicht rückwirkend migriert, kein funktionaler Unterschied). **Noch nicht migriert** (Issue #85 Block C, offen): `settings.tsx`, `manage-plants.tsx`, `add-plant.tsx`, `HeroPlantCard`, `DashboardSummary` nutzen weiterhin reines `TouchableOpacity`.
- `src/constants/theme.ts` – seit PR #90 zusätzlich `Typography`-Tokens (`headerTitle` 28/700, `headerTitleSm` 22/700), genutzt für die Header-Titel in `index.tsx`/`settings.tsx`/`add-plant.tsx`/`manage-plants.tsx`. Kein Typografie-Token für Body-/Label-Text (nur Header bisher konsolidiert).
- `src/services/exportImport.ts` – Export/Import (Issue #15) via `expo-sharing`/`expo-document-picker`; seit PR #90 prüft `importData()` `smpSchemaVersion` im Backup (fehlend/ungültig → `invalid_format`, höher als lokale `SCHEMA_VERSION` → `unsupported_version`, eigene Fehlermeldung in `settings.tsx`)
- `docs/store-assets/icon-512.png` – 512×512-Play-Store-Icon, aus `assets/icon.png` (1024×1024) abgeleitet (seit PR #90); referenziert in `docs/store-listing.md`

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
| `smp-schema-version` | `number` (aktuell: **5**) |
| `smp-reminders` | `ReminderSettings` (`{ enabled, time }`, Default aus) |

## Schema-Migrationen

| Von → Nach | Was |
|-----------|-----|
| v1 → v2 | `lastWatered`/`lastFertilized` → CareLog-Einträge |
| v2 → v3 | `photos: string[]` → `photos: PlantPhoto[]` |
| v3 → v4 | `room?: string` hinzugefügt (optional, bestehende Pflanzen = „Ohne Raum") |
| v4 → v5 | Bestandspflanzen ohne Foto bekommen Template-Bild (Name-Match gegen `PLANT_TEMPLATES`) |

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

## Issue #72 – abgeschlossen

Alle Phasen A–G sind gemerged, Issue geschlossen. Nachfolge-Arbeit läuft über eigenständige Issues.

## Issue #77 – UI-Verbesserung (laufend)

PR #82 (gemerged in `testing`) hat einen ersten Schub Micro-Animationen umgesetzt:
- `WaterDropAnimation`/`CareConfetti` waren seit ihrer Einführung nie ausgelöst (dead code) – jetzt über `QuickActionBar`-Callbacks im Plant-Detail-Screen live
- Press-Scale-Feedback (Reanimated `withSpring`) auf `PlantCard` + Aktions-Buttons + `QuickActionBar`
- Gestaffelte Listen-Eintrittsanimation (`FadeInDown`) in `app/index.tsx`
- `EmptyState` animiert (Fade+Zoom), jetzt auch auf dem Hauptscreen genutzt

**Wichtige Lektion:** Reanimated wirft eine Warnung, wenn ein `entering`-Layout-Animation und ein manueller `useAnimatedStyle`-Transform (z. B. Press-Scale) auf demselben `Animated.View`-Node liegen – beide konkurrieren um `transform`. Lösung: zwei verschachtelte `Animated.View`s (äußere für `entering`, innere für den manuellen Transform).

PR #83 hat die restlichen statischen Touch-Ziele ergänzt (⋮-Menü-Trigger/-Einträge, Plant-Detail Header-Foto + Zurück-Button) über die neue `AnimatedPressable`-Komponente. Damit sind alle primären Touch-Ziele in Haupt- und Detail-Screen mit Press-Feedback versehen – Issue #77 ist inhaltlich erledigt und wurde auf GitHub geschlossen.

Der zuvor hier notierte Dark-Mode-Rückstand (`app/plant/[id].tsx`, `app/settings.tsx`, `app/stats.tsx` mit hardcodierten Hex-Farben) ist über PR #87 (Issue #85 Block C) behoben, siehe unten.

## Issue #85 – Play-Store-Launch-Plan, Block C „Optische Verbesserungen" (PR #87, gemerged)

- **Dark-Mode-Audit abgeschlossen**: `app/plant/[id].tsx`, `app/settings.tsx`, `app/stats.tsx` nutzen jetzt `useThemeColors()` statt hardcodierter Hex-Farben; wiederkehrende Card-Schatten auf `Shadow.cardSm`/`Shadow.menu` konsolidiert.
- **Splash-Screen**: `expo-splash-screen` als Dependency ergänzt, als Config-Plugin in `app.json` verdrahtet (`backgroundColor: #2D6A4F`, Dark-Variante `#0D1F17`, Bild `assets/splash-icon.png`). Vorher war kein Splash-Screen konfiguriert.
- **App-Icon/Adaptive-Icon**: geprüft, bereits store-tauglich (1024×1024 / 512×512 / 432×432, Markenfarbe als Adaptive-Icon-Hintergrund) – kein Änderungsbedarf.
- **Nicht Teil von PR #87** (bleibt offen unter Issue #85 Block C): Screenshot-Politur fürs Store-Listing – erfordert reale Gerätescreenshots, kein Code-Task.

## Issue #85 – Block C/B1 Quick-Wins (PR #90, gemerged)

Erste Teil-Umsetzung der übrigen Block-C- und B1-Punkte (nach PR #87):
- **Typography-Tokens**: neues `Typography`-Objekt in `theme.ts`, 4 duplizierte `headerTitle`-Styles darauf umgestellt (siehe Dateipfade oben).
- **Hex-Farben-Prüfung**: die vermuteten „hardcodierten Hex-Farben" in `plant/[id].tsx` (Foto-Overlay-Text) und den Header-Titeln (`#fff` auf Gradient) sind **bewusst korrekt** – Overlay sitzt auf fixem `rgba(0,0,0,x)`-Scrim, Gradient-Hintergründe (`gradientStart`/`gradientEnd`) sind in beiden Themes dunkel genug für weißen Text. Kein Fix nötig, keine weitere Aktion hier offen.
- **512×512-Store-Icon** (Play-Console-Listing-Icon, nicht zu verwechseln mit den Adaptive-Icon-Assets aus PR #87): erstellt unter `docs/store-assets/icon-512.png`, `docs/store-listing.md`-Statustabelle aktualisiert.
- **Backup-Robustheit** (B1): Schema-Versions-Check beim Import, siehe `exportImport.ts` oben.

**Noch offen unter Issue #85** (bewusst zurückgestellt, siehe PR-#90-Beschreibung):
- Block C: Micro-Animationen konsequent auf alle verbleibenden `TouchableOpacity`-Stellen (`settings.tsx`, `manage-plants.tsx`, `add-plant.tsx`, `HeroPlantCard`, `DashboardSummary`) ausrollen; Hero-Bereich-Politur; Screenshot-Politur (Doku, kein Code)
- Block B1: Widget/Quick-Glance (großer Aufwand, natives Android-Package nötig); Erinnerungen pro Pflanze + Snooze (aktuell nur ein globaler Reminder in `useNotificationScheduler.ts`/`ReminderSettings`, kein Plant-Bezug)

## Issue #52 – npm audit fix (erledigt, PR #83)

`npm audit` zeigte 12 moderate Vulnerabilities, alle über `@expo/cli` → `xcode` (uuid <11.1.1) bzw. `@expo/xcpretty` (js-yaml 4.0.0–4.1.1) – reine Build-Tooling-Deps (Xcode-Projektgenerierung), keine App-Laufzeit-Abhängigkeiten. Die in der Advisory vorgeschlagenen "fixes" (Downgrade auf expo 46 / expo-sharing 14) waren Fehlinterpretationen von `npm audit --force` auf bereits sehr viel neueren Versionen.
**Lösung:** `overrides` in `package.json` (`uuid: ^11.1.1`, `js-yaml: ^4.2.0`) statt SDK-Downgrade. Kein App-Code importiert `uuid` direkt. `npm audit` → 0 Vulnerabilities, `npx tsc --noEmit` und `npx expo export -p web` weiterhin grün.

## Aktuelle Abhängigkeiten (Stand 2026-07)

- expo ~56.0.8
- react 19.2.3 / react-native 0.85.3
- expo-router ~56.2.8
- typescript ~6.0.3
- react-native-reanimated ~4.4.1 + react-native-worklets ~0.9.1 (Babel-Plugin `react-native-reanimated/plugin` muss letztes Plugin in `babel.config.js` sein)
- expo-haptics ~56.0.3
- expo-splash-screen ~56.0.12 (seit PR #87, Config-Plugin in `app.json`)
- `overrides`: `uuid@^11.1.1`, `js-yaml@^4.2.0` (patcht transitive Build-Tooling-Deps von `@expo/cli`, seit PR #83)
