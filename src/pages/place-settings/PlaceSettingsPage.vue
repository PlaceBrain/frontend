<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { usePlace, useUpdatePlace } from "@/entities/place/api/place.api";
import { getErrorMessage } from "@/shared/api/types";
import { useToast } from "@/shared/composables/useToast";
import DeletePlaceButton from "@/features/delete-place/DeletePlaceButton.vue";
import UiButton from "@/shared/ui/UiButton.vue";
import UiInput from "@/shared/ui/UiInput.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import { placeDetailKey } from "@/pages/place-detail/context";

const ctx = inject(placeDetailKey);
if (!ctx) throw new Error("PlaceSettingsPage must be nested inside PlaceDetailPage");

const { placeId, canManage } = ctx;

const { data: place, isLoading } = usePlace(placeId);
const { mutate, isPending } = useUpdatePlace(placeId.value);
const { success, error: showError } = useToast();

const name = ref("");
const description = ref("");
const error = ref("");

watch(
  place,
  (p) => {
    if (!p) return;
    name.value = p.name;
    description.value = p.description;
  },
  { immediate: true },
);

const isOwner = computed(() => place.value?.user_role === "owner");

function handleSubmit() {
  error.value = "";
  mutate(
    { name: name.value, description: description.value },
    {
      onSuccess: () => success("Place updated"),
      onError: (e) => {
        error.value = getErrorMessage(e);
        showError(getErrorMessage(e));
      },
    },
  );
}
</script>

<template>
  <div class="flex flex-col gap-8 max-w-xl">
    <div v-if="isLoading" class="flex justify-center py-8">
      <UiSpinner />
    </div>

    <template v-else-if="place">
      <section>
        <h2 class="mb-4 text-base font-semibold text-[var(--color-text-primary)]">Details</h2>
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <UiInput v-model="name" label="Name" placeholder="Place name" :disabled="!canManage" />
          <UiInput
            v-model="description"
            label="Description"
            placeholder="Description"
            :disabled="!canManage"
          />
          <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
          <div v-if="canManage" class="flex justify-end">
            <UiButton type="submit" :loading="isPending">Save</UiButton>
          </div>
        </form>
      </section>

      <section v-if="isOwner" class="border-t border-[var(--color-border)] pt-8">
        <h2 class="mb-2 text-base font-semibold text-[var(--color-text-primary)]">Danger zone</h2>
        <p class="mb-4 text-sm text-[var(--color-text-secondary)]">
          Deleting a place removes all its devices, sensors, and telemetry. This cannot be undone.
        </p>
        <DeletePlaceButton :place-id="place.place_id" />
      </section>
    </template>
  </div>
</template>
