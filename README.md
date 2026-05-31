# Safe My Plants 🌿

Eine Topfpflanzen-Companion-App für Android. Pflegehinweise, Gieß- und Düngeampel, Krankheitsbilder und Fotos – alles offline, kein Backend.

## Features

- **Pflanzenübersicht** – alle Pflanzen auf einen Blick mit Ampel-Status
- **Ampel-System** – zeigt an, wann Gießen oder Düngen fällig ist
- **Detailansicht** – Pflegetipps, Fotos, Standort- und Klimabedarf
- **Krankheitsbilder** – Symptome und Behandlungshinweise je Pflanze
- **Admin-Bereich** – PIN-geschützt; Pflanzen anlegen, bearbeiten, löschen
- **Mehrsprachig** – Deutsch und Englisch
- **Offline-first** – alle Daten lokal gespeichert, kein Account nötig

## Tech Stack

| Technologie | Version |
|---|---|
| React Native + Expo | 56 |
| Expo Router | ~56.2 |
| TypeScript | ~6.0 |
| AsyncStorage | 2.2 |

## Projektstruktur

```
safe-my-plants/
├── app/          # Expo Router Screens (Tabs + Detailansicht)
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── types/
│   ├── constants/
│   ├── services/
│   └── i18n/
└── assets/
```

## Entwicklung starten

**Voraussetzungen:** Node.js ≥ 18, npm, Expo Go App oder Android-Emulator

```bash
git clone https://github.com/s540d/safe-my-plants.git
cd safe-my-plants
npm install
npx expo start
```

QR-Code mit Expo Go scannen oder `a` für Android-Emulator.

## Android-Build (lokal)

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleDebug     # Debug APK
./gradlew assembleRelease   # Release APK
```

## Lizenz

Siehe [LICENSE](LICENSE).
