<script setup lang="ts">
import { ref } from "vue";
import UiTabs from "@/shared/ui/UiTabs.vue";
import MembersPanel from "@/widgets/members-panel/MembersPanel.vue";
import SensorsPanel from "@/widgets/sensors-panel/SensorsPanel.vue";
import ActuatorsPanel from "@/widgets/actuators-panel/ActuatorsPanel.vue";

interface Props {
  placeId: string;
  canManage: boolean;
  latestValues?: Map<string, Map<string, { value: number; timestamp: string }>>;
}

defineProps<Props>();

const activeTab = ref("sensors");

const tabs = [
  { key: "sensors", label: "Sensors" },
  { key: "actuators", label: "Actuators" },
  { key: "members", label: "Members" },
];
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
      <MembersPanel
        v-else-if="activeTab === 'members'"
        :place-id="placeId"
        :can-manage="canManage"
      />
    </div>
  </div>
</template>
