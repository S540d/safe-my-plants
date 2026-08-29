# Architecture — Safe My Plants

## Overview

Offline houseplant companion: per-plant care tracking with a traffic-light
indicator for watering and fertilizing, care history, disease reference photos
and Android reminders. One Expo codebase targets Android (Play Store) and the
web. No account, no backend — all data stays on the device.

```
Plant added (template or custom)
        ↓
PlantContext            (state, CRUD)
        ↓
storage.ts              (AsyncStorage, versioned schema)
        ↓
useCareStatus           (ok / soon / overdue traffic light)
        ↓
Dashboard + useNotificationScheduler (Android reminders)
```

## Directory Structure

Routing is file-based via `expo-router` — files in `app/` are routes; the
implementation lives in `src/`.

```
/                          # Repo root
├── app/                   # expo-router routes
│   ├── _layout.tsx        #   root layout, providers
│   ├── index.tsx          #   dashboard
│   ├── plant/             #   plant detail routes
│   ├── add-plant.tsx, manage-plants.tsx, stats.tsx,
│   │   settings.tsx, onboarding.tsx
│   ├── admin.tsx          #   PIN-guarded template editor
│   └── +html.tsx          #   web-only document head (SEO, meta)
├── src/
│   ├── contexts/PlantContext.tsx   # the app's core store
│   ├── hooks/
│   │   ├── useCareStatus.ts        #   traffic-light computation
│   │   ├── useCareLog.ts, useStreak.ts, useOverdueCount.ts
│   │   ├── useNotificationScheduler.ts
│   │   └── usePreferences.ts, useThemeColors.ts
│   ├── services/
│   │   ├── storage.ts              #   AsyncStorage + schema version
│   │   └── exportImport.ts         #   backup / restore
│   ├── types/plant.ts, careLog.ts
│   ├── constants/                  #   plantTemplates, theme
│   ├── components/, i18n/, utils/
├── public/                # PWA assets
├── scripts/               # Build/release helpers
└── docs/                  # Project documentation
```

## Key Decisions

### Traffic light = worst of watering and fertilizing

`useCareStatus.ts` computes each care type independently from
`last<Action>` + `careInfo.<action>FrequencyDays`:

- no date recorded at all → `overdue`
- interval elapsed → `overdue`
- less than **20 %** of the interval remaining → `soon`
- otherwise → `ok`

The plant's overall status is the _worst_ of the two (`worstStatus`). If you
change the 20 % threshold, the dashboard, the badge counts and the notification
timing all shift together — it is the single tuning knob for the whole UX.

Note that `useCareStatus` (hook) and `getCareStatus` (plain function) contain the
same logic for use inside and outside React; keep them in sync.

### No backend, no account

Everything is in `AsyncStorage` under `smp-*` keys. Keeps the app usable offline
and avoids handling user data on a server. Consequence: no cross-device sync;
`exportImport.ts` (manual backup/restore) is the only way to move data.

### Versioned storage schema

`storage.ts` keeps `smp-schema-version` (default `1`). Any change to the shape of
persisted plants or care logs needs a migration keyed on that version — otherwise
existing installs break on upgrade.

### Reminders are Android-only

`useNotificationScheduler.ts` returns early when `Platform.OS !== 'android'`.
The web build deliberately has no reminders (no reliable background scheduling),
so the traffic light is the only status signal there. Do not assume notification
code runs on web.

### Admin area behind a PIN

`app/admin.tsx` edits the built-in plant templates and is guarded by a 4-digit
PIN stored in `smp-admin-pin`. This is a **UI guard against accidental edits by
children, not a security boundary** — the PIN sits in plain AsyncStorage.

### Plant templates as data

`src/constants/plantTemplates.ts` holds the predefined plants with their care
intervals and disease info. Adding a plant type means editing that data, not
writing screens.

## Data Flow

### Logging care

```
Plant detail → PlantContext.logCare()
  → careLog entry + plant.lastWatered / lastFertilized updated
  → storage.ts persists (AsyncStorage)
  → useCareStatus recomputes → dashboard colour, overdue count, streak
  → useNotificationScheduler reschedules (Android)
```

### Backup

```
exportImport.export() → JSON file (expo-sharing)
exportImport.import() → validation → PlantContext → storage.ts
```

## Environments

| Environment  | URL / Target                            | Build                        |
| ------------ | --------------------------------------- | ---------------------------- |
| Web          | https://s540d.github.io/safe-my-plants/ | `expo export --platform web` |
| Play Store   | `io.github.s540d.safemyplants`          | EAS / Gradle build           |
| Local web    | Expo dev server (port printed on start) | `npm run web`                |
| Local native | Android/iOS device or emulator          | `npm run android` / `ios`    |

## Testing & Tooling

Jest (`jest.config.js`), tests co-located (e.g. `useCareStatus.test.ts`).
`npm run typecheck` runs `tsc --noEmit`; Prettier covers `src/` and `app/`.
Husky runs the pre-commit checks.
