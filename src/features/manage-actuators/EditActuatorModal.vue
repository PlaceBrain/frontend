<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useUpdateActuator, useDeleteActuator } from '@/entities/device/api/actuator.api';
import { getErrorMessage } from '@/shared/api/types';
import UiModal from '@/shared/ui/UiModal.vue';
import UiInput from '@/shared/ui/UiInput.vue';
import UiButton from '@/shared/ui/UiButton.vue';
import type { Actuator } from '@/entities/device/model/types';

interface Props {
  open: boolean;
  placeId: string;
  deviceId: string;
  actuator: Actuator;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const name = ref(props.actuator.name);
const unitLabel = ref(props.actuator.unit_label);
const precision = ref(String(props.actuator.precision));
const minValue = ref(String(props.actuator.min_value ?? ''));
const maxValue = ref(String(props.actuator.max_value ?? ''));
const step = ref(String(props.actuator.step ?? ''));
const enumOptionsStr = ref(props.actuator.enum_options?.join(', ') ?? '');
const error = ref('');

const isNumber = computed(() => props.actuator.value_type === 'number');
const isEnum = computed(() => props.actuator.value_type === 'enum');

watch(() => props.actuator, (a) => {
  name.value = a.name;
  unitLabel.value = a.unit_label;
  precision.value = String(a.precision);
  minValue.value = String(a.min_value ?? '');
  maxValue.value = String(a.max_value ?? '');
  step.value = String(a.step ?? '');
  enumOptionsStr.value = a.enum_options?.join(', ') ?? '';
});

const { mutate: update, isPending: isUpdating } = useUpdateActuator(props.placeId, props.deviceId);
const { mutate: remove, isPending: isRemoving } = useDeleteActuator(props.placeId, props.deviceId);

function handleSubmit() {
  error.value = '';
  const req: Record<string, unknown> = {
    actuatorId: props.actuator.actuator_id,
    name: name.value,
    unit_label: unitLabel.value,
    precision: parseInt(precision.value) || 0,
  };
  if (isNumber.value) {
    req.min_value = parseFloat(minValue.value) || undefined;
    req.max_value = parseFloat(maxValue.value) || undefined;
    req.step = parseFloat(step.value) || undefined;
  }
  if (isEnum.value) {
    req.enum_options = enumOptionsStr.value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  update(req as any, {
    onSuccess: () => emit('close'),
    onError: (e) => { error.value = getErrorMessage(e); },
  });
}

function handleDelete() {
  if (!confirm('Delete this actuator?')) return;
  remove(props.actuator.actuator_id, {
    onSuccess: () => emit('close'),
    onError: (e) => { error.value = getErrorMessage(e); },
  });
}
</script>

<template>
  <UiModal :open="open" title="Edit actuator" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UiInput v-model="name" label="Name" />
      <UiInput v-model="unitLabel" label="Unit label" />
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
      />
      <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
      <div class="flex justify-between">
        <UiButton variant="danger" size="sm" @click="handleDelete" :loading="isRemoving">
          Delete
        </UiButton>
        <UiButton type="submit" :loading="isUpdating">Save</UiButton>
      </div>
    </form>
  </UiModal>
</template>
