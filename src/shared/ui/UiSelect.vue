<script setup lang="ts">
interface Option {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  options: Option[];
  label?: string;
  placeholder?: string;
}

defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-sm font-medium text-[var(--color-text-primary)]">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      :class="[
        'w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm',
        'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
        'transition-colors duration-150',
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
