<script setup lang="ts">
import { ref } from "vue";
import { useCreatePlace } from "@/entities/place/api/place.api";
import { getErrorMessage } from "@/shared/api/types";
import { useToast } from "@/shared/composables/useToast";
import UiModal from "@/shared/ui/UiModal.vue";
import UiInput from "@/shared/ui/UiInput.vue";
import UiButton from "@/shared/ui/UiButton.vue";

interface Props {
  open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const name = ref("");
const description = ref("");
const error = ref("");

const { mutate, isPending } = useCreatePlace();
const { success, error: showError } = useToast();

function handleSubmit() {
  error.value = "";
  mutate(
    { name: name.value, description: description.value || undefined },
    {
      onSuccess: () => {
        success("Place created");
        name.value = "";
        description.value = "";
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
  <UiModal :open="open" title="Create place" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UiInput v-model="name" label="Name" placeholder="Place name" />
      <UiInput v-model="description" label="Description" placeholder="Optional description" />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <div class="flex justify-end">
        <UiButton type="submit" :loading="isPending">Create</UiButton>
      </div>
    </form>
  </UiModal>
</template>
