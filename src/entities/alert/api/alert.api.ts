import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";
import type { Alert, AlertListFilters } from "../model/types";
import { api } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { PaginatedResponse } from "@/shared/api/types";

function buildParams(filters: AlertListFilters): Record<string, string> {
  const params: Record<string, string> = { per_page: "100" };
  if (filters.severity) params.severity = filters.severity;
  if (filters.sensor_id) params.sensor_id = filters.sensor_id;
  if (filters.status) params.status = filters.status;
  if (filters.from) params.from = filters.from;
  return params;
}

export function useAlerts(
  placeId: Ref<string> | string,
  filters: Ref<AlertListFilters> | AlertListFilters,
) {
  return useQuery({
    queryKey: computed(() => {
      const pId = typeof placeId === "string" ? placeId : placeId.value;
      const f = "value" in filters ? filters.value : filters;
      return queryKeys.alerts.list(pId, buildParams(f));
    }),
    queryFn: async () => {
      const pId = typeof placeId === "string" ? placeId : placeId.value;
      const f = "value" in filters ? filters.value : filters;
      const { data } = await api.get<PaginatedResponse<Alert>>(`/api/places/${pId}/alerts`, {
        params: buildParams(f),
      });
      return data.items;
    },
  });
}

export function useResolveAlert(placeId: Ref<string> | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: string) => {
      const pId = typeof placeId === "string" ? placeId : placeId.value;
      const { data } = await api.post<Alert>(`/api/places/${pId}/alerts/${alertId}/resolve`);
      return data;
    },
    onSuccess: () => {
      const pId = typeof placeId === "string" ? placeId : placeId.value;
      queryClient.invalidateQueries({ queryKey: ["alerts", pId] });
    },
  });
}
