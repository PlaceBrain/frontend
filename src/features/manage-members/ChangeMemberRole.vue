<script setup lang="ts">
import { ref } from "vue";
import { useUpdateMemberRole, useRemoveMember } from "@/entities/member/api/member.api";
import { getErrorMessage } from "@/shared/api/types";
import { useToast } from "@/shared/composables/useToast";
import { ASSIGNABLE_ROLE_OPTIONS } from "@/shared/types";
import UiModal from "@/shared/ui/UiModal.vue";
import UiConfirmDialog from "@/shared/ui/UiConfirmDialog.vue";
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
const showRemoveConfirm = ref(false);

const roleOptions = ASSIGNABLE_ROLE_OPTIONS;

const { mutate: updateRole, isPending: isUpdating } = useUpdateMemberRole(props.placeId);
const { mutate: removeMember, isPending: isRemoving } = useRemoveMember(props.placeId);
const { success, error: showError } = useToast();

function handleSubmit() {
  error.value = "";
  updateRole(
    { userId: props.userId, role: role.value },
    {
      onSuccess: () => {
        success("Role updated");
        emit("close");
      },
      onError: (e) => {
        error.value = getErrorMessage(e);
        showError(getErrorMessage(e));
      },
    },
  );
}

function handleRemove() {
  error.value = "";
  removeMember(props.userId, {
    onSuccess: () => {
      success("Member removed");
      emit("close");
    },
    onError: (e) => {
      error.value = getErrorMessage(e);
      showError(getErrorMessage(e));
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
        <UiButton
          variant="danger"
          size="sm"
          :loading="isRemoving"
          @click="showRemoveConfirm = true"
        >
          Remove member
        </UiButton>
        <UiButton type="submit" :loading="isUpdating">Save</UiButton>
      </div>
    </form>
  </UiModal>
  <UiConfirmDialog
    :open="showRemoveConfirm"
    title="Remove member"
    message="Remove this member from the place?"
    confirm-label="Remove"
    :loading="isRemoving"
    @confirm="handleRemove"
    @cancel="showRemoveConfirm = false"
  />
</template>
