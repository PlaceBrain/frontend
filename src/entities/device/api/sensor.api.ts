import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { Sensor, CreateSensorRequest, Threshold, SetThresholdRequest } from "../model/types";
import { api } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";

export function useSensors(placeId: string, deviceId: string) {
  return useQuery({
    queryKey: queryKeys.sensors.list(placeId, deviceId),
    queryFn: async () => {
      const { data } = await api.get<{ sensors: Sensor[] }>(
        `/api/places/${placeId}/devices/${deviceId}/sensors`,
      );
      return data.sensors;
    },
  });
}

export function useCreateSensor(placeId: string, deviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateSensorRequest) => {
      const { data } = await api.post<{ sensor_id: string }>(
        `/api/places/${placeId}/devices/${deviceId}/sensors`,
        req,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sensors.list(placeId, deviceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.detail(placeId, deviceId) });
    },
  });
}

export function useUpdateSensor(placeId: string, deviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sensorId,
      ...req
    }: {
      sensorId: string;
      name: string;
      unit_label: string;
      precision: number;
    }) => {
      await api.put(`/api/places/${placeId}/devices/${deviceId}/sensors/${sensorId}`, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sensors.list(placeId, deviceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.detail(placeId, deviceId) });
    },
  });
}

export function useDeleteSensor(placeId: string, deviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sensorId: string) => {
      await api.delete(`/api/places/${placeId}/devices/${deviceId}/sensors/${sensorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sensors.list(placeId, deviceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.detail(placeId, deviceId) });
    },
  });
}

export function useThresholds(placeId: string, deviceId: string, sensorId: string) {
  return useQuery({
    queryKey: queryKeys.thresholds.list(placeId, deviceId, sensorId),
    queryFn: async () => {
      const { data } = await api.get<{ thresholds: Threshold[] }>(
        `/api/places/${placeId}/devices/${deviceId}/sensors/${sensorId}/thresholds`,
      );
      return data.thresholds;
    },
  });
}

export function useSetThreshold(placeId: string, deviceId: string, sensorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: SetThresholdRequest) => {
      const { data } = await api.post<{ threshold_id: string }>(
        `/api/places/${placeId}/devices/${deviceId}/sensors/${sensorId}/thresholds`,
        req,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.thresholds.list(placeId, deviceId, sensorId),
      });
    },
  });
}

export function useDeleteThreshold(placeId: string, deviceId: string, sensorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (thresholdId: string) => {
      await api.delete(
        `/api/places/${placeId}/devices/${deviceId}/sensors/${sensorId}/thresholds/${thresholdId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.thresholds.list(placeId, deviceId, sensorId),
      });
    },
  });
}
