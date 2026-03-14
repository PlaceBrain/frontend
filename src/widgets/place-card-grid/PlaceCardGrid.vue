<script setup lang="ts">
import type { Place } from '@/entities/place/model/types';
import PlaceCard from '@/entities/place/ui/PlaceCard.vue';

interface Props {
  places: Place[];
}

defineProps<Props>();

defineEmits<{
  select: [place: Place];
}>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <PlaceCard
      v-for="place in places"
      :key="place.place_id"
      :place="place"
      @click="$emit('select', place)"
    />
  </div>
</template>
