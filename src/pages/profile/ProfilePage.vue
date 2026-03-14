<script setup lang="ts">
import { useCurrentUser } from '@/entities/user/api/user.api';
import LogoutButton from '@/features/auth/logout-button/LogoutButton.vue';
import ThemeToggle from '@/features/theme-toggle/ThemeToggle.vue';
import UiSpinner from '@/shared/ui/UiSpinner.vue';
import UiBadge from '@/shared/ui/UiBadge.vue';
import { useUiStore } from '@/shared/stores/ui.store';

const { data: user, isLoading } = useCurrentUser();
const ui = useUiStore();
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Profile</h1>

    <div v-if="isLoading" class="flex justify-center py-16">
      <UiSpinner size="lg" />
    </div>

    <div v-else-if="user" class="max-w-md space-y-6">
      <div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div class="space-y-3">
          <div>
            <p class="text-xs text-[var(--color-text-secondary)]">Username</p>
            <p class="text-sm font-medium text-[var(--color-text-primary)]">{{ user.username }}</p>
          </div>
          <div>
            <p class="text-xs text-[var(--color-text-secondary)]">Email</p>
            <p class="text-sm font-medium text-[var(--color-text-primary)]">{{ user.email }}</p>
          </div>
          <div>
            <p class="text-xs text-[var(--color-text-secondary)]">Status</p>
            <UiBadge :variant="user.is_verified ? 'success' : 'default'">
              {{ user.is_verified ? 'Verified' : 'Not verified' }}
            </UiBadge>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-[var(--color-text-primary)]">Appearance</p>
            <p class="text-xs text-[var(--color-text-secondary)]">{{ ui.theme === 'light' ? 'Light' : 'Dark' }} mode</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <LogoutButton />
    </div>
  </div>
</template>
