<script setup lang="ts">
import type { Place } from '../model/types';
import { formatRole } from '@/shared/lib/format';

interface Props {
  place: Place;
}

defineProps<Props>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <div
    class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-shadow duration-150 hover:shadow-md cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between">
      <h3 class="text-base font-semibold text-[var(--color-text-primary)] truncate">
        {{ place.name }}
      </h3>
      <span class="ml-2 inline-flex items-center rounded-md bg-[var(--color-accent-light)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent)] shrink-0">
        {{ formatRole(place.user_role) }}
      </span>
    </div>
    <p v-if="place.description" class="mt-2 text-sm text-[var(--color-text-secondary)] line-clamp-2">
      {{ place.description }}
    </p>
  </div>
</template>
