<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useDevicesWithDetails } from "@/entities/device/api/device.api";
import type { Sensor } from "@/entities/device/model/types";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import UiEmptyState from "@/shared/ui/UiEmptyState.vue";
import UiBadge from "@/shared/ui/UiBadge.vue";

interface Props {
  placeId: string;
  canManage: boolean;
  latestValues?: Map<string, Map<string, { value: number; timestamp: string }>>;
}

const props = defineProps<Props>();
const router = useRouter();

const { data: devices, isLoading } = useDevicesWithDetails(props.placeId);

interface SensorRow {
  sensor: Sensor;
  deviceName: string;
  deviceId: string;
}

const sensorRows = computed<SensorRow[]>(() => {
  if (!devices.value) return [];
  const rows: SensorRow[] = [];
  for (const device of devices.value) {
    for (const sensor of device.sensors) {
      rows.push({ sensor, deviceName: device.name, deviceId: device.device_id });
    }
  }
  return rows;
});

function getLiveValue(deviceId: string, key: string) {
  if (!props.latestValues) return null;
  const deviceValues = props.latestValues.get(deviceId);
  if (!deviceValues) return null;
  return deviceValues.get(key) ?? null;
}

function navigateToDevice(deviceId: string) {
  router.push({ name: "device-detail", params: { placeId: props.placeId, deviceId } });
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-[var(--color-text-primary)]">Sensors</h3>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <UiSpinner />
    </div>

    <UiEmptyState
      v-else-if="!sensorRows.length"
      title="No sensors"
      description="Add sensors to your devices to start monitoring."
    />

    <div v-else class="divide-y divide-[var(--color-border)]">
      <div
        v-for="row in sensorRows"
        :key="row.sensor.sensor_id"
        class="flex items-center justify-between py-3"
      >
        <div class="min-w-0 flex-1">
          <div class="text-sm font-medium text-[var(--color-text-primary)]">
            {{ row.sensor.name || row.sensor.key }}
          </div>
          <div class="text-xs text-[var(--color-text-secondary)]">
            {{ row.deviceName }}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right">
            <template v-if="getLiveValue(row.deviceId, row.sensor.key)">
              <span class="text-sm font-mono text-[var(--color-text-primary)]">
                {{
                  getLiveValue(row.deviceId, row.sensor.key)!.value.toFixed(row.sensor.precision)
                }}
              </span>
              <span
                v-if="row.sensor.unit_label"
                class="text-xs text-[var(--color-text-secondary)] ml-1"
              >
                {{ row.sensor.unit_label }}
              </span>
            </template>
            <UiBadge v-else variant="default">--</UiBadge>
          </div>

          <button
            v-if="canManage"
            class="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="Device settings"
            @click="navigateToDevice(row.deviceId)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
