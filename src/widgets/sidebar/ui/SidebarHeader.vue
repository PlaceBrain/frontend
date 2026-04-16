<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import LogoIcon from "@/shared/ui/LogoIcon.vue";
import { useUiStore } from "@/shared/stores/ui.store";

const ui = useUiStore();

const collapsed = computed(() => ui.sidebarCollapsed);
const toggleLabel = computed(() => (collapsed.value ? "Expand sidebar" : "Collapse sidebar"));
const toggleLeft = computed(() => (collapsed.value ? "16px" : "calc(100% - 40px)"));
</script>

<template>
  <div
    class="relative flex h-16 shrink-0 items-center border-b border-[var(--color-border)] overflow-hidden"
  >
    <router-link
      :to="{ name: 'places' }"
      :class="[
        'flex shrink-0 items-center gap-2 pl-5 text-[var(--color-text-primary)] transition-opacity duration-200',
        collapsed ? 'pointer-events-none opacity-0' : 'opacity-100',
      ]"
      :tabindex="collapsed ? -1 : 0"
      :aria-hidden="collapsed"
    >
      <LogoIcon size="1.5rem" />
      <span class="text-lg font-semibold font-heading whitespace-nowrap">PlaceBrain</span>
    </router-link>

    <button
      type="button"
      class="absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)] cursor-pointer transition-[left,background-color,color] duration-200"
      :style="{ left: toggleLeft }"
      :aria-label="toggleLabel"
      :title="toggleLabel"
      @click="ui.toggleSidebar"
    >
      <ChevronLeft v-if="!collapsed" class="h-4 w-4" />
      <ChevronRight v-else class="h-4 w-4" />
    </button>
  </div>
</template>
