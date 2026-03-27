<script setup lang="ts">
import { computed } from "vue";
import { useDevicesWithDetails } from "@/entities/device/api/device.api";
import type { Sensor } from "@/entities/device/model/types";
import SensorChart from "@/widgets/sensor-chart/SensorChart.vue";
import PeriodSelector from "@/features/chart-controls/PeriodSelector.vue";
import { PERIODS } from "@/features/chart-controls/periods";
import LiveToggle from "@/features/chart-controls/LiveToggle.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import UiEmptyState from "@/shared/ui/UiEmptyState.vue";

interface Props {
  placeId: string;
  period: string;
  isLive: boolean;
  latestValues?: Map<string, Map<string, { value: number; timestamp: string }>>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:period": [period: string];
  "update:is-live": [live: boolean];
}>();

const { data: devices, isLoading } = useDevicesWithDetails(props.placeId);

interface SensorRow {
  sensor: Sensor;
  deviceId: string;
  deviceName: string;
}

const sensorRows = computed<SensorRow[]>(() => {
  if (!devices.value) return [];
  const rows: SensorRow[] = [];
  for (const device of devices.value) {
    for (const sensor of device.sensors) {
      rows.push({ sensor, deviceId: device.device_id, deviceName: device.name });
    }
  }
  return rows;
});

const periodConfig = computed(() => {
  const period = PERIODS.find((p) => p.key === props.period) ?? PERIODS[1];
  const now = new Date();
  const from = new Date(now.getTime() - period.hours * 3600_000);
  return {
    from: from.toISOString(),
    to: now.toISOString(),
    interval: period.interval,
  };
});

function handlePeriodChange(key: string) {
  emit("update:is-live", false);
  emit("update:period", key);
}

function handleLiveToggle(value: boolean) {
  emit("update:is-live", value);
  if (!value) {
    emit("update:period", "8h");
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-4">
      <PeriodSelector :model-value="period" @update:model-value="handlePeriodChange" />
      <LiveToggle :model-value="isLive" @update:model-value="handleLiveToggle" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <UiSpinner />
    </div>

    <UiEmptyState
      v-else-if="!sensorRows.length"
      title="No sensors"
      description="Add sensors to your devices to see charts."
    />

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SensorChart
        v-for="row in sensorRows"
        :key="`${row.deviceId}-${row.sensor.sensor_id}`"
        :place-id="placeId"
        :device-id="row.deviceId"
        :sensor="row.sensor"
        :period-from="periodConfig.from"
        :period-to="periodConfig.to"
        :interval="periodConfig.interval"
        :is-live="isLive"
        :latest-values="latestValues"
      />
    </div>
  </div>
</template>
