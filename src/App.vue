<script setup lang="ts">
import { useUiStore } from "@/shared/stores/ui.store";
import UiToastContainer from "@/shared/ui/UiToastContainer.vue";

// Initialize theme on app load
useUiStore();
</script>

<template>
  <RouterView />
  <UiToastContainer />
</template>
