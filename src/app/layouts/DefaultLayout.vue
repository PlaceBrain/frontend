<script setup lang="ts">
import { computed } from "vue";
import Sidebar from "@/widgets/sidebar/Sidebar.vue";
import MobileNavbar from "@/widgets/mobile-navbar/MobileNavbar.vue";
import { useBreakpoint } from "@/shared/lib/use-breakpoint";
import { useUiStore } from "@/shared/stores/ui.store";

const { isDesktop } = useBreakpoint();
const ui = useUiStore();

const mainClasses = computed(() => {
  if (!isDesktop.value) return "px-4 pt-4 pb-20";
  return ["px-8 pt-8 transition-[margin] duration-200", ui.sidebarCollapsed ? "ml-16" : "ml-64"];
});
</script>

<template>
  <div class="min-h-screen bg-[var(--color-surface-elevated)]">
    <Sidebar v-if="isDesktop" />
    <MobileNavbar v-else />
    <main :class="mainClasses">
      <div class="mx-auto max-w-6xl">
        <RouterView />
      </div>
    </main>
  </div>
</template>
