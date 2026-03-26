<script setup lang="ts">
import { ref, computed } from "vue";
import { useCreateActuator } from "@/entities/device/api/actuator.api";
import type { CreateActuatorRequest } from "@/entities/device/model/types";
import { getErrorMessage } from "@/shared/api/types";
import { useToast } from "@/shared/composables/useToast";
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
const valueType = ref("boolean");
const unitLabel = ref("");
const precision = ref("0");
const minValue = ref("0");
const maxValue = ref("100");
const step = ref("1");
const enumOptionsStr = ref("");
const error = ref("");

const valueTypeOptions = [
  { value: "boolean", label: "Boolean (on/off)" },
  { value: "number", label: "Number (slider)" },
  { value: "enum", label: "Enum (select)" },
];

const isNumber = computed(() => valueType.value === "number");
const isEnum = computed(() => valueType.value === "enum");

const { mutate, isPending } = useCreateActuator(props.placeId, props.deviceId);
const { success, error: showError } = useToast();

function handleSubmit() {
  error.value = "";
  const req: CreateActuatorRequest = {
    key: key.value,
    name: name.value,
    value_type: valueType.value as CreateActuatorRequest["value_type"],
    unit_label: unitLabel.value,
    precision: parseInt(precision.value) || 0,
  };
  if (isNumber.value) {
    req.min_value = parseFloat(minValue.value) || 0;
    req.max_value = parseFloat(maxValue.value) || 100;
    req.step = parseFloat(step.value) || 1;
  }
  if (isEnum.value) {
    req.enum_options = enumOptionsStr.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  mutate(req, {
    onSuccess: () => {
      success("Actuator added");
      key.value = "";
      name.value = "";
      enumOptionsStr.value = "";
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
  <UiModal :open="open" title="Add actuator" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UiInput v-model="key" label="Key" placeholder="e.g. relay_1" />
      <UiInput v-model="name" label="Name" placeholder="e.g. Main Relay" />
      <UiSelect v-model="valueType" :options="valueTypeOptions" label="Value type" />
      <UiInput v-model="unitLabel" label="Unit label" placeholder="optional" />
      <UiInput v-model="precision" label="Precision" type="number" />
      <template v-if="isNumber">
        <div class="grid grid-cols-3 gap-3">
          <UiInput v-model="minValue" label="Min" type="number" />
          <UiInput v-model="maxValue" label="Max" type="number" />
          <UiInput v-model="step" label="Step" type="number" />
        </div>
      </template>
      <UiInput
        v-if="isEnum"
        v-model="enumOptionsStr"
        label="Options (comma-separated)"
        placeholder="e.g. low, medium, high"
      />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <div class="flex justify-end">
        <UiButton type="submit" :loading="isPending">Add</UiButton>
      </div>
    </form>
  </UiModal>
</template>
