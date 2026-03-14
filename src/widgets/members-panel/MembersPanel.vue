<script setup lang="ts">
import { ref } from 'vue';
import { useMembers } from '@/entities/member/api/member.api';
import MemberRow from '@/entities/member/ui/MemberRow.vue';
import AddMemberModal from '@/features/manage-members/AddMemberModal.vue';
import ChangeMemberRole from '@/features/manage-members/ChangeMemberRole.vue';
import UiButton from '@/shared/ui/UiButton.vue';
import UiSpinner from '@/shared/ui/UiSpinner.vue';
import UiEmptyState from '@/shared/ui/UiEmptyState.vue';

interface Props {
  placeId: string;
  canManage: boolean;
}

const props = defineProps<Props>();

const { data: members, isLoading } = useMembers(props.placeId);

const showAddModal = ref(false);
const editTarget = ref<{ userId: string; role: string } | null>(null);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-[var(--color-text-primary)]">Members</h3>
      <UiButton v-if="canManage" size="sm" @click="showAddModal = true">
        Add member
      </UiButton>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <UiSpinner />
    </div>

    <UiEmptyState
      v-else-if="!members?.length"
      title="No members"
      description="This place has no members yet."
    />

    <div v-else class="divide-y divide-[var(--color-border)]">
      <MemberRow
        v-for="member in members"
        :key="member.user_id"
        :member="member"
        :can-manage="canManage"
        @edit="editTarget = { userId: member.user_id, role: member.role }"
      />
    </div>

    <AddMemberModal
      :open="showAddModal"
      :place-id="placeId"
      @close="showAddModal = false"
    />

    <ChangeMemberRole
      v-if="editTarget"
      :open="!!editTarget"
      :place-id="placeId"
      :user-id="editTarget.userId"
      :current-role="editTarget.role"
      @close="editTarget = null"
    />
  </div>
</template>
