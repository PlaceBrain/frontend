import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { Alert } from "@/entities/alert/model/types";

export interface PlaceDetailContext {
  placeId: ComputedRef<string>;
  canManage: ComputedRef<boolean>;
  latestValues: Ref<Map<string, Map<string, { value: number; timestamp: string }>>>;
  alerts: Ref<Alert[]>;
}

export const placeDetailKey: InjectionKey<PlaceDetailContext> = Symbol("placeDetail");
