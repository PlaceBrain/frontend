<script setup lang="ts">
import { computed, provide, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { placeDetailKey } from "./context";
import { usePlace } from "@/entities/place/api/place.api";
import { useDevicesWithDetails } from "@/entities/device/api/device.api";
import { fetchLatestReadings } from "@/entities/device/api/telemetry.api";
import PlaceTabsNav from "@/widgets/place-tabs/PlaceTabsNav.vue";
import UiButton from "@/shared/ui/UiButton.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import { useMqtt } from "@/shared/composables/useMqtt";

const route = useRoute();
const router = useRouter();
const placeId = computed(() => route.params.placeId as string);
const { data: place, isLoading } = usePlace(placeId);
const { data: devices } = useDevicesWithDetails(placeId);

const canManage = computed(
  () => place.value?.user_role === "owner" || place.value?.user_role === "admin",
);

const { latestValues } = useMqtt(placeId);

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
        if (!deviceMap.has(reading.key)) {
          deviceMap.set(reading.key, { value: reading.value, timestamp: reading.time });
        }
      }
    }
    latestValues.value = new Map(latestValues.value);
  },
  { immediate: true },
);

provide(placeDetailKey, { placeId, canManage, latestValues });
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center py-16">
      <UiSpinner size="lg" />
    </div>

    <template v-else-if="place">
      <div class="mb-6">
        <UiButton variant="ghost" size="sm" class="mb-4" @click="router.push({ name: 'places' })">
          &larr; Back to places
        </UiButton>

        <div class="min-h-[36px]">
          <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">{{ place.name }}</h1>
          <p v-if="place.description" class="mt-1 text-sm text-[var(--color-text-secondary)]">
            {{ place.description }}
          </p>
        </div>
      </div>

      <PlaceTabsNav />

      <div class="mt-6">
        <RouterView />
      </div>
    </template>
  </div>
</template>
