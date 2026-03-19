import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Actuator, CreateActuatorRequest, SendCommandRequest } from '../model/types';

export function useActuators(placeId: string, deviceId: string) {
  return useQuery({
    queryKey: queryKeys.actuators.list(placeId, deviceId),
    queryFn: async () => {
      const { data } = await api.get<{ actuators: Actuator[] }>(
        `/api/places/${placeId}/devices/${deviceId}/actuators`,
      );
      return data.actuators;
    },
  });
}

export function useCreateActuator(placeId: string, deviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateActuatorRequest) => {
      const { data } = await api.post<{ actuator_id: string }>(
        `/api/places/${placeId}/devices/${deviceId}/actuators`,
        req,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actuators.list(placeId, deviceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.detail(placeId, deviceId) });
    },
  });
}

export function useUpdateActuator(placeId: string, deviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      actuatorId,
      ...req
    }: {
      actuatorId: string;
      name: string;
      unit_label: string;
      precision: number;
      min_value?: number;
      max_value?: number;
      step?: number;
      enum_options?: string[];
    }) => {
      await api.put(`/api/places/${placeId}/devices/${deviceId}/actuators/${actuatorId}`, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actuators.list(placeId, deviceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.detail(placeId, deviceId) });
    },
  });
}

export function useDeleteActuator(placeId: string, deviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (actuatorId: string) => {
      await api.delete(`/api/places/${placeId}/devices/${deviceId}/actuators/${actuatorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actuators.list(placeId, deviceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.detail(placeId, deviceId) });
    },
  });
}

export function useSendCommand(placeId: string, deviceId: string) {
  return useMutation({
    mutationFn: async (req: SendCommandRequest) => {
      await api.post(`/api/places/${placeId}/devices/${deviceId}/command`, req);
    },
  });
}
