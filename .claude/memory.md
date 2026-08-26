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
- Block C: Hero-Bereich-Politur (Iconografie-Konsistenz-Audit); Screenshot-Politur (Doku, kein Code)
- Block B1: Widget/Quick-Glance (großer Aufwand, natives Android-Package nötig); Erinnerungen pro Pflanze + Snooze (aktuell nur ein globaler Reminder in `useNotificationScheduler.ts`/`ReminderSettings`, kein Plant-Bezug); Onboarding-Sample-Daten-Auswahl (Grundgerüst existiert, Choice-Dialog fehlt noch)

## Issue #85 – Block C Micro-Animationen ausgerollt (PR #91, gemerged)

Alle verbleibenden `TouchableOpacity`-Stellen auf `AnimatedPressable` umgestellt: `app/settings.tsx`, `app/manage-plants.tsx`, `app/add-plant.tsx`, `src/components/HeroPlantCard.tsx`, `src/components/DashboardSummary.tsx`. `activeOpacity`-Props entfallen (Press-Scale ersetzt das Feedback). Damit haben **alle** primären Touch-Ziele der App konsistentes Press-Feedback – der entsprechende Checklistenpunkt in Issue #85 Block C ist abgehakt.

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
- `jest` + `@types/jest` als devDependencies (seit PR #94, Testing-Setup); `ts-jest` seit PR #118 entfernt (siehe unten)

## Dependabot-Merges 2026-08-09 (PR #98–#106, direkt gegen main)

Alle offenen Dependabot-PRs gemerged, Reihenfolge: erst CI/Actions (unabhängig von npm), dann npm-Gruppe, dann npm-Einzel-Major-Bumps (letztere hatten nach der npm-Gruppe Merge-Konflikte in `package-lock.json` – via `@dependabot rebase`-Kommentar aufgelöst, danach konfliktfrei gemergt):

- #98 `deploy-pages` Action 4 → 5
- #99 `reusable-dev-standards-audit.yml` v1 → v2
- #100 `reusable-security-scan.yml` v1 → v2
- #101 `reusable-gitignore-audit.yml` v1 → v2
- #102 npm minor/patch-Gruppe (10 Updates)
- #103 `expo-notifications` 56.0.15 → 57.0.8
- #104 `@react-native-async-storage/async-storage` 2.2.0 → 3.1.1
- #105 `expo-splash-screen` 56.0.12 → 57.0.5
- #106 `expo-image-picker` 56.0.15 → 57.0.7

**Wichtig:** Diese PRs zielten direkt auf `main` (Dependabot-Branches sind laut `Block feature branches → main`-CI-Check davon ausgenommen, anders als reguläre Feature-Branches). `testing` hat diese Bumps noch **nicht** – beim nächsten `main` → `testing`-Sync bzw. Feature-PR-Rebase auf aktuelle Major-Versionen (Expo 57 statt 56 bei den drei Paketen) achten, ggf. Breaking Changes in `expo-notifications`/`expo-splash-screen`/`expo-image-picker` prüfen.

## Issue #85 – Block A Launch-Blocker, Teil 1 (PR #94, gemerged)

- **`app.json` Android-Permissions bereinigt**: `READ_EXTERNAL_STORAGE`/`WRITE_EXTERNAL_STORAGE` entfernt (veraltet seit Android 13, `expo-image-picker` nutzt den System-Photo-Picker; unnötige Permissions hätten in der Play-Console-Review Rückfragen ausgelöst). Nur noch `android.permission.CAMERA` deklariert.
- **`expo-notifications` als Config-Plugin registriert** (`app.json` → `plugins`, `color: #2D6A4F`). Vorher fehlte der Eintrag, wodurch beim `expo prebuild` die `POST_NOTIFICATIONS`-Permission (Pflicht ab Android 13) nicht ins Manifest kam – die Erinnerungsfunktion (`useNotificationScheduler.ts`) wäre auf aktuellen Android-Versionen nicht zuverlässig nutzbar gewesen.
- **LICENSE korrigiert**: enthielt noch den Copyright-Vermerk der Expo-Boilerplate (650 Industries, Inc.) statt des tatsächlichen Rechteinhabers.
- **Datenschutzerklärung gehostet**: `scripts/build-privacy-page.js` rendert `PRIVACY_POLICY.md` bei jedem GitHub-Pages-Deploy (`deploy.yml`) nach `dist/privacy.html`. Öffentliche URL: `https://s540d.github.io/safe-my-plants/privacy.html`. `docs/store-listing.md` entsprechend aktualisiert, inkl. bisher fehlender EN-Vollbeschreibung.
- **Test-Setup**: `jest.config.js` (ursprünglich Preset `ts-jest`, `testEnvironment: node`), erster Test `src/hooks/useCareStatus.test.ts` (Ampel-Logik, 9 Fälle). `package.json` → `"test": "jest"`. CI (`ci.yml`) führt `npm test -- --ci` jetzt nach dem Typecheck mit aus.
- **Bekannte Lücke**: `ci.yml` triggert nur auf `push`/`pull_request` gegen `main` (`branches: [main]`), läuft also NICHT für PRs gegen `testing` – der Typecheck/Test-Schritt griff bei PR #94 selbst nicht (Merge erfolgte über `mergeability`/`standards-audit`, die auf beide Branches laufen). Nicht in PR #94 behoben, da eigenständige CI-Architektur-Entscheidung.

**Weiterhin offen unter Issue #85 Block A** (siehe Issue für Details): Target-SDK/16-KB-Page-Size-Verifikation nach `expo prebuild`, signierte AAB + Play App Signing, `versionCode`-Strategie, Crash-/Fehler-Robustheit-Smoke-Test, interner Test-Track. Block D (Store-Listing): Feature-Grafik, Screenshots, Data-Safety-Formular, Content-Rating-Fragebogen – reine Play-Console-/Grafik-Aufgaben, kein Code.

## Dependabot-Batch 2026-08-12: TS7-Regression + Fix (PR #116, #118, #106/#108–#115)

Alle 8 zu dem Zeitpunkt offenen Dependabot-PRs (#106, #108–#115: `expo-image-picker`, `expo-splash-screen`, `@react-native-async-storage/async-storage`, `expo-notifications`-Gruppe, `expo-linear-gradient`, `expo-document-picker`, `typescript`, `@expo/cli`, `actions/checkout`, `actions/upload-pages-artifact`, `actions/setup-node`) wurden geprüft und gemerged. Dabei aufgefallen und behoben:

- **PR #113 (`typescript` 6.0.3 → 7.0.2) hat `main` gebrochen**: TS7 ist der neue native (Go-basierte) Compiler und exponiert die alte JS-Compiler-API nicht mehr, auf der `ts-jest` aufbaut → `npm test` schlug fehl (`ts-jest` konnte keine Config erstellen), obwohl `npx tsc --noEmit` selbst weiterhin grün lief. Das blockierte in der Folge auch alle nachfolgenden Dependabot-PRs (geerbter roter `lint-and-typecheck`-Check gegen die kaputte `main`-Basis).
- **Sofort-Fix (PR #116, `hotfix/revert-typescript7`)**: `typescript` zurück auf `~6.0.3` gepinnt, um `main` grün zu bekommen.
- **Struktureller Fix (PR #118, `hotfix/jest-babel-transform`)**: `ts-jest` komplett entfernt. `jest.config.js` nutzt jetzt den eingebauten Babel-Transform (greift auf die vorhandene `babel-preset-expo`-Config zurück, dieselbe wie fürs App-Bundling). Type-Safety bleibt weiterhin über den separaten `npx tsc --noEmit`-Schritt abgedeckt. Verifiziert: `npm test` läuft jetzt sowohl mit `typescript@6.0.3` als auch testweise mit `typescript@7.0.2` grün durch – ein künftiger TS7-Wiederholungsversuch sollte `npm test` nicht mehr brechen.
- **Branch-Namenskonvention gelernt**: Das CI-Gate „Block feature branches → main" blockt Branch-Präfixe `feature/*`, `fix/*`, `claude/*`, `chore/*`, `docs/*` von PRs gegen `main` (müssen gegen `testing`). Einzige Ausnahme: `hotfix/*` darf direkt gegen `main` – dafür wurden #116 und #118 unter `hotfix/…` angelegt (PR #117 unter `fix/…` musste deshalb geschlossen und durch #118 ersetzt werden).
- Dependabot-PRs, die während der Hotfix-Fenster auf einer inzwischen überholten `main`-Basis standen, mussten per `@dependabot rebase`-Kommentar manuell nachgezogen werden, bevor sie mergebar wurden.

## Issue #52 geschlossen (2026-08-12)

Als erledigt geschlossen mit Verweis auf die bereits in PR #83 umgesetzte Lösung (`overrides` für `uuid`/`js-yaml` statt Expo-SDK-Downgrade, siehe oben) – der im Issue vorgeschlagene Lösungsweg (Expo-SDK-Upgrade) wurde nicht gebraucht.

## `testing`/`main`-Divergenz behoben + PR #125 gemerged (2026-08-26)

`testing` war hinter `main` zurückgefallen: mehrere Dependabot-PRs (u. a. #113/#116/#118, der TS7→ts-jest-Fix) waren zwischenzeitlich direkt gegen `main` gemerged worden, ohne zurück nach `testing` zu fließen. `testing` lief dadurch noch mit der alten `ts-jest`-Config.

- **Fix**: `origin/main` in `testing` gemerged (konfliktfrei, reiner Fast-Forward-Content), dadurch `jest.config.js`-Babel-Transform-Fix und alle vorher auf `main` verifizierten Dependency-Bumps auch auf `testing` verfügbar.
- **PR #125** (`typescript` 6.0.3 → 7.0.2 erneut, plus 8 weitere Minor/Patch-Bumps) zielte ursprünglich auf `main` – gegen Workflow-Regel umgebogen auf `testing`. Nach Rebase auf aktualisiertes `testing` blieben 2 TS-Fehler durch geänderte RN/Expo-Typings: `FlatList`'s `ListHeaderComponent`/`ListEmptyComponent` akzeptieren jetzt kein `null` mehr (nur `undefined`), `ViewToken.index` ist jetzt `number | undefined` statt `number | null`. Beide lokal in `app/add-plant.tsx` und `src/components/PhotoGalleryModal.tsx` behoben, dann gemerged.
- **Bekannte CI-Lücke bestätigt** (siehe oben, PR #94): `pull_request`-Trigger in `ci.yml` läuft nur gegen `main`, nicht gegen `testing` – bei PR #125 mussten Typecheck/Tests/Prettier deshalb lokal verifiziert werden, da GitHub für den `testing`-Zielbranch keinen `lint-and-typecheck`-Check erzeugt hat. Weiterhin nicht behoben, eigenständige CI-Architektur-Entscheidung.
- **Lektion**: Vor jedem Merge eines an `main` hängenden Dependabot-PRs erst prüfen, ob `testing` überhaupt aktuell ist (`git log testing..main`) – sonst drohen stille Regressionen wie die TS7/ts-jest-Inkompatibilität erneut unbemerkt via `testing` reinzukommen.
