import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";
import { computed } from "vue";
import { api } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";

export interface SensorReadingResponse {
  key: string;
  value: number;
  time: string;
}

interface LatestReadingsResponse {
  readings: SensorReadingResponse[];
}

export function useLatestReadings(placeId: Ref<string> | string, deviceId: string) {
  const pId = typeof placeId === "string" ? placeId : placeId;
  return useQuery({
    queryKey: computed(() =>
      queryKeys.telemetry.latest(typeof pId === "string" ? pId : pId.value, deviceId),
    ),
    queryFn: async () => {
      const resolvedPId = typeof pId === "string" ? pId : pId.value;
      const { data } = await api.get<LatestReadingsResponse>(
        `/api/places/${resolvedPId}/devices/${deviceId}/telemetry/latest`,
      );
      return data.readings;
    },
  });
}
