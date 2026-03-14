<script setup lang="ts">
import { useBreakpoint } from '@/shared/lib/use-breakpoint';
import DesktopNavbar from './DesktopNavbar.vue';
import MobileNavbar from './MobileNavbar.vue';

const { isDesktop } = useBreakpoint();
</script>

<template>
  <DesktopNavbar v-if="isDesktop" />
  <MobileNavbar v-else />
</template>
