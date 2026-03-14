<script setup lang="ts">
import { ref } from 'vue';
import UiTabs from '@/shared/ui/UiTabs.vue';
import UiEmptyState from '@/shared/ui/UiEmptyState.vue';
import MembersPanel from '@/widgets/members-panel/MembersPanel.vue';

interface Props {
  placeId: string;
  canManage: boolean;
}

defineProps<Props>();

const activeTab = ref('members');

const tabs = [
  { key: 'sensors', label: 'Sensors' },
  { key: 'devices', label: 'Devices' },
  { key: 'members', label: 'Members' },
];
</script>

<template>
  <div>
    <UiTabs v-model="activeTab" :tabs="tabs" />

    <div class="mt-4">
      <MembersPanel
        v-if="activeTab === 'members'"
        :place-id="placeId"
        :can-manage="canManage"
      />
      <UiEmptyState
        v-else-if="activeTab === 'sensors'"
        title="Sensors"
        description="Sensor monitoring will be available here soon."
      />
      <UiEmptyState
        v-else-if="activeTab === 'devices'"
        title="Devices"
        description="Device management will be available here soon."
      />
    </div>
  </div>
</template>
