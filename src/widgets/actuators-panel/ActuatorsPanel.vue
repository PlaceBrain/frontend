<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDevicesWithDetails } from '@/entities/device/api/device.api';
import { api } from '@/shared/api/client';
import type { Actuator } from '@/entities/device/model/types';
import UiSpinner from '@/shared/ui/UiSpinner.vue';
import UiEmptyState from '@/shared/ui/UiEmptyState.vue';

interface Props {
  placeId: string;
  canManage: boolean;
  latestValues?: Map<string, Map<string, { value: number; timestamp: string }>>;
}

const props = defineProps<Props>();
const router = useRouter();

const { data: devices, isLoading } = useDevicesWithDetails(props.placeId);

interface ActuatorRow {
  actuator: Actuator;
  deviceName: string;
  deviceId: string;
}

const actuatorRows = computed<ActuatorRow[]>(() => {
  if (!devices.value) return [];
  const rows: ActuatorRow[] = [];
  for (const device of devices.value) {
    for (const actuator of device.actuators) {
      rows.push({ actuator, deviceName: device.name, deviceId: device.device_id });
    }
  }
  return rows;
});

function navigateToDevice(deviceId: string) {
  router.push({ name: 'device-detail', params: { placeId: props.placeId, deviceId } });
}

const pendingCommands = ref<Set<string>>(new Set());

async function sendCommand(row: ActuatorRow, value: string) {
  const key = `${row.deviceId}:${row.actuator.key}`;
  pendingCommands.value.add(key);
  try {
    await api.post(`/api/places/${props.placeId}/devices/${row.deviceId}/command`, {
      actuator_key: row.actuator.key,
      value,
    });
  } finally {
    pendingCommands.value.delete(key);
  }
}

function handleToggle(row: ActuatorRow, currentValue: boolean) {
  sendCommand(row, String(!currentValue));
}

function handleSlider(row: ActuatorRow, event: Event) {
  const target = event.target as HTMLInputElement;
  sendCommand(row, target.value);
}

function handleSelect(row: ActuatorRow, event: Event) {
  const target = event.target as HTMLSelectElement;
  sendCommand(row, target.value);
}

function getLiveValue(deviceId: string, key: string) {
  if (!props.latestValues) return null;
  const deviceValues = props.latestValues.get(deviceId);
  if (!deviceValues) return null;
  return deviceValues.get(key) ?? null;
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-[var(--color-text-primary)]">Actuators</h3>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <UiSpinner />
    </div>

    <UiEmptyState
      v-else-if="!actuatorRows.length"
      title="No actuators"
      description="Add actuators to your devices to control them."
    />

    <div v-else class="divide-y divide-[var(--color-border)]">
      <div
        v-for="row in actuatorRows"
        :key="row.actuator.actuator_id"
        class="flex items-center justify-between py-3 gap-4"
      >
        <div class="min-w-0 flex-1">
          <div class="text-sm font-medium text-[var(--color-text-primary)]">
            {{ row.actuator.name || row.actuator.key }}
          </div>
          <div class="text-xs text-[var(--color-text-secondary)]">
            {{ row.deviceName }}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Boolean toggle -->
          <template v-if="row.actuator.value_type === 'boolean'">
            <button
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
              :class="getLiveValue(row.deviceId, row.actuator.key)?.value ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'"
              @click="handleToggle(row, !!getLiveValue(row.deviceId, row.actuator.key)?.value)"
            >
              <span
                class="inline-block h-4 w-4 rounded-full bg-white transition-transform"
                :class="getLiveValue(row.deviceId, row.actuator.key)?.value ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </template>

          <!-- Number slider -->
          <template v-else-if="row.actuator.value_type === 'number'">
            <div class="flex items-center gap-2">
              <span class="text-xs text-[var(--color-text-secondary)] font-mono w-12 text-right">
                {{ getLiveValue(row.deviceId, row.actuator.key)?.value?.toFixed(row.actuator.precision) ?? '--' }}
                <span v-if="row.actuator.unit_label" class="ml-0.5">{{ row.actuator.unit_label }}</span>
              </span>
              <input
                type="range"
                class="w-24 accent-[var(--color-accent)]"
                :min="row.actuator.min_value ?? 0"
                :max="row.actuator.max_value ?? 100"
                :step="row.actuator.step ?? 1"
                :value="getLiveValue(row.deviceId, row.actuator.key)?.value ?? row.actuator.min_value ?? 0"
                @change="handleSlider(row, $event)"
              />
            </div>
          </template>

          <!-- Enum select -->
          <template v-else-if="row.actuator.value_type === 'enum'">
            <select
              class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm text-[var(--color-text-primary)]"
              :value="getLiveValue(row.deviceId, row.actuator.key)?.value ?? ''"
              @change="handleSelect(row, $event)"
            >
              <option v-for="opt in row.actuator.enum_options" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </template>

          <button
            v-if="canManage"
            class="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="Device settings"
            @click="navigateToDevice(row.deviceId)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
