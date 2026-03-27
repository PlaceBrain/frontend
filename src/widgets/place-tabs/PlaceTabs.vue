<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import UiTabs from "@/shared/ui/UiTabs.vue";
import MembersPanel from "@/widgets/members-panel/MembersPanel.vue";
import SensorsPanel from "@/widgets/sensors-panel/SensorsPanel.vue";
import ActuatorsPanel from "@/widgets/actuators-panel/ActuatorsPanel.vue";
import ChartsPanel from "@/widgets/charts-panel/ChartsPanel.vue";
import { PERIODS } from "@/features/chart-controls/periods";

interface Props {
  placeId: string;
  canManage: boolean;
  latestValues?: Map<string, Map<string, { value: number; timestamp: string }>>;
}

defineProps<Props>();

const route = useRoute();
const router = useRouter();

const tabs = [
  { key: "sensors", label: "Sensors" },
  { key: "actuators", label: "Actuators" },
  { key: "charts", label: "Charts" },
  { key: "members", label: "Members" },
];

const TAB_KEYS = tabs.map((t) => t.key);
const PERIOD_KEYS = PERIODS.map((p) => p.key);

const activeTab = computed({
  get: () => {
    const t = route.query.tab as string;
    return TAB_KEYS.includes(t) ? t : "sensors";
  },
  set: (value: string) => {
    const query: Record<string, string> = { tab: value };
    if (value === "charts") {
      query.period = (route.query.period as string) || "8h";
    }
    router.replace({ query });
  },
});

const chartPeriod = computed(() => {
  const p = route.query.period as string;
  if (p === "live") return "live";
  return PERIOD_KEYS.includes(p) ? p : "8h";
});

const chartIsLive = computed(() => chartPeriod.value === "live");

function handlePeriodChange(period: string) {
  router.replace({ query: { tab: "charts", period } });
}

function handleLiveToggle(live: boolean) {
  router.replace({ query: { tab: "charts", period: live ? "live" : "8h" } });
}
</script>

<template>
  <div>
    <UiTabs v-model="activeTab" :tabs="tabs" />

    <div class="mt-4">
      <SensorsPanel
        v-if="activeTab === 'sensors'"
        :place-id="placeId"
        :can-manage="canManage"
        :latest-values="latestValues"
      />
      <ActuatorsPanel
        v-else-if="activeTab === 'actuators'"
        :place-id="placeId"
        :can-manage="canManage"
        :latest-values="latestValues"
      />
      <ChartsPanel
        v-else-if="activeTab === 'charts'"
        :place-id="placeId"
        :period="chartPeriod"
        :is-live="chartIsLive"
        :latest-values="latestValues"
        @update:period="handlePeriodChange"
        @update:is-live="handleLiveToggle"
      />
      <MembersPanel
        v-else-if="activeTab === 'members'"
        :place-id="placeId"
        :can-manage="canManage"
      />
    </div>
  </div>
</template>
