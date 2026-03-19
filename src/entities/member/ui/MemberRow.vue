<script setup lang="ts">
import type { Member } from "../model/types";
import { formatRole } from "@/shared/lib/format";
import UiAvatar from "@/shared/ui/UiAvatar.vue";
import UiBadge from "@/shared/ui/UiBadge.vue";

interface Props {
  member: Member;
  canManage?: boolean;
}

defineProps<Props>();

defineEmits<{
  edit: [];
}>();
</script>

<template>
  <div class="flex items-center justify-between py-3">
    <div class="flex items-center gap-3">
      <UiAvatar :name="member.username" size="sm" />
      <div>
        <p class="text-sm font-medium text-[var(--color-text-primary)]">{{ member.username }}</p>
        <UiBadge variant="accent">{{ formatRole(member.role) }}</UiBadge>
      </div>
    </div>
    <button
      v-if="canManage && member.role !== 'owner'"
      class="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
      @click="$emit('edit')"
    >
      Edit
    </button>
  </div>
</template>
