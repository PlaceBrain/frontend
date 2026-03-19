<script setup lang="ts">
import { ref } from "vue";
import { useCreateSensor } from "@/entities/device/api/sensor.api";
import { getErrorMessage } from "@/shared/api/types";
import UiModal from "@/shared/ui/UiModal.vue";
import UiInput from "@/shared/ui/UiInput.vue";
import UiSelect from "@/shared/ui/UiSelect.vue";
import UiButton from "@/shared/ui/UiButton.vue";

interface Props {
  open: boolean;
  placeId: string;
  deviceId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const key = ref("");
const name = ref("");
const valueType = ref("number");
const unitLabel = ref("");
const precision = ref("2");
const error = ref("");

const valueTypeOptions = [
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
];

const { mutate, isPending } = useCreateSensor(props.placeId, props.deviceId);

function handleSubmit() {
  error.value = "";
  mutate(
    {
      key: key.value,
      name: name.value,
      value_type: valueType.value as "number" | "boolean",
      unit_label: unitLabel.value,
      precision: parseInt(precision.value) || 0,
    },
    {
      onSuccess: () => {
        key.value = "";
        name.value = "";
        unitLabel.value = "";
        precision.value = "2";
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
  <UiModal :open="open" title="Add sensor" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UiInput v-model="key" label="Key" placeholder="e.g. temperature" />
      <UiInput v-model="name" label="Name" placeholder="e.g. Temperature" />
      <UiSelect v-model="valueType" :options="valueTypeOptions" label="Value type" />
      <UiInput v-model="unitLabel" label="Unit label" placeholder="e.g. °C" />
      <UiInput v-model="precision" label="Precision" type="number" placeholder="2" />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <div class="flex justify-end">
        <UiButton type="submit" :loading="isPending">Add</UiButton>
      </div>
    </form>
  </UiModal>
</template>
