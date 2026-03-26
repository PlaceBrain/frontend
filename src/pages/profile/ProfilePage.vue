<script setup lang="ts">
import { useCurrentUser } from "@/entities/user/api/user.api";
import LogoutButton from "@/features/auth/logout-button/LogoutButton.vue";
import ThemeToggle from "@/features/theme-toggle/ThemeToggle.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import { useUiStore } from "@/shared/stores/ui.store";

const { data: user, isLoading } = useCurrentUser();
const ui = useUiStore();
</script>

<template>
  <div>
    <div class="flex items-center mb-6 min-h-[36px]">
      <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">Profile</h1>
    </div>

    <div v-if="isLoading" class="flex justify-center py-16">
      <UiSpinner size="lg" />
    </div>

    <div v-else-if="user" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 class="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Account</h2>
        <div class="space-y-3">
          <div>
            <p class="text-xs text-[var(--color-text-secondary)]">Username</p>
            <p class="text-sm font-medium text-[var(--color-text-primary)]">{{ user.username }}</p>
          </div>
          <div>
            <p class="text-xs text-[var(--color-text-secondary)]">Email</p>
            <p class="text-sm font-medium text-[var(--color-text-primary)]">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 class="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Preferences</h2>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-[var(--color-text-primary)]">Appearance</p>
              <p class="text-xs text-[var(--color-text-secondary)]">
                {{ ui.theme === "light" ? "Light" : "Dark" }} mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <LogoutButton />
      </div>
    </div>
  </div>
</template>
