<script setup lang="ts">
import LoginForm from '@/features/auth/login-form/LoginForm.vue';
</script>

<template>
  <div>
    <h2 class="mb-6 text-xl font-semibold text-[var(--color-text-primary)]">Sign in</h2>
    <LoginForm />
    <p class="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
      Don't have an account?
      <RouterLink to="/register" class="text-[var(--color-accent)] hover:underline">
        Sign up
      </RouterLink>
    </p>
  </div>
</template>
