<script setup lang="ts">
import RegisterForm from '@/features/auth/register-form/RegisterForm.vue';
</script>

<template>
  <div>
    <h2 class="mb-6 text-xl font-semibold text-[var(--color-text-primary)]">Create account</h2>
    <RegisterForm />
    <p class="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
      Already have an account?
      <RouterLink to="/login" class="text-[var(--color-accent)] hover:underline">
        Sign in
      </RouterLink>
    </p>
  </div>
</template>
