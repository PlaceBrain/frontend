<script setup lang="ts">
import UiModal from "./UiModal.vue";
import UiButton from "./UiButton.vue";

interface Props {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "Confirm action",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  variant: "danger",
  loading: false,
});

defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <UiModal :open="open" :title="title" @close="$emit('cancel')">
    <p class="text-sm text-[var(--color-text-secondary)] mb-6">{{ message }}</p>
    <div class="flex justify-end gap-3">
      <UiButton variant="secondary" size="sm" @click="$emit('cancel')">
        {{ cancelLabel }}
      </UiButton>
      <UiButton :variant="variant" size="sm" :loading="loading" @click="$emit('confirm')">
        {{ confirmLabel }}
      </UiButton>
    </div>
  </UiModal>
</template>
