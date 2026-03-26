<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePlaces } from "@/entities/place/api/place.api";
import type { Place } from "@/entities/place/model/types";
import PlaceCardGrid from "@/widgets/place-card-grid/PlaceCardGrid.vue";
import CreatePlaceModal from "@/features/create-place/CreatePlaceModal.vue";
import UiButton from "@/shared/ui/UiButton.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import UiEmptyState from "@/shared/ui/UiEmptyState.vue";

const router = useRouter();
const { data: places, isLoading } = usePlaces();
const showCreateModal = ref(false);

function handleSelect(place: Place) {
  router.push({ name: "place-detail", params: { placeId: place.place_id } });
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6 min-h-[36px]">
      <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">Places</h1>
      <UiButton @click="showCreateModal = true"> New place </UiButton>
    </div>

    <div v-if="isLoading" class="flex justify-center py-16">
      <UiSpinner size="lg" />
    </div>

    <UiEmptyState
      v-else-if="!places?.length"
      title="No places yet"
      description="Create your first place to get started."
    >
      <template #action>
        <UiButton @click="showCreateModal = true">Create place</UiButton>
      </template>
    </UiEmptyState>

    <PlaceCardGrid v-else :places="places" @select="handleSelect" />

    <CreatePlaceModal :open="showCreateModal" @close="showCreateModal = false" />
  </div>
</template>
