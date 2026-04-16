import type { ComputedRef, InjectionKey, Ref } from "vue";

export interface PlaceDetailContext {
  placeId: ComputedRef<string>;
  canManage: ComputedRef<boolean>;
  latestValues: Ref<Map<string, Map<string, { value: number; timestamp: string }>>>;
}

export const placeDetailKey: InjectionKey<PlaceDetailContext> = Symbol("placeDetail");
