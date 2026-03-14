<script setup lang="ts">
import { useUiStore } from '@/shared/stores/ui.store';

// Initialize theme on app load
useUiStore();
</script>

<template>
  <RouterView />
</template>
