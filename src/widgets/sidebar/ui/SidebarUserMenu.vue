<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LogOut, Moon, Sun, User as UserIcon } from "lucide-vue-next";
import UiAvatar from "@/shared/ui/UiAvatar.vue";
import { useUiStore } from "@/shared/stores/ui.store";
import { useCurrentUser } from "@/entities/user/api/user.api";
import { useAuth } from "@/shared/lib/use-auth";

const ui = useUiStore();
const route = useRoute();
const router = useRouter();
const { data: user } = useCurrentUser();
const { logout } = useAuth();

const collapsed = computed(() => ui.sidebarCollapsed);
const username = computed(() => user.value?.username ?? "");
const email = computed(() => user.value?.email ?? "");

const open = ref(false);
const rootRef = ref<HTMLElement>();

function handleDocClick(event: MouseEvent) {
  if (!open.value) return;
  const target = event.target as Node | null;
  if (rootRef.value && target && !rootRef.value.contains(target)) {
    open.value = false;
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape") open.value = false;
}

onMounted(() => {
  document.addEventListener("click", handleDocClick);
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocClick);
  document.removeEventListener("keydown", handleEscape);
});

watch(
  () => route.fullPath,
  () => {
    open.value = false;
  },
);

function toggleTheme(event: MouseEvent) {
  ui.toggleTheme(event);
}

async function handleLogout() {
  open.value = false;
  await logout();
  router.push({ name: "login" });
}

function goProfile() {
  open.value = false;
  router.push({ name: "profile" });
}
</script>

<template>
  <div ref="rootRef" class="relative shrink-0 border-t border-[var(--color-border)] p-2">
    <button
      type="button"
      :class="[
        'flex w-full items-center gap-3 rounded-lg h-12 px-3 transition-colors cursor-pointer',
        open ? 'bg-[var(--color-surface-elevated)]' : 'hover:bg-[var(--color-surface-elevated)]',
      ]"
      :aria-label="collapsed ? 'Account menu' : undefined"
      :title="collapsed ? username || 'Account' : undefined"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      <UiAvatar :name="username || '?'" size="xs" />
      <div
        :class="[
          'flex min-w-0 flex-col items-start transition-opacity duration-200',
          collapsed ? 'pointer-events-none opacity-0' : 'opacity-100',
        ]"
        :aria-hidden="collapsed"
      >
        <span
          class="truncate text-sm font-medium text-[var(--color-text-primary)] whitespace-nowrap"
        >
          {{ username || "..." }}
        </span>
        <span class="truncate text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
          {{ email }}
        </span>
      </div>
    </button>

    <div
      v-if="open"
      role="menu"
      :class="[
        'absolute bottom-full mb-2 z-40 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg py-1',
        collapsed ? 'left-full ml-2 w-48' : 'left-2 right-2',
      ]"
    >
      <button
        type="button"
        role="menuitem"
        class="flex w-full items-center gap-3 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
        @click="goProfile"
      >
        <UserIcon class="h-4 w-4 text-[var(--color-text-secondary)]" />
        <span>Profile</span>
      </button>
      <button
        type="button"
        role="menuitem"
        class="flex w-full items-center gap-3 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
        @click="toggleTheme"
      >
        <Sun v-if="ui.theme === 'dark'" class="h-4 w-4 text-[var(--color-text-secondary)]" />
        <Moon v-else class="h-4 w-4 text-[var(--color-text-secondary)]" />
        <span>{{ ui.theme === "dark" ? "Light mode" : "Dark mode" }}</span>
      </button>
      <div class="my-1 h-px bg-[var(--color-border)]" />
      <button
        type="button"
        role="menuitem"
        class="flex w-full items-center gap-3 px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
        @click="handleLogout"
      >
        <LogOut class="h-4 w-4" />
        <span>Sign out</span>
      </button>
    </div>
  </div>
</template>
