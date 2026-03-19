import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { Ref } from "vue";
import { computed } from "vue";
import type {
  Device,
  DeviceSummary,
  CreateDeviceRequest,
  CreateDeviceResponse,
} from "../model/types";
import { api } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";

export function useDevices(placeId: Ref<string> | string) {
  const id = typeof placeId === "string" ? placeId : placeId;
  return useQuery({
    queryKey: computed(() => queryKeys.devices.list(typeof id === "string" ? id : id.value)),
    queryFn: async () => {
      const resolvedId = typeof id === "string" ? id : id.value;
      const { data } = await api.get<{ devices: DeviceSummary[] }>(
        `/api/places/${resolvedId}/devices`,
      );
      return data.devices;
    },
  });
}

export function useDevicesWithDetails(placeId: Ref<string> | string) {
  const id = typeof placeId === "string" ? placeId : placeId;
  return useQuery({
    queryKey: computed(() => ["devices-full", typeof id === "string" ? id : id.value]),
    queryFn: async () => {
      const resolvedId = typeof id === "string" ? id : id.value;
      const { data: listData } = await api.get<{ devices: DeviceSummary[] }>(
        `/api/places/${resolvedId}/devices`,
      );
      const details = await Promise.all(
        listData.devices.map(async (d) => {
          const { data } = await api.get<Device>(
            `/api/places/${resolvedId}/devices/${d.device_id}`,
          );
          return data;
        }),
      );
      return details;
    },
  });
}

export function useDevice(placeId: Ref<string> | string, deviceId: Ref<string> | string) {
  const pId = typeof placeId === "string" ? placeId : placeId;
  const dId = typeof deviceId === "string" ? deviceId : deviceId;
  return useQuery({
    queryKey: computed(() =>
      queryKeys.devices.detail(
        typeof pId === "string" ? pId : pId.value,
        typeof dId === "string" ? dId : dId.value,
      ),
    ),
    queryFn: async () => {
      const resolvedPId = typeof pId === "string" ? pId : pId.value;
      const resolvedDId = typeof dId === "string" ? dId : dId.value;
      const { data } = await api.get<Device>(`/api/places/${resolvedPId}/devices/${resolvedDId}`);
      return data;
    },
  });
}

export function useCreateDevice(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateDeviceRequest) => {
      const { data } = await api.post<CreateDeviceResponse>(`/api/places/${placeId}/devices`, req);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.list(placeId) });
    },
  });
}

export function useUpdateDevice(placeId: string, deviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: { name: string }) => {
      await api.put(`/api/places/${placeId}/devices/${deviceId}`, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.list(placeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.detail(placeId, deviceId) });
    },
  });
}

export function useDeleteDevice(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deviceId: string) => {
      await api.delete(`/api/places/${placeId}/devices/${deviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.list(placeId) });
    },
  });
}

export function useRegenerateToken(placeId: string, deviceId: string) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ token: string }>(
        `/api/places/${placeId}/devices/${deviceId}/regenerate-token`,
      );
      return data.token;
    },
  });
}
