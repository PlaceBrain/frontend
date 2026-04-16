<script setup lang="ts">
import { Bell } from "lucide-vue-next";
import UiEmptyState from "@/shared/ui/UiEmptyState.vue";
</script>

<template>
  <UiEmptyState
    title="Coming soon"
    description="Threshold breaches and device alerts for this place will appear here."
  >
    <template #icon>
      <Bell class="h-12 w-12 text-[var(--color-text-secondary)] opacity-40 mb-4" />
    </template>
  </UiEmptyState>
</template>
