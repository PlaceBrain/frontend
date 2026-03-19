<script setup lang="ts">
import DesktopNavbar from "./DesktopNavbar.vue";
import MobileNavbar from "./MobileNavbar.vue";
import { useBreakpoint } from "@/shared/lib/use-breakpoint";

const { isDesktop } = useBreakpoint();
</script>

<template>
  <DesktopNavbar v-if="isDesktop" />
  <MobileNavbar v-else />
</template>
