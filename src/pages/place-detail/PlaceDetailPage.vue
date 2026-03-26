<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePlace } from "@/entities/place/api/place.api";
import { useDevices } from "@/entities/device/api/device.api";
import { fetchLatestReadings } from "@/entities/device/api/telemetry.api";
import PlaceTabs from "@/widgets/place-tabs/PlaceTabs.vue";
import EditPlaceModal from "@/features/edit-place/EditPlaceModal.vue";
import DeletePlaceButton from "@/features/delete-place/DeletePlaceButton.vue";
import UiButton from "@/shared/ui/UiButton.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import { useMqtt } from "@/shared/composables/useMqtt";

const route = useRoute();
const router = useRouter();
const placeId = computed(() => route.params.placeId as string);
const { data: place, isLoading } = usePlace(placeId);
const { data: devices } = useDevices(placeId);

const showEditModal = ref(false);

const canManage = computed(
  () => place.value?.user_role === "owner" || place.value?.user_role === "admin",
);

const { latestValues } = useMqtt(placeId);

// Preload latest readings from API for each device
watch(
  devices,
  async (deviceList) => {
    if (!deviceList) return;
    const results = await Promise.allSettled(
      deviceList.map(async (d) => {
        const readings = await fetchLatestReadings(placeId.value, d.device_id);
        return { deviceId: d.device_id, readings };
      }),
    );
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      const { deviceId, readings } = result.value;
      if (!latestValues.value.has(deviceId)) {
        latestValues.value.set(deviceId, new Map());
      }
      const deviceMap = latestValues.value.get(deviceId)!;
      for (const reading of readings) {
        // Only set if MQTT hasn't already provided a fresher value
        if (!deviceMap.has(reading.key)) {
          deviceMap.set(reading.key, { value: reading.value, timestamp: reading.time });
        }
      }
    }
    latestValues.value = new Map(latestValues.value);
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center py-16">
      <UiSpinner size="lg" />
    </div>

    <template v-else-if="place">
      <div class="mb-6">
        <button
          class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-4 cursor-pointer"
          @click="router.push({ name: 'places' })"
        >
          &larr; Back to places
        </button>

        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">{{ place.name }}</h1>
            <p v-if="place.description" class="mt-1 text-sm text-[var(--color-text-secondary)]">
              {{ place.description }}
            </p>
          </div>
          <div v-if="canManage" class="flex items-center gap-2">
            <UiButton
              variant="secondary"
              size="sm"
              @click="router.push({ name: 'devices-list', params: { placeId } })"
            >
              Manage devices
            </UiButton>
            <UiButton variant="secondary" size="sm" @click="showEditModal = true"> Edit </UiButton>
            <DeletePlaceButton v-if="place.user_role === 'owner'" :place-id="place.place_id" />
          </div>
        </div>
      </div>

      <PlaceTabs :place-id="placeId" :can-manage="canManage" :latest-values="latestValues" />

      <EditPlaceModal :open="showEditModal" :place="place" @close="showEditModal = false" />
    </template>
  </div>
</template>
