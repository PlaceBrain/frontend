<script setup lang="ts">
interface Props {
  modelValue: boolean;
}

defineProps<Props>();

defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <button
    role="switch"
    :aria-checked="modelValue"
    aria-label="Toggle live mode"
    :class="[
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer',
      modelValue
        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
        : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]',
    ]"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span
      :class="[
        'inline-block h-2 w-2 rounded-full',
        modelValue ? 'bg-[var(--color-accent)] animate-pulse' : 'bg-[var(--color-text-secondary)]',
      ]"
    />
    Live
  </button>
</template>
