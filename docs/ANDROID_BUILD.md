# Android-Build (lokal, kein EAS) – Detailablauf

> Ausgelagert aus `CLAUDE.md` (Issue #160, 300-Zeilen-Regel). Die verbindlichen Kurzregeln stehen dort; hier der vollständige Ablauf.

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
>
> **Auch das Auslesen selbst ist tabu**, nicht nur die Weitergabe: `docs/private/CLAUDE.md` niemals per
> `cat`/`Read`/Editor öffnen, wenn Secrets nur *verwendet* werden sollen. Werte gezielt per Skript
> (`grep`/`sed`) direkt in `gradle.properties` übertragen (Auslöser: Issue #164, siehe `docs/private/INCIDENTS.md`).

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
