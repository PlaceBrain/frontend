<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDevice, useDeleteDevice, useRegenerateToken } from "@/entities/device/api/device.api";
import AddSensorModal from "@/features/manage-sensors/AddSensorModal.vue";
import EditSensorModal from "@/features/manage-sensors/EditSensorModal.vue";
import ManageThresholdsModal from "@/features/manage-sensors/ManageThresholdsModal.vue";
import AddActuatorModal from "@/features/manage-actuators/AddActuatorModal.vue";
import EditActuatorModal from "@/features/manage-actuators/EditActuatorModal.vue";
import EditDeviceModal from "@/features/manage-devices/EditDeviceModal.vue";
import UiButton from "@/shared/ui/UiButton.vue";
import UiConfirmDialog from "@/shared/ui/UiConfirmDialog.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import UiBadge from "@/shared/ui/UiBadge.vue";
import UiEmptyState from "@/shared/ui/UiEmptyState.vue";
import type { Sensor, Actuator } from "@/entities/device/model/types";

const route = useRoute();
const router = useRouter();
const placeId = computed(() => route.params.placeId as string);
const deviceId = computed(() => route.params.deviceId as string);

const { data: device, isLoading } = useDevice(placeId, deviceId);
const { mutate: deleteDevice, isPending: isDeleting } = useDeleteDevice(placeId.value);
const { mutate: regenerateToken, isPending: isRegenerating } = useRegenerateToken(
  placeId.value,
  deviceId.value,
);

const showEditModal = ref(false);
const showAddSensorModal = ref(false);
const showAddActuatorModal = ref(false);
const editSensor = ref<Sensor | null>(null);
const editActuator = ref<Actuator | null>(null);
const thresholdSensor = ref<Sensor | null>(null);
const newToken = ref<string | null>(null);
const showDeleteConfirm = ref(false);
const showRegenerateConfirm = ref(false);

function handleDelete() {
  deleteDevice(deviceId.value, {
    onSuccess: () => router.push({ name: "devices-list", params: { placeId: placeId.value } }),
  });
}

function handleRegenerate() {
  regenerateToken(undefined, {
    onSuccess: (token) => {
      newToken.value = token;
      showRegenerateConfirm.value = false;
    },
  });
}

function copyToken() {
  if (newToken.value) {
    navigator.clipboard.writeText(newToken.value);
  }
}
</script>

<template>
  <div>
    <button
      class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-4 cursor-pointer"
      @click="router.push({ name: 'devices-list', params: { placeId } })"
    >
      &larr; Back to devices
    </button>

    <div v-if="isLoading" class="flex justify-center py-16">
      <UiSpinner size="lg" />
    </div>

    <template v-else-if="device">
      <div class="flex items-start justify-between mb-6">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">{{ device.name }}</h1>
            <UiBadge :variant="device.status === 'online' ? 'success' : 'default'">
              {{ device.status }}
            </UiBadge>
          </div>
          <p v-if="device.last_seen_at" class="text-sm text-[var(--color-text-secondary)] mt-1">
            Last seen: {{ new Date(device.last_seen_at).toLocaleString() }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UiButton variant="secondary" size="sm" @click="showEditModal = true">Edit</UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            :loading="isRegenerating"
            @click="showRegenerateConfirm = true"
          >
            Regenerate token
          </UiButton>
          <UiButton
            variant="danger"
            size="sm"
            :loading="isDeleting"
            @click="showDeleteConfirm = true"
          >
            Delete
          </UiButton>
        </div>
      </div>

      <!-- Token display (one-time) -->
      <div
        v-if="newToken"
        class="mb-6 p-4 rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)]/5"
      >
        <p class="text-sm font-medium text-[var(--color-text-primary)] mb-2">
          New device token (save it now, shown once):
        </p>
        <div class="flex items-center gap-2">
          <code
            class="flex-1 text-sm font-mono bg-[var(--color-surface-elevated)] px-3 py-2 rounded border border-[var(--color-border)] break-all"
          >
            {{ newToken }}
          </code>
          <UiButton size="sm" variant="secondary" @click="copyToken">Copy</UiButton>
        </div>
      </div>

      <!-- Sensors section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Sensors</h2>
          <UiButton size="sm" @click="showAddSensorModal = true">Add sensor</UiButton>
        </div>

        <UiEmptyState
          v-if="!device.sensors.length"
          title="No sensors"
          description="Add sensors to monitor data from this device."
        />

        <div v-else class="divide-y divide-[var(--color-border)]">
          <div
            v-for="sensor in device.sensors"
            :key="sensor.sensor_id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <div class="text-sm font-medium text-[var(--color-text-primary)]">
                {{ sensor.name }}
              </div>
              <div class="text-xs text-[var(--color-text-secondary)]">
                {{ sensor.key }} &middot; {{ sensor.value_type }}
                <span v-if="sensor.unit_label"> &middot; {{ sensor.unit_label }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UiButton size="sm" variant="ghost" @click="thresholdSensor = sensor">
                Thresholds
              </UiButton>
              <UiButton size="sm" variant="ghost" @click="editSensor = sensor">Edit</UiButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Actuators section -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Actuators</h2>
          <UiButton size="sm" @click="showAddActuatorModal = true">Add actuator</UiButton>
        </div>

        <UiEmptyState
          v-if="!device.actuators.length"
          title="No actuators"
          description="Add actuators to control this device."
        />

        <div v-else class="divide-y divide-[var(--color-border)]">
          <div
            v-for="actuator in device.actuators"
            :key="actuator.actuator_id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <div class="text-sm font-medium text-[var(--color-text-primary)]">
                {{ actuator.name }}
              </div>
              <div class="text-xs text-[var(--color-text-secondary)]">
                {{ actuator.key }} &middot; {{ actuator.value_type }}
                <template v-if="actuator.value_type === 'number'">
                  &middot; {{ actuator.min_value }}–{{ actuator.max_value }}
                </template>
                <template v-if="actuator.value_type === 'enum'">
                  &middot; {{ actuator.enum_options?.join(", ") }}
                </template>
              </div>
            </div>
            <UiButton size="sm" variant="ghost" @click="editActuator = actuator">Edit</UiButton>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <EditDeviceModal
        :open="showEditModal"
        :place-id="placeId"
        :device="device"
        @close="showEditModal = false"
      />
      <AddSensorModal
        :open="showAddSensorModal"
        :place-id="placeId"
        :device-id="deviceId"
        @close="showAddSensorModal = false"
      />
      <EditSensorModal
        v-if="editSensor"
        :open="!!editSensor"
        :place-id="placeId"
        :device-id="deviceId"
        :sensor="editSensor"
        @close="editSensor = null"
      />
      <ManageThresholdsModal
        v-if="thresholdSensor"
        :open="!!thresholdSensor"
        :place-id="placeId"
        :device-id="deviceId"
        :sensor="thresholdSensor"
        @close="thresholdSensor = null"
      />
      <AddActuatorModal
        :open="showAddActuatorModal"
        :place-id="placeId"
        :device-id="deviceId"
        @close="showAddActuatorModal = false"
      />
      <EditActuatorModal
        v-if="editActuator"
        :open="!!editActuator"
        :place-id="placeId"
        :device-id="deviceId"
        :actuator="editActuator"
        @close="editActuator = null"
      />
      <UiConfirmDialog
        :open="showDeleteConfirm"
        title="Delete device"
        message="Are you sure you want to delete this device? This action cannot be undone."
        confirm-label="Delete"
        :loading="isDeleting"
        @confirm="handleDelete"
        @cancel="showDeleteConfirm = false"
      />
      <UiConfirmDialog
        :open="showRegenerateConfirm"
        title="Regenerate token"
        message="Regenerate token? The old token will stop working immediately."
        confirm-label="Regenerate"
        variant="primary"
        :loading="isRegenerating"
        @confirm="handleRegenerate"
        @cancel="showRegenerateConfirm = false"
      />
    </template>
  </div>
</template>
