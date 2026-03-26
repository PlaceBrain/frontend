<script setup lang="ts">
import { ref, watch } from "vue";
import type { Place } from "@/entities/place/model/types";
import { useUpdatePlace } from "@/entities/place/api/place.api";
import { getErrorMessage } from "@/shared/api/types";
import { useToast } from "@/shared/composables/useToast";
import UiModal from "@/shared/ui/UiModal.vue";
import UiInput from "@/shared/ui/UiInput.vue";
import UiButton from "@/shared/ui/UiButton.vue";

interface Props {
  open: boolean;
  place: Place;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const name = ref(props.place.name);
const description = ref(props.place.description);
const error = ref("");

watch([() => props.place, () => props.open], ([p]) => {
  name.value = p.name;
  description.value = p.description;
  error.value = "";
});

const { mutate, isPending } = useUpdatePlace(props.place.place_id);
const { success, error: showError } = useToast();

function handleSubmit() {
  error.value = "";
  mutate(
    { name: name.value, description: description.value },
    {
      onSuccess: () => {
        success("Place updated");
        emit("close");
      },
      onError: (e) => {
        error.value = getErrorMessage(e);
        showError(getErrorMessage(e));
      },
    },
  );
}
</script>

<template>
  <UiModal :open="open" title="Edit place" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UiInput v-model="name" label="Name" placeholder="Place name" />
      <UiInput v-model="description" label="Description" placeholder="Description" />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <div class="flex justify-end">
        <UiButton type="submit" :loading="isPending">Save</UiButton>
      </div>
    </form>
  </UiModal>
</template>
