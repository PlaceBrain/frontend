<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUpdateDevice } from '@/entities/device/api/device.api';
import { getErrorMessage } from '@/shared/api/types';
import UiModal from '@/shared/ui/UiModal.vue';
import UiInput from '@/shared/ui/UiInput.vue';
import UiButton from '@/shared/ui/UiButton.vue';
import type { Device } from '@/entities/device/model/types';

interface Props {
  open: boolean;
  placeId: string;
  device: Device;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const name = ref(props.device.name);
const error = ref('');

watch(() => props.device, (d) => { name.value = d.name; });

const { mutate, isPending } = useUpdateDevice(props.placeId, props.device.device_id);

function handleSubmit() {
  error.value = '';
  mutate(
    { name: name.value },
    {
      onSuccess: () => emit('close'),
      onError: (e) => { error.value = getErrorMessage(e); },
    },
  );
}
</script>

<template>
  <UiModal :open="open" title="Edit device" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UiInput v-model="name" label="Device name" placeholder="Enter device name" />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <div class="flex justify-end">
        <UiButton type="submit" :loading="isPending">Save</UiButton>
      </div>
    </form>
  </UiModal>
</template>
