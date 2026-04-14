# Frontend

## Tools

- **Node 25**, package manager **npm**
- **TypeScript check:** `npx vue-tsc -b`
- **Linters:** `npm run lint:fix` (ESLint), `npm run format` (Prettier)
- **Build:** `npm run build` (vue-tsc + vite build)

## Stack

- Vue 3, TypeScript, Vite, Tailwind CSS v4, TanStack Query v5, Pinia, Axios

## Structure (FSD)

```
src/
├── app/            # Providers (router, pinia, query), layouts, styles
├── pages/          # Pages (LoginPage, PlacesPage, PlaceDetailPage, ...)
├── widgets/        # Composite blocks (Navbar, MembersPanel, PlaceTabs)
├── features/       # User actions (auth forms, CRUD modals, theme toggle)
├── entities/       # Business entities (user, place, member — types, API hooks, UI)
└── shared/         # UI kit, API client, composables, stores, config
```

## Components

- `<script setup lang="ts">` → `<template>`, no `<style>` (Tailwind only)
- Exception: `<style scoped>` is allowed for CSS impossible via Tailwind utilities (e.g., `scrollbar-hide`)

## Design

- Theme: light/dark via CSS variables + `dark` class on `<html>`
- Minimalist, no gradients. Accent `#6E9EF9`, danger `#E85A4F`
- Fonts: Inter (body), Space Grotesk (headings — via `font-heading` class, not inline style)
- **Colors only via CSS variables** (`var(--color-*)`) — do not use hardcoded Tailwind colors (`bg-red-50`, `text-red-700`)

### Themes: Surface Variable Convention

- `--color-surface` — cards, navbar, modals, inputs (foreground)
- `--color-surface-elevated` — page background (background, darker than surface)
- In **both** themes `surface` is lighter than `surface-elevated` (cards stand out from the background)
- Hover on elements placed on `surface-elevated` should use `hover:bg-[var(--color-surface)]`, **not** `hover:bg-[var(--color-surface-elevated)]`

## UX Rules

- **Destructive actions:** use `<UiConfirmDialog>` — **not** native `confirm()`
- **Feedback:** use `useToast()` for success/error notifications after mutations. On auth pages (login, register, verify-otp) — **do not** use toasts, show feedback inline in the form
- **Shared constants** (roles, enum options) — in `shared/types/index.ts`, do not duplicate across components
- **Buttons:** always use `<UiButton>` — not raw `<button>` with inline styles. Back navigation — `<UiButton variant="ghost" size="sm">`
- **Page headings:** wrap in a flex container with `min-h-[36px]` for consistent height across pages
- **Action button groups:** use `flex-wrap` + `whitespace-nowrap` (already in UiButton). On mobile header — `flex-col gap-3 sm:flex-row`

### Responsiveness

- Breakpoint: 768px (`useBreakpoint()` → `isDesktop`)
- Mobile navbar: `fixed bottom-0 h-16` — elements pinned to the bottom of the screen (toast, FAB) must account for its height (`bottom-20` = 80px)
- Horizontal scrolls (tabs): hide scrollbar via `scrollbar-hide` class (defined in `app/styles/index.css`)

### Entity Deletion (TanStack Query)

- When deleting an entity: first `removeQueries` for the deleted key, then `invalidateQueries` for the list — otherwise an active query on the deleted entity will trigger 403/404

## Accessibility (a11y)

- Icon-only buttons — must have `aria-label`
- Modals — `role="dialog"`, `aria-modal="true"`, focus trap (implemented in `UiModal`)
- Toggle buttons — `role="switch"`, `aria-checked`
- Inputs — `<label :for="id">` + `<input :id="id">` (implemented in `UiInput`)

## API

- API hooks: TanStack Query in `entities/*/api/`, keys in `shared/api/query-keys.ts`
- Shared types: `PaginatedResponse<T>`, `ApiError` in `shared/api/types.ts`
- Auth: OAuth2 form-encoded login, Bearer token, auto-refresh via axios interceptor (401 → refresh → retry queue)
- Auth flow: registration → OTP email verification (`/verify-otp`) → login. Unverified user cannot log in (backend returns 400 "Email not verified", frontend redirects to `/verify-otp`)
- OTP: 6-digit code, resend cooldown 60 sec, max 5 attempts, expires in 5 minutes. Input uses `UiOtpInput` (6 individual cells)
- MQTT: WebSocket via `/mqtt`, credentials via `POST /api/mqtt/credentials`, auto-reconnect 5s, auto-refresh credentials

### Pagination

- `useDevices()` returns `PaginatedResponse<DeviceSummary>` — consumers extract `.items` via computed
- `useDevicesWithDetails()` requests `per_page: 100` and maps `.items` to detailed objects
- Other list hooks (places, members, sensors, actuators, thresholds) return plain arrays — no pagination
