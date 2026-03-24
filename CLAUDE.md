# Frontend

## Инструменты

- **Node 25**, пакетный менеджер **npm**
- **TypeScript проверка:** `npx vue-tsc -b`
- **Линтеры:** `npm run lint:fix` (ESLint), `npm run format` (Prettier)
- **Сборка:** `npm run build` (vue-tsc + vite build)

## Стек

- Vue 3, TypeScript, Vite, Tailwind CSS v4, TanStack Query v5, Pinia, Axios

## Структура (FSD)

```
src/
├── app/            # Providers (router, pinia, query), layouts, styles
├── pages/          # Страницы (LoginPage, PlacesPage, PlaceDetailPage, ...)
├── widgets/        # Составные блоки (Navbar, MembersPanel, PlaceTabs)
├── features/       # Пользовательские действия (auth forms, CRUD modals, theme toggle)
├── entities/       # Бизнес-сущности (user, place, member — types, API hooks, UI)
└── shared/         # UI kit, API client, composables, stores, config
```

## Компоненты

- `<script setup lang="ts">` → `<template>`, без `<style>` (только Tailwind)

## Дизайн

- Тема: светлая/тёмная через CSS-переменные + класс `dark` на `<html>`
- Минималистичный, без градиентов. Акцент `#6E9EF9`, danger `#E85A4F`
- Шрифты: Inter (body), Space Grotesk (headings — через класс `font-heading`, не inline style)
- **Цвета только через CSS-переменные** (`var(--color-*)`) — не использовать hardcoded Tailwind-цвета (`bg-red-50`, `text-red-700`)

## UX-правила

- **Деструктивные действия:** использовать `<UiConfirmDialog>` — **не** нативный `confirm()`
- **Обратная связь:** использовать `useToast()` для success/error уведомлений после мутаций
- **Общие константы** (роли, enum-опции) — в `shared/types/index.ts`, не дублировать по компонентам

## Доступность (a11y)

- Кнопки с иконками без текста — обязательно `aria-label`
- Модалки — `role="dialog"`, `aria-modal="true"`, focus trap (реализован в `UiModal`)
- Toggle-кнопки — `role="switch"`, `aria-checked`
- Инпуты — `<label :for="id">` + `<input :id="id">` (реализовано в `UiInput`)

## API

- API hooks: TanStack Query в `entities/*/api/`, ключи в `shared/api/query-keys.ts`
- Auth: OAuth2 form-encoded login, Bearer token, auto-refresh через axios interceptor (401 → refresh → retry queue)
- MQTT: WebSocket через `/mqtt`, credentials через `POST /api/mqtt/credentials`, auto-reconnect 5s, auto-refresh credentials
