<script setup lang="ts">
import { ref } from "vue";
import { useAddMember } from "@/entities/member/api/member.api";
import { getErrorMessage } from "@/shared/api/types";
import { ASSIGNABLE_ROLE_OPTIONS } from "@/shared/types";
import UiModal from "@/shared/ui/UiModal.vue";
import UiInput from "@/shared/ui/UiInput.vue";
import UiSelect from "@/shared/ui/UiSelect.vue";
import UiButton from "@/shared/ui/UiButton.vue";

interface Props {
  open: boolean;
  placeId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const email = ref("");
const role = ref("viewer");
const error = ref("");

const roleOptions = ASSIGNABLE_ROLE_OPTIONS;

const { mutate, isPending } = useAddMember(props.placeId);

function handleSubmit() {
  error.value = "";
  mutate(
    { email: email.value, role: role.value },
    {
      onSuccess: () => {
        email.value = "";
        role.value = "viewer";
        emit("close");
      },
      onError: (e) => {
        error.value = getErrorMessage(e);
      },
    },
  );
}
</script>

<template>
  <UiModal :open="open" title="Add member" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UiInput v-model="email" label="Email" placeholder="Enter user email" />
      <UiSelect v-model="role" :options="roleOptions" label="Role" />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <div class="flex justify-end">
        <UiButton type="submit" :loading="isPending">Add</UiButton>
      </div>
    </form>
  </UiModal>
</template>
