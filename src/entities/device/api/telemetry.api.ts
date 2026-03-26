import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";
import { computed, toValue } from "vue";
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

export async function fetchLatestReadings(
  placeId: string,
  deviceId: string,
): Promise<SensorReadingResponse[]> {
  const { data } = await api.get<LatestReadingsResponse>(
    `/api/places/${placeId}/devices/${deviceId}/telemetry/latest`,
  );
  return data.readings;
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

// --- Historical readings ---

export interface AggregatedPoint {
  time: string;
  avg: number | null;
  min: number | null;
  max: number | null;
}

export interface RawPoint {
  time: string;
  value: number;
}

export interface SeriesData {
  key: string;
  points: AggregatedPoint[];
  raw_points: RawPoint[];
}

interface ReadingsHistoryResponse {
  series: SeriesData[];
}

export interface HistoryParams {
  from: string;
  to: string;
  interval: number;
  keys?: string[];
}

export async function fetchHistory(
  placeId: string,
  deviceId: string,
  params: { from: string; to: string; interval: number; keys?: string[] },
): Promise<SeriesData[]> {
  const searchParams = new URLSearchParams({
    from: params.from,
    to: params.to,
    interval: String(params.interval),
  });
  if (params.keys?.length) {
    searchParams.set("keys", params.keys.join(","));
  }
  const { data } = await api.get<ReadingsHistoryResponse>(
    `/api/places/${placeId}/devices/${deviceId}/telemetry/history?${searchParams}`,
  );
  return data.series;
}

export function useReadingsHistory(
  placeId: Ref<string> | string,
  deviceId: Ref<string> | string,
  params: Ref<HistoryParams>,
  enabled: Ref<boolean>,
) {
  return useQuery({
    queryKey: computed(() =>
      queryKeys.telemetry.history(
        toValue(placeId),
        toValue(deviceId),
        params.value.keys ?? [],
        params.value.from,
        params.value.to,
        params.value.interval,
      ),
    ),
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        from: params.value.from,
        to: params.value.to,
        interval: String(params.value.interval),
      });
      if (params.value.keys?.length) {
        searchParams.set("keys", params.value.keys.join(","));
      }
      const { data } = await api.get<ReadingsHistoryResponse>(
        `/api/places/${toValue(placeId)}/devices/${toValue(deviceId)}/telemetry/history?${searchParams}`,
      );
      return data.series;
    },
    enabled,
    staleTime: 60_000,
  });
}
