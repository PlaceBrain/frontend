<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type uPlot from "uplot";
import type { Sensor } from "@/entities/device/model/types";
import {
  useReadingsHistory,
  fetchHistory,
  type HistoryParams,
} from "@/entities/device/api/telemetry.api";
import { useChart } from "@/shared/composables/useChart";
import UiSpinner from "@/shared/ui/UiSpinner.vue";

interface Props {
  placeId: string;
  deviceId: string;
  sensor: Sensor;
  periodFrom: string;
  periodTo: string;
  interval: number;
  isLive: boolean;
  latestValues?: Map<string, Map<string, { value: number; timestamp: string }>>;
}

const props = defineProps<Props>();

const containerRef = ref<HTMLElement | null>(null);
const { chart, createChart, appendPoint, destroy } = useChart(containerRef, {
  title: props.sensor.name || props.sensor.key,
  unit: props.sensor.unit_label,
  precision: props.sensor.precision,
  showBand: true,
});

const historyParams = computed<HistoryParams>(() => ({
  from: props.periodFrom,
  to: props.periodTo,
  interval: props.interval,
  keys: [props.sensor.key],
}));

const fetchEnabled = computed(() => !props.isLive);

const { data: seriesData, isLoading } = useReadingsHistory(
  props.placeId,
  props.deviceId,
  historyParams,
  fetchEnabled,
);

function buildChartData(): { data: uPlot.AlignedData; mode: "raw" | "aggregated" } | null {
  if (!seriesData.value?.length) return null;

  const series = seriesData.value[0];

  if (series.raw_points.length > 0) {
    const timestamps = series.raw_points.map((p) => new Date(p.time).getTime() / 1000);
    const values = series.raw_points.map((p) => p.value);
    return { data: [timestamps, values], mode: "raw" };
  }

  if (series.points.length > 0) {
    const timestamps = series.points.map((p) => new Date(p.time).getTime() / 1000);
    const avgs = series.points.map((p) => p.avg);
    const mins = series.points.map((p) => p.min);
    const maxs = series.points.map((p) => p.max);
    return { data: [timestamps, avgs, mins, maxs] as uPlot.AlignedData, mode: "aggregated" };
  }

  return null;
}

// Historical mode: render chart when data arrives
watch(seriesData, () => {
  if (props.isLive) return; // Don't touch chart while in live mode
  if (!seriesData.value) return;
  const result = buildChartData();
  if (result) {
    createChart(result.data, result.mode);
  }
});

// Live mode toggle — use version to cancel stale async operations
let liveVersion = 0;

watch(
  () => props.isLive,
  async (live) => {
    const version = ++liveVersion;
    destroy();

    if (!live) return;

    const now = new Date();
    const from = new Date(now.getTime() - 3600_000);
    try {
      const seriesData = await fetchHistory(props.placeId, props.deviceId, {
        from: from.toISOString(),
        to: now.toISOString(),
        interval: 0,
        keys: [props.sensor.key],
      });
      if (version !== liveVersion) return; // Stale — user toggled again
      const series = seriesData[0];
      if (series?.raw_points.length) {
        const timestamps = series.raw_points.map(
          (p: { time: string }) => new Date(p.time).getTime() / 1000,
        );
        const values = series.raw_points.map((p: { value: number }) => p.value);
        createChart([timestamps, values], "raw");
      }
    } catch {
      // Auth error or network issue — chart stays empty until MQTT provides data
    }
  },
);

// Append MQTT points in live mode
watch(
  () => {
    if (!props.isLive || !props.latestValues) return null;
    const deviceMap = props.latestValues.get(props.deviceId);
    if (!deviceMap) return null;
    return deviceMap.get(props.sensor.key) ?? null;
  },
  (liveVal) => {
    if (!liveVal || !props.isLive) return;
    const ts = new Date(liveVal.timestamp).getTime() / 1000;
    if (!chart.value) {
      createChart([[ts], [liveVal.value]], "raw");
    } else {
      appendPoint(ts, liveVal.value);
    }
  },
);

function getLiveValue(): string {
  if (!props.latestValues) return "--";
  const deviceMap = props.latestValues.get(props.deviceId);
  if (!deviceMap) return "--";
  const val = deviceMap.get(props.sensor.key);
  if (!val) return "--";
  return val.value.toFixed(props.sensor.precision);
}
</script>

<template>
  <div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
    <div class="flex items-center justify-between mb-3">
      <div>
        <span class="text-sm font-medium text-[var(--color-text-primary)]">
          {{ sensor.name || sensor.key }}
        </span>
        <span v-if="sensor.unit_label" class="text-xs text-[var(--color-text-secondary)] ml-1">
          ({{ sensor.unit_label }})
        </span>
      </div>
      <span class="text-sm font-mono text-[var(--color-text-primary)]">
        {{ getLiveValue() }}
        <span v-if="sensor.unit_label" class="text-xs text-[var(--color-text-secondary)]">
          {{ sensor.unit_label }}
        </span>
      </span>
    </div>

    <div v-if="isLoading && !isLive" class="flex justify-center py-12">
      <UiSpinner />
    </div>
    <div ref="containerRef" class="w-full" />
  </div>
</template>
