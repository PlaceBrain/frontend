<script setup lang="ts">
interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  modelValue: string;
}

defineProps<Props>();

defineEmits<{
  'update:modelValue': [key: string];
}>();
</script>

<template>
  <div class="border-b border-[var(--color-border)]">
    <nav class="flex gap-1 -mb-px">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 cursor-pointer',
          modelValue === tab.key
            ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
            : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]',
        ]"
        @click="$emit('update:modelValue', tab.key)"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>
