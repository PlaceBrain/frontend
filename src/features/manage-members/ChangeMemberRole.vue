<script setup lang="ts">
import { ref } from "vue";
import { useUpdateMemberRole, useRemoveMember } from "@/entities/member/api/member.api";
import { getErrorMessage } from "@/shared/api/types";
import UiModal from "@/shared/ui/UiModal.vue";
import UiSelect from "@/shared/ui/UiSelect.vue";
import UiButton from "@/shared/ui/UiButton.vue";

interface Props {
  open: boolean;
  placeId: string;
  userId: string;
  currentRole: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const role = ref(props.currentRole);
const error = ref("");

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "viewer", label: "Viewer" },
];

const { mutate: updateRole, isPending: isUpdating } = useUpdateMemberRole(props.placeId);
const { mutate: removeMember, isPending: isRemoving } = useRemoveMember(props.placeId);

function handleSubmit() {
  error.value = "";
  updateRole(
    { userId: props.userId, role: role.value },
    {
      onSuccess: () => emit("close"),
      onError: (e) => {
        error.value = getErrorMessage(e);
      },
    },
  );
}

function handleRemove() {
  if (!confirm("Remove this member from the place?")) return;
  error.value = "";
  removeMember(props.userId, {
    onSuccess: () => emit("close"),
    onError: (e) => {
      error.value = getErrorMessage(e);
    },
  });
}
</script>

<template>
  <UiModal :open="open" title="Edit member" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UiSelect v-model="role" :options="roleOptions" label="Role" />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <div class="flex items-center justify-between">
        <UiButton variant="danger" size="sm" :loading="isRemoving" @click="handleRemove">
          Remove member
        </UiButton>
        <UiButton type="submit" :loading="isUpdating">Save</UiButton>
      </div>
    </form>
  </UiModal>
</template>
