import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { Ref } from "vue";
import { computed } from "vue";
import type { Place, CreatePlaceRequest, UpdatePlaceRequest } from "../model/types";
import { api } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";

export function usePlaces() {
  return useQuery({
    queryKey: queryKeys.places.all(),
    queryFn: async () => {
      const { data } = await api.get<{ places: Place[] }>("/api/places");
      return data.places;
    },
  });
}

export function usePlace(placeId: Ref<string> | string) {
  const id = typeof placeId === "string" ? placeId : placeId;
  return useQuery({
    queryKey: computed(() => queryKeys.places.detail(typeof id === "string" ? id : id.value)),
    queryFn: async () => {
      const resolvedId = typeof id === "string" ? id : id.value;
      const { data } = await api.get<Place>(`/api/places/${resolvedId}`);
      return data;
    },
  });
}

export function useCreatePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreatePlaceRequest) => {
      const { data } = await api.post<{ place_id: string }>("/api/places", req);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.places.all() });
    },
  });
}

export function useUpdatePlace(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdatePlaceRequest) => {
      const { data } = await api.put<{ place_id: string }>(`/api/places/${placeId}`, req);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.places.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.places.detail(placeId) });
    },
  });
}

export function useDeletePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (placeId: string) => {
      await api.delete(`/api/places/${placeId}`);
    },
    onSuccess: (_data, placeId) => {
      queryClient.removeQueries({ queryKey: queryKeys.places.detail(placeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.places.all() });
    },
  });
}
