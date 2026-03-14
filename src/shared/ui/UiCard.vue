<script setup lang="ts">
interface Props {
  hoverable?: boolean;
  padding?: boolean;
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
  padding: true,
});
</script>

<template>
  <div
    :class="[
      'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]',
      'transition-shadow duration-150',
      hoverable && 'hover:shadow-md cursor-pointer',
      padding && 'p-5',
    ]"
  >
    <slot />
  </div>
</template>
