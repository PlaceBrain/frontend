<script setup lang="ts">
interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const sizeClasses = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');
}
</script>

<template>
  <div
    :class="[
      'flex items-center justify-center rounded-full bg-[var(--color-accent)] text-white font-medium',
      sizeClasses[props.size],
    ]"
  >
    {{ getInitials(props.name) }}
  </div>
</template>
