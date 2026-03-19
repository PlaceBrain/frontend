<script setup lang="ts">
import { ref, watch } from "vue";
import { useUpdateSensor, useDeleteSensor } from "@/entities/device/api/sensor.api";
import { getErrorMessage } from "@/shared/api/types";
import UiModal from "@/shared/ui/UiModal.vue";
import UiInput from "@/shared/ui/UiInput.vue";
import UiButton from "@/shared/ui/UiButton.vue";
import type { Sensor } from "@/entities/device/model/types";

interface Props {
  open: boolean;
  placeId: string;
  deviceId: string;
  sensor: Sensor;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const name = ref(props.sensor.name);
const unitLabel = ref(props.sensor.unit_label);
const precision = ref(String(props.sensor.precision));
const error = ref("");

watch(
  () => props.sensor,
  (s) => {
    name.value = s.name;
    unitLabel.value = s.unit_label;
    precision.value = String(s.precision);
  },
);

const { mutate: update, isPending: isUpdating } = useUpdateSensor(props.placeId, props.deviceId);
const { mutate: remove, isPending: isRemoving } = useDeleteSensor(props.placeId, props.deviceId);

function handleSubmit() {
  error.value = "";
  update(
    {
      sensorId: props.sensor.sensor_id,
      name: name.value,
      unit_label: unitLabel.value,
      precision: parseInt(precision.value) || 0,
    },
    {
      onSuccess: () => emit("close"),
      onError: (e) => {
        error.value = getErrorMessage(e);
      },
    },
  );
}

function handleDelete() {
  if (!confirm("Delete this sensor?")) return;
  remove(props.sensor.sensor_id, {
    onSuccess: () => emit("close"),
    onError: (e) => {
      error.value = getErrorMessage(e);
    },
  });
}
</script>

<template>
  <UiModal :open="open" title="Edit sensor" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UiInput v-model="name" label="Name" />
      <UiInput v-model="unitLabel" label="Unit label" />
      <UiInput v-model="precision" label="Precision" type="number" />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <div class="flex justify-between">
        <UiButton variant="danger" size="sm" :loading="isRemoving" @click="handleDelete">
          Delete
        </UiButton>
        <UiButton type="submit" :loading="isUpdating">Save</UiButton>
      </div>
    </form>
  </UiModal>
</template>
