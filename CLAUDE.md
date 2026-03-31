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
- Исключение: `<style scoped>` допускается для CSS, невозможного через Tailwind-утилиты (например, `scrollbar-hide`)

## Дизайн

- Тема: светлая/тёмная через CSS-переменные + класс `dark` на `<html>`
- Минималистичный, без градиентов. Акцент `#6E9EF9`, danger `#E85A4F`
- Шрифты: Inter (body), Space Grotesk (headings — через класс `font-heading`, не inline style)
- **Цвета только через CSS-переменные** (`var(--color-*)`) — не использовать hardcoded Tailwind-цвета (`bg-red-50`, `text-red-700`)

### Темы: соглашение по surface-переменным

- `--color-surface` — карточки, навбар, модалки, инпуты (передний план)
- `--color-surface-elevated` — фон страницы (задний план, темнее surface)
- В **обеих** темах `surface` светлее `surface-elevated` (карточки выделяются на фоне)
- Hover на элементах, лежащих на `surface-elevated`, должен быть `hover:bg-[var(--color-surface)]`, **не** `hover:bg-[var(--color-surface-elevated)]`

## UX-правила

- **Деструктивные действия:** использовать `<UiConfirmDialog>` — **не** нативный `confirm()`
- **Обратная связь:** использовать `useToast()` для success/error уведомлений после мутаций. На auth-страницах (login, register, verify-otp) — **не** использовать тосты, показывать обратную связь инлайном в форме
- **Общие константы** (роли, enum-опции) — в `shared/types/index.ts`, не дублировать по компонентам
- **Кнопки:** всегда использовать `<UiButton>` — не raw `<button>` с inline-стилями. Back-навигация — `<UiButton variant="ghost" size="sm">`
- **Заголовки страниц:** оборачивать в flex-контейнер с `min-h-[36px]` для единообразной высоты между страницами
- **Группы action-кнопок:** использовать `flex-wrap` + `whitespace-nowrap` (уже в UiButton). На мобильных header — `flex-col gap-3 sm:flex-row`

### Адаптивность

- Breakpoint: 768px (`useBreakpoint()` → `isDesktop`)
- Мобильный navbar: `fixed bottom-0 h-16` — элементы, привязанные к низу экрана (toast, FAB), должны учитывать его высоту (`bottom-20` = 80px)
- Горизонтальные скроллы (табы): скрывать скроллбар через класс `scrollbar-hide` (определён в `app/styles/index.css`)

### Удаление сущностей (TanStack Query)

- При удалении сущности: сначала `removeQueries` для удалённого ключа, потом `invalidateQueries` для списка — иначе активный query на удалённую сущность вызовет 403/404

## Доступность (a11y)

- Кнопки с иконками без текста — обязательно `aria-label`
- Модалки — `role="dialog"`, `aria-modal="true"`, focus trap (реализован в `UiModal`)
- Toggle-кнопки — `role="switch"`, `aria-checked`
- Инпуты — `<label :for="id">` + `<input :id="id">` (реализовано в `UiInput`)

## API

- API hooks: TanStack Query в `entities/*/api/`, ключи в `shared/api/query-keys.ts`
- Shared типы: `PaginatedResponse<T>`, `ApiError` в `shared/api/types.ts`
- Auth: OAuth2 form-encoded login, Bearer token, auto-refresh через axios interceptor (401 → refresh → retry queue)
- Auth flow: регистрация → OTP-верификация email (`/verify-otp`) → логин. Неверифицированный пользователь не может залогиниться (бэкенд возвращает 400 "Email not verified", фронтенд редиректит на `/verify-otp`)
- OTP: 6-значный код, кулдаун переотправки 60 сек, максимум 5 попыток, истекает через 5 минут. Для ввода используется `UiOtpInput` (6 отдельных ячеек)
- MQTT: WebSocket через `/mqtt`, credentials через `POST /api/mqtt/credentials`, auto-reconnect 5s, auto-refresh credentials

### Пагинация

- `useDevices()` возвращает `PaginatedResponse<DeviceSummary>` — потребители достают `.items` через computed
- `useDevicesWithDetails()` запрашивает `per_page: 100` и маппит `.items` в детальные объекты
- Остальные list-хуки (places, members, sensors, actuators, thresholds) возвращают простые массивы — без пагинации
