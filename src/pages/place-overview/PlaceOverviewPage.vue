<script setup lang="ts">
import { computed, inject } from "vue";
import { useDevices } from "@/entities/device/api/device.api";
import SensorsPanel from "@/widgets/sensors-panel/SensorsPanel.vue";
import ActuatorsPanel from "@/widgets/actuators-panel/ActuatorsPanel.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import { placeDetailKey } from "@/pages/place-detail/context";

const ctx = inject(placeDetailKey);
if (!ctx) throw new Error("PlaceOverviewPage must be nested inside PlaceDetailPage");

const { placeId, canManage, latestValues } = ctx;

const { data: devicesData, isLoading } = useDevices(placeId);

const stats = computed(() => {
  const items = devicesData.value?.items ?? [];
  const online = items.filter((d) => d.status === "online").length;
  return {
    total: items.length,
    online,
    offline: items.length - online,
  };
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <div v-if="isLoading" class="flex justify-center py-8">
      <UiSpinner />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div class="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
          Devices
        </div>
        <div class="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
          {{ stats.total }}
        </div>
      </div>
      <div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div class="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
          Online
        </div>
        <div class="mt-1 text-2xl font-bold text-[var(--color-success,var(--color-accent))]">
          {{ stats.online }}
        </div>
      </div>
      <div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div class="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
          Offline
        </div>
        <div class="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
          {{ stats.offline }}
        </div>
      </div>
    </div>

    <SensorsPanel :place-id="placeId" :can-manage="canManage" :latest-values="latestValues" />

    <ActuatorsPanel :place-id="placeId" :can-manage="canManage" :latest-values="latestValues" />
  </div>
</template>
