<script setup lang="ts">
import { Bell } from "lucide-vue-next";
import UiEmptyState from "@/shared/ui/UiEmptyState.vue";
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6 min-h-[36px]">
      <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">Alerts</h1>
    </div>
    <UiEmptyState
      title="Coming soon"
      description="A feed of threshold breaches and device alerts across all your places will appear here."
    >
      <template #icon>
        <Bell class="h-12 w-12 text-[var(--color-text-secondary)] opacity-40 mb-4" />
      </template>
    </UiEmptyState>
  </div>
</template>
