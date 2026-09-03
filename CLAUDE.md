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
- react-native-reanimated (Micro-Animationen: Karten-Eintritt, Press-Feedback via `AnimatedPressable`)

## Dependency-Pflege

- `npm audit` regelmäßig prüfen. Wenn Vulnerabilities nur in transitiven Build-Tooling-Deps
  stecken (z. B. `@expo/cli` → `xcode`/`@expo/xcpretty`), **kein** SDK-Downgrade – stattdessen
  `overrides` in `package.json` auf die gepatchte Version pinnen (siehe `uuid`, `js-yaml`).
  Vor dem Pinnen prüfen, ob App-Code das Paket direkt importiert.

### Checkliste vor jedem neuen `overrides`-Eintrag

1. **Modulformat prüfen** – wechselt die gepatchte Version von CommonJS zu ESM?
   ```bash
   npm view <paket>@<version> type exports
   ```
   `type: "module"` bei einem Konsumenten, der per `require()` lädt, ist ein **stiller
   Runtime-Breaker**: `npm audit`, `tsc` und Jest laufen grün durch, die App bricht erst zur
   Laufzeit. Gegenprobe nach `npm install`:
   ```bash
   node -e "const m=require('<konsument>'); /* typischen Aufruf ausführen */"
   ```

2. **Override so eng wie möglich scopen.** Nicht global pinnen, wenn nur ein Konsument betroffen
   ist – sonst werden unbeteiligte Pakete über Major-Grenzen gehoben:
   ```jsonc
   "overrides": { "plist": { "@xmldom/xmldom": "^0.9.12" } }
   ```
   Vorher prüfen, welche Konsumenten überhaupt in der Advisory-Range liegen (`npm ls <paket>`).

3. **Lockfile gegenprüfen.** Ein `^`-Range garantiert keine gepatchte Version – das Lockfile kann
   auf einer älteren, im Range liegenden Version einfrieren (so geschehen bei `js-yaml` 4.3.0,
   PR #140). Nach `npm install` prüfen, welche Version tatsächlich aufgelöst wurde.

4. **Nicht jede Advisory ist den Fix wert.** Ein Runtime-Breakage in der App wiegt schwerer als
   eine moderate DoS-Advisory in einer reinen Build-/Dev-Kette. Bewusste Nicht-Fixes als
   Kommentar über dem `overrides`-Block festhalten, inklusive der Bedingung, unter der der Fix
   wieder möglich wird.

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

> Die `/build-android`-Skill deckt dieses Projekt **nicht** ab (bricht in Schritt 1 mit
> „Nicht in einem bekannten Android-Projektverzeichnis" ab). Der Ablauf hier ist maßgeblich.

Reihenfolge: Version prüfen → Prebuild → **Signing injizieren** → Build → Fingerprint prüfen → Archivieren → Upload → Tag.

### 1. versionCode prüfen (vor dem Build)

Ein im Play Store verbrauchter `versionCode` kann **nie erneut** hochgeladen werden – Play lehnt
den Upload ab. Vor jedem Build in `app.json` hochzählen, auch wenn `version` gleich bleibt
(reiner Bugfix-Build):

```jsonc
// app.json – beide Felder liegen unter "expo"
{ "expo": {
    "version": "1.0.0",                 // nur bei nutzersichtbaren Änderungen anheben
    "android": { "versionCode": 2 }     // bei JEDEM Upload +1
} }
```

Der Bump gehört als eigener Commit ins Repo, bevor gebaut wird – nicht nur in den lokalen
`/android`-Ordner (der ist gitignored und wird beim nächsten Prebuild überschrieben).

### 2. Prebuild

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"

npx expo prebuild --platform android --clean
```

Erzeugt den `/android`-Ordner (nicht eingecheckt, in `.gitignore`).

### 3. Keystore & Signing

Keystore: `/Users/svenstrohkark/Documents/Programmierung/Projects/Keystore/safe_my_plants.jks`
Credentials (Alias, Passwörter): `docs/private/CLAUDE.md` – gitignored, **niemals einchecken**.

Neuen Keystore anlegen (nur beim allerersten Mal – ein Austausch macht Play-Updates unmöglich):
```bash
keytool -genkey -v -keystore safe_my_plants.jks \
  -alias safemyplants -keyalg RSA -keysize 2048 -validity 10000
```

> **⚠️ Fallstrick – bei JEDEM Release erneut:**
> `expo prebuild` generiert nur `signingConfigs.debug` und setzt den **release**-BuildType
> ebenfalls darauf. Ohne Eingriff entsteht ein mit dem **Debug-Key** signierter AAB, den Play
> ablehnt. Der Build läuft dabei **erfolgreich durch** (`BUILD SUCCESSFUL`, `signReleaseBundle`
> ausgeführt) – der Fehler fällt erst beim Upload auf, nach ~6 Minuten Buildzeit.
> Da `/android` gitignored ist und bei jedem Prebuild neu entsteht, muss der Eingriff jedes Mal
> wiederholt werden.

**a)** In `android/app/build.gradle` den `signingConfigs`-Block ergänzen:

```gradle
signingConfigs {
    debug { /* ... unverändert ... */ }
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}
```

**b)** Im `release`-BuildType `signingConfigs.debug` → `signingConfigs.release` ändern.

**c)** Werte in `android/gradle.properties` reinreichen (`/android` ist gitignored, die Secrets
bleiben damit außerhalb von Git):

```properties
MYAPP_UPLOAD_STORE_FILE=/…/Keystore/safe_my_plants.jks
MYAPP_UPLOAD_STORE_PASSWORD=…
MYAPP_UPLOAD_KEY_ALIAS=safemyplants
MYAPP_UPLOAD_KEY_PASSWORD=…
```

> **Secrets nie ausgeben.** Werte per Skript direkt aus `docs/private/CLAUDE.md` nach
> `gradle.properties` schreiben, ohne sie vorher anzuzeigen – kein `cat` der Datei. Passwörter
> auch nie als CLI-Argument übergeben (landen in Shell-History und Prozessliste).

### 4. Build

```bash
cd android
./gradlew bundleRelease --no-daemon --console=plain   # Release AAB (~6 min)
./gradlew assembleRelease                             # Release APK
./gradlew assembleDebug                               # Debug APK
```

AAB-Output: `android/app/build/outputs/bundle/release/app-release.aab`
APK-Output: `android/app/build/outputs/apk/`

### 5. Signatur prüfen (Pflicht vor jedem Upload)

Play lehnt ein Update ab, wenn der Signer-Fingerprint vom vorherigen Upload abweicht. Der
Vorgänger-AAB liegt für genau diesen Vergleich in `aab-archive/`:

```bash
SIG=$(unzip -Z1 <aab> "META-INF/*.RSA" | head -1)
unzip -p <aab> "$SIG" | keytool -printcert | grep -E "Owner|Eigentümer|SHA256"
```

Erwartet: `CN=Safe My Plants` mit SHA256 `30:24:05:51:26:3D:F3:98:…`
Weicht der Fingerprint ab, wurde mit dem Debug-Key signiert (siehe Fallstrick in Schritt 3) –
**nicht hochladen**, Signing-Config korrigieren und neu bauen.

### 6. Archivieren & Upload

AAB nach `aab-archive/` kopieren (gitignored), Schema
`SafeMyPlants-v<version>-vc<versionCode>-<YYYY-MM-DD>.aab`, **max. 2 Dateien** behalten.

Nach erfolgreichem Play-Store-Upload den Git-Tag setzen – erst danach, damit der Tag immer
einen tatsächlich veröffentlichten Stand markiert:

```bash
git tag -a v<version> -m "…" && git push origin v<version>
```

Bleibt `version` bei einem reinen versionCode-Bump unverändert, kollidiert der Tag mit dem
vorherigen Release. Bisherige Ausnahme: `v1.0.0-vc2` (2026-09-03). **Regelfall bleibt
`vX.Y.Z`** – bei erneutem Bedarf `version` mit anheben, statt das Ausnahme-Schema zu verstetigen.

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

### Ad-hoc / Maintenance

| Issue | Feature | Status |
|-------|---------|--------|
| #52 | npm audit fix (uuid/js-yaml via `overrides`, kein SDK-Downgrade) | ✅ merged (PR #83) |
| #77 | UI-Verbesserung / Micro-Animationen (Karten-Eintritt, Press-Feedback, `AnimatedPressable`) | ✅ merged (PR #82, #83) |

## Spätere Zusammenführung mit Pflanzkalender

- Gleiche `PlantLocation`-Typen
- Plant-IDs als UUIDs (universal)
- JSON-Export-Struktur kompatibel haltbar
- CareLog-Einträge enthalten `plantId` als UUID → direkt portierbar

<!-- GLOBAL POLICY:START -->
## [GLOBAL POLICY]

> Automatisch synchronisiert aus project-templates (Issue #7). Nicht manuell editieren –
> Änderungen hier werden beim nächsten Sync überschrieben. Quelle anpassen statt lokal.

- PRs immer gegen `testing`, nie direkt gegen `staging` oder `main`
- Merge auf `main` nur mit expliziter schriftlicher Freigabe
- `--delete-branch` nur für Feature-Branches (nie staging/testing)
- **Lokales Branch-Cleanup:** `main` und `testing` NIE löschen — auch nicht beim Bulk-Delete verwaister `[gone]`-Branches. Ein fehlender `origin/main`/`origin/testing` ist ein **wiederherzustellender Defekt** (lokal behalten, nach origin zurückpushen), kein Aufräum-Signal.
- `--no-verify` nur auf explizite Bitte
- **Vor jedem Push: lokale Tests ausführen** (`npm test` bzw. projektspezifischer Test-Befehl) – kein Push ohne grüne lokale Tests
- **Kein Merge bei CI-Fail** – Branch Protection erzwingt das technisch; nie mit `--admin` umgehen außer auf explizite Bitte

## [ANDROID BUILD – PFLICHTREGELN]

- **Git-Tag** nach jedem Play-Store-Upload setzen: `git tag vX.Y.Z && git push origin vX.Y.Z` – der Tag markiert den tatsächlich veröffentlichten Stand und dient als Changelog-Baseline für den nächsten Build
- **EAS Local Build (DrawFromMemory):** Workingdir vor jedem Build leeren: `rm -rf ~/tmp/eas-build && mkdir -p ~/tmp/eas-build` – ein nicht-leeres Verzeichnis bricht den Build sofort ab
- **Disk-Check vor EAS Build:** Skia-Libraries benötigen ~5–8 GB. Bei < 5 GB frei: `npm cache clean --force && rm -rf ~/.npm/_npx` (~13 GB, sicher löschbar)
- **JAVA_HOME** für EAS/Expo-Builds explizit auf Android Studio JBR setzen: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`
- **Gradle-Lock nach Absturz:** Bei "Cannot lock file hash cache"-Fehler Daemons stoppen: `pkill -f GradleDaemon`, dann Workingdir leeren und neu starten
- **AAB-Archiv:** Gebaute Release-AABs in einem **gitignored** `aab-archive/`-Verzeichnis im Repo-Root ablegen (in `.gitignore` aufnehmen – AABs sind 3–110 MB und gehören nie in die Git-History). Benennung: `<Projekt>-vX.Y.Z-vc<versionCode>-YYYY-MM-DD.aab`. **Retention: max. 2 Dateien** (aktuelles Release + ein Vorgänger für schnelles Rollback); ältere AABs löschen. Der Git-Tag `vX.Y.Z` ist die eigentliche Release-Baseline – ältere AABs lassen sich daraus jederzeit neu bauen.

## [CI – CACHE-CLEANUP]

- **Cache-Cleanup-Workflow** (`.github/workflows/cache-cleanup.yml`) in jedem Repo mit GitHub-Actions-Caches: löscht wöchentlich (So 03:00 UTC) bzw. on-demand alle Action-Caches älter als der jeweils letzte Lauf. GitHub-Limit ist 10 GB pro Repo – ohne Cleanup laufen Build-Caches (node_modules, Gradle, Expo) voll und verdrängen frische Einträge. Vorlage: `cache-cleanup.yml` in project-templates.
<!-- GLOBAL POLICY:END -->
