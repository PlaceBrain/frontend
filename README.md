# frontend

> Vue 3 SPA for PlaceBrain — places, devices, live telemetry, alerts.

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)
![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)

The web client for PlaceBrain. It talks REST to the gateway for CRUD and Auth, and subscribes over MQTT-over-WebSocket for live telemetry and alerts. The design is minimalist, theme-aware (light/dark), and laid out for both desktop (left sidebar) and mobile (bottom navbar).

## Role in PlaceBrain

PlaceBrain is an open-source IoT platform for smart buildings. See the [organization profile](https://github.com/PlaceBrain) for the full architecture.

- Talks only to [gateway](https://github.com/PlaceBrain/gateway) over HTTP (`VITE_API_URL`, proxied by Traefik on `/api/*`).
- Fetches short-lived MQTT credentials from `POST /api/mqtt/credentials` and connects to EMQX over WebSocket (`/mqtt`).
- Subscribes to `placebrain/{placeId}/device/{deviceId}/telemetry` and `placebrain/{placeId}/alerts` for live updates.

## Tech stack

- Vue 3, TypeScript, Vite
- [TanStack Query v5](https://tanstack.com/query/latest) for server state
- [Pinia](https://pinia.vuejs.org/) for UI state
- [Axios](https://axios-http.com/) — Bearer token + 401 → refresh → retry interceptor
- [mqtt.js](https://github.com/mqttjs/MQTT.js) — realtime
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [lucide-vue-next](https://lucide.dev/) icons, [uplot](https://github.com/leeoniya/uPlot) charts
- ESLint 9 + Prettier, `vue-tsc` type-check

## Structure (Feature-Sliced Design)

```
src/
├── app/          Providers (router, pinia, TanStack Query), layouts, global styles
├── pages/        Login, Register, VerifyOtp, Dashboard, Places, PlaceDetail,
│                 Devices, DeviceDetail, DeviceEditor, SensorEditor, Alerts, Profile
├── widgets/      Sidebar, MobileNavbar, PlaceTabs, SensorsPanel, ActuatorsPanel,
│                 ChartsPanel, PlaceCardGrid
├── features/     Auth forms, CRUD modals, manage-devices/sensors/actuators, theme toggle
├── entities/     user, place, device, member (types, TanStack Query hooks, UI)
└── shared/       UI kit (UiButton, UiInput, UiModal, UiConfirmDialog, UiOtpInput, ...),
                  API client, query keys, composables (useMqtt, useBreakpoint), stores, config
```

## Design language

- Light/dark themes via CSS variables + `dark` class on `<html>`.
- Minimalist, no gradients. Accent `#6E9EF9`, danger `#E85A4F`.
- Inter for body, Space Grotesk for headings (`font-heading` class).
- Colors are referenced **only** through `var(--color-*)`; hardcoded Tailwind palette classes are avoided.
- Surface convention: `--color-surface` for cards/sidebars/modals, `--color-surface-elevated` for the page background. Cards always stand out from the background.

## UX conventions

- Destructive actions go through `<UiConfirmDialog>`, never native `confirm()`.
- Post-mutation feedback via `useToast()` on authenticated pages; inline on auth pages (login/register/verify-otp).
- Icon-only buttons carry an `aria-label`. Modals are `role="dialog"` with focus trap.
- Breakpoint 768px: desktop sidebar (`w-64` / `w-16` collapsed, toggle via `Cmd/Ctrl+B`), mobile bottom navbar (`h-16`).
- Auth flow: register → OTP email verification → login. Unverified users are redirected to `/verify-otp`.

## Local development

**Full stack (recommended):** clone [infra](https://github.com/PlaceBrain/infra) and run `make dev`. The frontend is served by a Vite dev container behind Traefik; the SPA lives at `http://localhost`.

**Service-only mode:**

```bash
npm install
cp .env.example .env          # set VITE_API_URL
npm run dev
```

You still need a reachable gateway at `VITE_API_URL`.

## Scripts

```bash
npm run dev         # Vite dev server
npm run build       # vue-tsc -b + vite build
npm run preview     # serve production build
npm run lint:fix    # ESLint autofix
npm run format      # Prettier
npx vue-tsc -b      # standalone type-check (also run by CI)
```

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the gateway HTTP API (e.g. `http://localhost`) |

## License

Apache License 2.0 — see [LICENSE](./LICENSE).
