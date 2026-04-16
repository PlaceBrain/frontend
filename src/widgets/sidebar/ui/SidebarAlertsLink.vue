<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Bell } from "lucide-vue-next";
import { useUiStore } from "@/shared/stores/ui.store";

const ui = useUiStore();
const route = useRoute();
const collapsed = computed(() => ui.sidebarCollapsed);
const isActive = computed(() => route.name === "alerts");
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
      <Bell class="h-6 w-6 shrink-0" />
      <span
        :class="[
          'text-sm font-medium whitespace-nowrap transition-opacity duration-200',
          collapsed ? 'opacity-0' : 'opacity-100',
        ]"
        :aria-hidden="collapsed"
        >Alerts</span
      >
    </router-link>
  </div>
</template>
