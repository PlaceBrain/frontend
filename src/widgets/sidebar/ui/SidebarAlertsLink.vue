<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Bell } from "lucide-vue-next";
import { useUiStore } from "@/shared/stores/ui.store";
import { useGlobalAlertCount } from "@/entities/alert/api/alert.api";

const ui = useUiStore();
const route = useRoute();
const collapsed = computed(() => ui.sidebarCollapsed);
const isActive = computed(() => route.name === "alerts");

const { data: count } = useGlobalAlertCount();
const unresolved = computed(() => count.value?.total_unresolved ?? 0);
const hasAlerts = computed(() => unresolved.value > 0);
const displayCount = computed(() => (unresolved.value > 99 ? "99+" : String(unresolved.value)));
const badgeLabel = computed(() => `${unresolved.value} unresolved alerts`);
</script>

<template>
  <div class="px-2 py-2 border-b border-[var(--color-border)] overflow-hidden">
    <router-link
      :to="{ name: 'alerts' }"
      :class="[
        'group relative flex items-center gap-3 rounded-lg h-10 px-3 transition-colors',
        isActive
          ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]',
      ]"
      :aria-label="collapsed ? 'Alerts' : undefined"
      :title="collapsed ? 'Alerts' : undefined"
    >
      <span
        v-if="isActive"
        class="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--color-accent)]"
      />
      <div class="relative shrink-0">
        <Bell class="h-6 w-6" />
        <span
          v-if="hasAlerts && collapsed"
          class="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-surface)]"
          :aria-label="badgeLabel"
          role="status"
        />
      </div>
      <span
        :class="[
          'text-sm font-medium whitespace-nowrap transition-opacity duration-200',
          collapsed ? 'opacity-0' : 'opacity-100',
        ]"
        :aria-hidden="collapsed"
        >Alerts</span
      >
      <span
        v-if="hasAlerts && !collapsed"
        class="ml-auto inline-flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-[var(--color-danger)] px-1.5 text-[11px] font-semibold text-white whitespace-nowrap transition-opacity duration-200"
        :aria-label="badgeLabel"
        role="status"
      >
        {{ displayCount }}
      </span>
    </router-link>
  </div>
</template>
