<script setup lang="ts">
import NavbarWrapper from "@/widgets/navbar/NavbarWrapper.vue";
import { useBreakpoint } from "@/shared/lib/use-breakpoint";

const { isDesktop } = useBreakpoint();
</script>

<template>
  <div class="min-h-screen bg-[var(--color-surface-elevated)]">
    <NavbarWrapper />
    <main :class="['mx-auto max-w-6xl px-4', isDesktop ? 'pt-20' : 'pt-4 pb-20']">
      <RouterView />
    </main>
  </div>
</template>
