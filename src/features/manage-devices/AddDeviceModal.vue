<script setup lang="ts">
import { ref } from "vue";
import { useCreateDevice } from "@/entities/device/api/device.api";
import { getErrorMessage } from "@/shared/api/types";
import UiModal from "@/shared/ui/UiModal.vue";
import UiInput from "@/shared/ui/UiInput.vue";
import UiButton from "@/shared/ui/UiButton.vue";

interface Props {
  open: boolean;
  placeId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const name = ref("");
const error = ref("");
const token = ref<string | null>(null);

const { mutate, isPending } = useCreateDevice(props.placeId);

function handleSubmit() {
  error.value = "";
  mutate(
    { name: name.value },
    {
      onSuccess: (data) => {
        token.value = data.token;
      },
      onError: (e) => {
        error.value = getErrorMessage(e);
      },
    },
  );
}

function handleClose() {
  name.value = "";
  token.value = null;
  error.value = "";
  emit("close");
}

function copyToken() {
  if (token.value) navigator.clipboard.writeText(token.value);
}
</script>

<template>
  <UiModal :open="open" title="Add device" @close="handleClose">
    <template v-if="!token">
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <UiInput v-model="name" label="Device name" placeholder="Enter device name" />
        <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
        <div class="flex justify-end">
          <UiButton type="submit" :loading="isPending">Create</UiButton>
        </div>
      </form>
    </template>
    <template v-else>
      <div class="flex flex-col gap-4">
        <p class="text-sm text-[var(--color-text-primary)]">
          Device created! Save this token now — it won't be shown again.
        </p>
        <div class="flex items-center gap-2">
          <code
            class="flex-1 text-sm font-mono bg-[var(--color-surface-elevated)] px-3 py-2 rounded border border-[var(--color-border)] break-all"
          >
            {{ token }}
          </code>
          <UiButton size="sm" variant="secondary" @click="copyToken">Copy</UiButton>
        </div>
        <div class="flex justify-end">
          <UiButton @click="handleClose">Done</UiButton>
        </div>
      </div>
    </template>
  </UiModal>
</template>
