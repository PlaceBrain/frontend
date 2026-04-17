<script setup lang="ts">
import { computed, inject, reactive } from "vue";
import { AlertTriangle, Bell, Check } from "lucide-vue-next";
import { placeDetailKey } from "@/pages/place-detail/context";
import { useAlerts, useResolveAlert } from "@/entities/alert/api/alert.api";
import { useDevicesWithDetails } from "@/entities/device/api/device.api";
import {
  ALERT_SEVERITY_OPTIONS,
  ALERT_STATUS_OPTIONS,
  ALERT_TIME_RANGE_OPTIONS,
  timeRangeToIso,
  type Alert,
  type AlertListFilters,
  type AlertSeverity,
  type AlertStatus,
} from "@/entities/alert/model/types";
import UiSelect from "@/shared/ui/UiSelect.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import UiEmptyState from "@/shared/ui/UiEmptyState.vue";
import UiBadge from "@/shared/ui/UiBadge.vue";
import UiButton from "@/shared/ui/UiButton.vue";
import { useToast } from "@/shared/composables/useToast";
import { getErrorMessage } from "@/shared/api/types";

const ctx = inject(placeDetailKey);
if (!ctx) throw new Error("PlaceAlertsPage must be nested inside PlaceDetailPage");
const { placeId, canManage, alerts: liveAlerts } = ctx;

const toast = useToast();

const uiFilters = reactive<{
  severity: string;
  sensor_id: string;
  status: string;
  range: string;
}>({
  severity: "",
  sensor_id: "",
  status: "",
  range: "24h",
});

const queryFilters = computed<AlertListFilters>(() => ({
  severity: (uiFilters.severity || undefined) as AlertSeverity | undefined,
  sensor_id: uiFilters.sensor_id || undefined,
  status: (uiFilters.status || undefined) as AlertStatus | undefined,
  from: timeRangeToIso(uiFilters.range),
}));

const { data: historical, isLoading } = useAlerts(placeId, queryFilters);
const { data: devices } = useDevicesWithDetails(placeId);
const { mutate: resolveMutate, isPending: isResolving } = useResolveAlert(placeId);

const sensorOptions = computed(() => {
  const opts: { value: string; label: string }[] = [{ value: "", label: "All sensors" }];
  const seen = new Set<string>();
  for (const device of devices.value ?? []) {
    for (const sensor of device.sensors) {
      if (seen.has(sensor.sensor_id)) continue;
      seen.add(sensor.sensor_id);
      opts.push({
        value: sensor.sensor_id,
        label: `${device.name} · ${sensor.name || sensor.key}`,
      });
    }
  }
  return opts;
});

const sensorLabelById = computed(() => {
  const map = new Map<string, string>();
  for (const device of devices.value ?? []) {
    for (const sensor of device.sensors) {
      map.set(sensor.sensor_id, `${device.name} · ${sensor.name || sensor.key}`);
    }
  }
  return map;
});

function matchesFilters(a: Alert): boolean {
  if (uiFilters.severity && a.severity !== uiFilters.severity) return false;
  if (uiFilters.sensor_id && a.sensor_id !== uiFilters.sensor_id) return false;
  if (uiFilters.status && a.status !== uiFilters.status) return false;
  const fromIso = timeRangeToIso(uiFilters.range);
  if (fromIso && new Date(a.created_at) < new Date(fromIso)) return false;
  return true;
}

const mergedAlerts = computed<Alert[]>(() => {
  const byId = new Map<string, Alert>();
  for (const a of historical.value ?? []) {
    byId.set(a.id, a);
  }
  for (const a of liveAlerts.value) {
    if (!matchesFilters(a)) {
      if (byId.has(a.id)) byId.set(a.id, a);
      continue;
    }
    byId.set(a.id, a);
  }
  return Array.from(byId.values())
    .filter(matchesFilters)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString();
}

function describeBreach(a: Alert): string {
  const comparator = a.threshold_type === "max" ? "exceeded max" : "fell below min";
  return `${a.value} ${comparator} ${a.threshold_value}`;
}

function onResolve(alertId: string) {
  resolveMutate(alertId, {
    onSuccess: () => toast.success("Alert resolved"),
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <UiSelect v-model="uiFilters.severity" label="Severity" :options="ALERT_SEVERITY_OPTIONS" />
      <UiSelect v-model="uiFilters.sensor_id" label="Sensor" :options="sensorOptions" />
      <UiSelect v-model="uiFilters.status" label="Status" :options="ALERT_STATUS_OPTIONS" />
      <UiSelect v-model="uiFilters.range" label="Period" :options="ALERT_TIME_RANGE_OPTIONS" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-16">
      <UiSpinner size="lg" />
    </div>

    <UiEmptyState
      v-else-if="!mergedAlerts.length"
      title="No alerts"
      description="No alerts match the current filters."
    >
      <template #icon>
        <Bell class="h-12 w-12 text-[var(--color-text-secondary)] opacity-40 mb-4" />
      </template>
    </UiEmptyState>

    <ul v-else class="flex flex-col gap-2">
      <li
        v-for="alert in mergedAlerts"
        :key="alert.id"
        class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div class="flex items-start gap-3 min-w-0">
            <AlertTriangle
              class="h-5 w-5 shrink-0 mt-0.5"
              :class="
                alert.severity === 'critical'
                  ? 'text-[var(--color-danger)]'
                  : 'text-[var(--color-warning)]'
              "
            />
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <UiBadge :variant="alert.severity === 'critical' ? 'danger' : 'warning'">
                  {{ alert.severity }}
                </UiBadge>
                <UiBadge :variant="alert.status === 'resolved' ? 'success' : 'accent'">
                  {{ alert.status }}
                </UiBadge>
                <span class="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {{ sensorLabelById.get(alert.sensor_id) ?? alert.key }}
                </span>
              </div>
              <div class="mt-1 text-sm text-[var(--color-text-secondary)]">
                {{ describeBreach(alert) }}
              </div>
              <div class="mt-1 text-xs text-[var(--color-text-secondary)]">
                Triggered {{ formatTime(alert.created_at) }}
                <template v-if="alert.resolved_at">
                  · Resolved {{ formatTime(alert.resolved_at) }}
                </template>
              </div>
            </div>
          </div>
          <div v-if="canManage && alert.status === 'active'" class="shrink-0">
            <UiButton
              variant="secondary"
              size="sm"
              :loading="isResolving"
              @click="onResolve(alert.id)"
            >
              <Check class="h-4 w-4 mr-1" />
              Resolve
            </UiButton>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
