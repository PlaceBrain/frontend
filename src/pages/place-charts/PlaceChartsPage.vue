<script setup lang="ts">
import { computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChartsPanel from "@/widgets/charts-panel/ChartsPanel.vue";
import { PERIODS } from "@/features/chart-controls/periods";
import { placeDetailKey } from "@/pages/place-detail/context";

const ctx = inject(placeDetailKey);
if (!ctx) throw new Error("PlaceChartsPage must be nested inside PlaceDetailPage");

const { placeId, latestValues } = ctx;

const route = useRoute();
const router = useRouter();

const PERIOD_KEYS = PERIODS.map((p) => p.key);

const period = computed(() => {
  const p = route.query.period as string;
  if (p === "live") return "live";
  return PERIOD_KEYS.includes(p) ? p : "8h";
});

const isLive = computed(() => period.value === "live");

function handlePeriodChange(p: string) {
  router.replace({ query: { ...route.query, period: p } });
}

function handleLiveToggle(live: boolean) {
  router.replace({ query: { ...route.query, period: live ? "live" : "8h" } });
}
</script>

<template>
  <ChartsPanel
    :place-id="placeId"
    :period="period"
    :is-live="isLive"
    :latest-values="latestValues"
    @update:period="handlePeriodChange"
    @update:is-live="handleLiveToggle"
  />
</template>
