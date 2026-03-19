<script setup lang="ts">
import { useRouter } from "vue-router";
import { useDeletePlace } from "@/entities/place/api/place.api";
import UiButton from "@/shared/ui/UiButton.vue";

interface Props {
  placeId: string;
}

const props = defineProps<Props>();
const router = useRouter();
const { mutate, isPending } = useDeletePlace();

function handleDelete() {
  if (!confirm("Are you sure you want to delete this place?")) return;
  mutate(props.placeId, {
    onSuccess: () => router.push({ name: "places" }),
  });
}
</script>

<template>
  <UiButton variant="danger" :loading="isPending" @click="handleDelete"> Delete place </UiButton>
</template>
