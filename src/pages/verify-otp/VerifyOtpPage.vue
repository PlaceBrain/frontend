<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import VerifyOtpForm from "@/features/auth/verify-otp-form/VerifyOtpForm.vue";

const route = useRoute();
const router = useRouter();

const email = computed(() => (route.query.email as string) || "");
const verified = ref(false);

if (!email.value) {
  router.replace({ name: "register" });
}

function handleVerified() {
  verified.value = true;
  setTimeout(() => router.push({ name: "login" }), 1500);
}
</script>

<template>
  <div v-if="email">
    <template v-if="verified">
      <div class="flex flex-col items-center gap-3 py-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-[var(--color-success)]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="text-sm font-medium text-[var(--color-text-primary)]">Email verified</p>
        <p class="text-xs text-[var(--color-text-secondary)]">Redirecting to login...</p>
      </div>
    </template>
    <template v-else>
      <h2 class="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Verify your email</h2>
      <p class="mb-6 text-sm text-[var(--color-text-secondary)]">We sent a code to {{ email }}</p>
      <VerifyOtpForm :email="email" @verified="handleVerified" />
      <p class="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
        <RouterLink to="/login" class="text-[var(--color-accent)] hover:underline">
          Back to login
        </RouterLink>
      </p>
    </template>
  </div>
</template>
