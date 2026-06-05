# Safe My Plants 🌿

An Android companion app for houseplants. Care tips, watering and fertilizing indicators, disease images, and photos — all offline, no backend required.

## Live

**[Try the app →](https://s540d.github.io/safe-my-plants)**

[![Play Store](https://img.shields.io/badge/Google_Play-Download-green?logo=google-play)](https://play.google.com/store/apps/details?id=io.github.s540d.safemyplants)

## Features

- **Plant overview** – all plants at a glance with status indicators
- **Traffic light system** – shows when watering or fertilizing is due
- **Detail view** – care tips, photos, location and climate requirements
- **Disease images** – symptoms and treatment notes per plant
- **Admin area** – PIN-protected; create, edit, delete plants
- **Multilingual** – German and English
- **Offline-first** – all data stored locally, no account required

## Tech Stack

| Technology | Version |
|---|---|
| React Native + Expo | 56 |
| Expo Router | ~56.2 |
| TypeScript | ~6.0 |
| AsyncStorage | 2.2 |

## Setup

**Prerequisites:** Node.js ≥ 18, npm, Expo Go app or Android emulator

```bash
git clone https://github.com/s540d/safe-my-plants.git
cd safe-my-plants
npm install
npx expo start
```

Scan the QR code with Expo Go or press `a` for Android emulator.

## Android Build (local)

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleDebug     # Debug APK
./gradlew assembleRelease   # Release APK
```

## Project Structure

```
safe-my-plants/
├── app/          # Expo Router screens (tabs + detail view)
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

## License

See [LICENSE](LICENSE).
