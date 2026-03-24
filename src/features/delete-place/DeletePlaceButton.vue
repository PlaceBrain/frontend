<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDeletePlace } from "@/entities/place/api/place.api";
import UiButton from "@/shared/ui/UiButton.vue";
import UiConfirmDialog from "@/shared/ui/UiConfirmDialog.vue";

interface Props {
  placeId: string;
}

const props = defineProps<Props>();
const router = useRouter();
const { mutate, isPending } = useDeletePlace();
const showConfirm = ref(false);

function handleDelete() {
  mutate(props.placeId, {
    onSuccess: () => router.push({ name: "places" }),
  });
}
</script>

<template>
  <UiButton variant="danger" :loading="isPending" @click="showConfirm = true">
    Delete place
  </UiButton>
  <UiConfirmDialog
    :open="showConfirm"
    title="Delete place"
    message="Are you sure you want to delete this place? This action cannot be undone."
    confirm-label="Delete"
    :loading="isPending"
    @confirm="handleDelete"
    @cancel="showConfirm = false"
  />
</template>
