<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '@/shared/lib/use-auth';
import UiButton from '@/shared/ui/UiButton.vue';

const router = useRouter();
const { logout } = useAuth();

async function handleLogout() {
  await logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <UiButton variant="ghost" @click="handleLogout">
    Sign out
  </UiButton>
</template>
