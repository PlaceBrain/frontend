<script setup lang="ts">
import { inject } from "vue";
import MembersPanel from "@/widgets/members-panel/MembersPanel.vue";
import { placeDetailKey } from "@/pages/place-detail/context";

const ctx = inject(placeDetailKey);
if (!ctx) throw new Error("PlaceMembersPage must be nested inside PlaceDetailPage");

const { placeId, canManage } = ctx;
</script>

<template>
  <MembersPanel :place-id="placeId" :can-manage="canManage" />
</template>
