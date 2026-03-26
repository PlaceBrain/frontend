<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDevices } from "@/entities/device/api/device.api";
import AddDeviceModal from "@/features/manage-devices/AddDeviceModal.vue";
import UiButton from "@/shared/ui/UiButton.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import UiEmptyState from "@/shared/ui/UiEmptyState.vue";
import UiBadge from "@/shared/ui/UiBadge.vue";

const route = useRoute();
const router = useRouter();
const placeId = computed(() => route.params.placeId as string);

const { data: devices, isLoading } = useDevices(placeId);
const showAddModal = ref(false);

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return "Never";
  const date = new Date(lastSeen);
  return date.toLocaleString();
}
</script>

<template>
  <div>
    <UiButton
      variant="ghost"
      size="sm"
      class="mb-4"
      @click="router.push({ name: 'place-detail', params: { placeId } })"
    >
      &larr; Back to place
    </UiButton>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">Devices</h1>
      <UiButton size="sm" @click="showAddModal = true">Add device</UiButton>
    </div>

    <div v-if="isLoading" class="flex justify-center py-16">
      <UiSpinner size="lg" />
    </div>

    <UiEmptyState
      v-else-if="!devices?.length"
      title="No devices"
      description="Add your first device to start monitoring."
    >
      <template #action>
        <UiButton @click="showAddModal = true">Add device</UiButton>
      </template>
    </UiEmptyState>

    <div v-else class="divide-y divide-[var(--color-border)]">
      <button
        v-for="device in devices"
        :key="device.device_id"
        class="w-full flex items-center justify-between py-4 hover:bg-[var(--color-surface)] transition-colors cursor-pointer text-left px-2 rounded-lg"
        @click="
          router.push({ name: 'device-detail', params: { placeId, deviceId: device.device_id } })
        "
      >
        <div>
          <div class="text-sm font-medium text-[var(--color-text-primary)]">{{ device.name }}</div>
          <div class="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Last seen: {{ formatLastSeen(device.last_seen_at) }}
          </div>
        </div>
        <UiBadge :variant="device.status === 'online' ? 'success' : 'default'">
          {{ device.status }}
        </UiBadge>
      </button>
    </div>

    <AddDeviceModal :open="showAddModal" :place-id="placeId" @close="showAddModal = false" />
  </div>
</template>
