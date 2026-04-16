<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import SidebarHeader from "./ui/SidebarHeader.vue";
import SidebarAlertsLink from "./ui/SidebarAlertsLink.vue";
import SidebarPlacesList from "./ui/SidebarPlacesList.vue";
import SidebarUserMenu from "./ui/SidebarUserMenu.vue";
import { useUiStore } from "@/shared/stores/ui.store";

const ui = useUiStore();

const widthClass = computed(() => (ui.sidebarCollapsed ? "w-16" : "w-64"));

function handleKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
    event.preventDefault();
    ui.toggleSidebar();
  }
}

onMounted(() => window.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <aside
    :class="[
      'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-[width] duration-200',
      widthClass,
    ]"
  >
    <SidebarHeader />
    <SidebarAlertsLink />
    <SidebarPlacesList />
    <SidebarUserMenu />
  </aside>
</template>
