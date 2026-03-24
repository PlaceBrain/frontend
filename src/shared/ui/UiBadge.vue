<script setup lang="ts">
interface Props {
  variant?: "default" | "accent" | "success" | "danger";
}

withDefaults(defineProps<Props>(), {
  variant: "default",
});

const variantClasses = {
  default: "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]",
  accent: "bg-[var(--color-accent-light)] text-[var(--color-accent)]",
  success: "bg-[var(--color-status-online-bg)] text-[var(--color-status-online-text)]",
  danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
};
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
      variantClasses[variant],
    ]"
  >
    <slot />
  </span>
</template>
