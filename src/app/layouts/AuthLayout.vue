<script setup lang="ts">
import LogoIcon from "@/shared/ui/LogoIcon.vue";
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-[var(--color-surface-elevated)] px-4"
  >
    <div class="w-full max-w-sm">
      <div class="mb-8 flex flex-col items-center text-[var(--color-text-primary)]">
        <LogoIcon size="3rem" class="mb-3" />
        <h1 class="text-2xl font-bold font-heading text-[var(--color-text-primary)]">PlaceBrain</h1>
      </div>
      <div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <RouterView />
      </div>
    </div>
  </div>
</template>
