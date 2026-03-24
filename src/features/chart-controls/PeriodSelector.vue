<script setup lang="ts">
import { PERIODS } from "./periods";

interface Props {
  modelValue: string;
}

defineProps<Props>();

defineEmits<{
  "update:modelValue": [key: string];
}>();
</script>

<template>
  <div class="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden">
    <button
      v-for="period in PERIODS"
      :key="period.key"
      :class="[
        'px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
        modelValue === period.key
          ? 'bg-[var(--color-accent)] text-white'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]',
      ]"
      @click="$emit('update:modelValue', period.key)"
    >
      {{ period.label }}
    </button>
  </div>
</template>
