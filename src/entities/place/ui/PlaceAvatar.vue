<script setup lang="ts">
import { computed } from "vue";
import type { Place } from "../model/types";
import { avatarColorSlot } from "../model/avatar-color";

interface Props {
  place: Pick<Place, "place_id" | "name">;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), { size: "md" });

const sizeClasses = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

const initial = computed(() => {
  const name = props.place.name.trim();
  if (!name) return "?";
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    const first = segmenter.segment(name)[Symbol.iterator]().next().value;
    if (first) return first.segment.toUpperCase();
  }
  return name[0]?.toUpperCase() ?? "?";
});

const slot = computed(() => avatarColorSlot(props.place.place_id));

const avatarStyle = computed(() => ({
  background: `var(--color-avatar-${slot.value}-bg)`,
  color: `var(--color-avatar-${slot.value}-fg)`,
}));
</script>

<template>
  <div
    :class="[
      'flex shrink-0 items-center justify-center rounded-full font-heading font-semibold',
      sizeClasses[size],
    ]"
    :style="avatarStyle"
    aria-hidden="true"
  >
    {{ initial }}
  </div>
</template>
