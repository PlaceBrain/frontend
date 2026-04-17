<script setup lang="ts">
import { ref } from "vue";
import {
  useThresholds,
  useSetThreshold,
  useDeleteThreshold,
} from "@/entities/device/api/sensor.api";
import { getErrorMessage } from "@/shared/api/types";
import { useToast } from "@/shared/composables/useToast";
import UiModal from "@/shared/ui/UiModal.vue";
import UiInput from "@/shared/ui/UiInput.vue";
import UiSelect from "@/shared/ui/UiSelect.vue";
import UiButton from "@/shared/ui/UiButton.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import UiBadge from "@/shared/ui/UiBadge.vue";
import type { Sensor } from "@/entities/device/model/types";

interface Props {
  open: boolean;
  placeId: string;
  deviceId: string;
  sensor: Sensor;
}

const props = defineProps<Props>();
defineEmits<{ close: [] }>();

const { data: thresholds, isLoading } = useThresholds(
  props.placeId,
  props.deviceId,
  props.sensor.sensor_id,
);
const { mutate: addThreshold, isPending: isAdding } = useSetThreshold(
  props.placeId,
  props.deviceId,
  props.sensor.sensor_id,
);
const { success, error: showError } = useToast();
const { mutate: removeThreshold } = useDeleteThreshold(
  props.placeId,
  props.deviceId,
  props.sensor.sensor_id,
);

const newType = ref("max");
const newValue = ref("");
const newSeverity = ref("warning");
const error = ref("");

const typeOptions = [
  { value: "min", label: "Min" },
  { value: "max", label: "Max" },
];

const severityOptions = [
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
];

function handleAdd() {
  error.value = "";
  addThreshold(
    {
      type: newType.value as "min" | "max",
      value: parseFloat(newValue.value),
      severity: newSeverity.value as "warning" | "critical",
    },
    {
      onSuccess: () => {
        success("Threshold saved");
        newValue.value = "";
      },
      onError: (e) => {
        error.value = getErrorMessage(e);
        showError(getErrorMessage(e));
      },
    },
  );
}

function handleRemove(thresholdId: string) {
  removeThreshold(thresholdId, {
    onSuccess: () => success("Threshold deleted"),
    onError: (e) => showError(getErrorMessage(e)),
  });
}
</script>

<template>
  <UiModal :open="open" :title="`Thresholds — ${sensor.name}`" @close="$emit('close')">
    <div class="flex flex-col gap-4">
      <div v-if="isLoading" class="flex justify-center py-4">
        <UiSpinner />
      </div>

      <div v-else-if="thresholds?.length" class="divide-y divide-[var(--color-border)]">
        <div
          v-for="t in thresholds"
          :key="t.threshold_id"
          class="flex items-center justify-between py-2"
        >
          <div class="flex items-center gap-2">
            <UiBadge :variant="t.severity === 'critical' ? 'danger' : 'warning'">
              {{ t.severity }}
            </UiBadge>
            <span class="text-sm text-[var(--color-text-primary)]">
              {{ t.type }} = {{ t.value }}
            </span>
          </div>
          <button
            class="text-sm text-[var(--color-danger)] hover:underline cursor-pointer"
            @click="handleRemove(t.threshold_id)"
          >
            Remove
          </button>
        </div>
      </div>

      <p v-else class="text-sm text-[var(--color-text-secondary)]">No thresholds configured.</p>

      <div class="border-t border-[var(--color-border)] pt-4">
        <h4 class="text-sm font-medium text-[var(--color-text-primary)] mb-3">Add threshold</h4>
        <form class="flex flex-col gap-3" @submit.prevent="handleAdd">
          <div class="grid grid-cols-2 gap-3">
            <UiSelect v-model="newType" :options="typeOptions" label="Type" />
            <UiSelect v-model="newSeverity" :options="severityOptions" label="Severity" />
          </div>
          <UiInput v-model="newValue" label="Value" type="number" placeholder="e.g. 60" />
          <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
          <div class="flex justify-end">
            <UiButton type="submit" size="sm" :loading="isAdding">Add</UiButton>
          </div>
        </form>
      </div>
    </div>
  </UiModal>
</template>
