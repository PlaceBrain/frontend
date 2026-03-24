<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  type: "text",
  placeholder: "",
  error: undefined,
  disabled: false,
  autocomplete: undefined,
});

defineEmits<{
  "update:modelValue": [value: string];
}>();

const inputId = computed(() => {
  if (!props.label) return undefined;
  return `input-${props.label.toLowerCase().replace(/\s+/g, "-")}`;
});
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-[var(--color-text-primary)]">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :class="[
        'w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-150',
        'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
        'placeholder:text-[var(--color-text-secondary)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-xs text-[var(--color-danger)]">{{ error }}</p>
  </div>
</template>
