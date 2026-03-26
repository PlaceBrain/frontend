<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "@/shared/composables/useToast";
import VerifyOtpForm from "@/features/auth/verify-otp-form/VerifyOtpForm.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const email = computed(() => (route.query.email as string) || "");

if (!email.value) {
  router.replace({ name: "register" });
}

function handleVerified() {
  toast.success("Email verified successfully");
  router.push({ name: "login" });
}
</script>

<template>
  <div v-if="email">
    <h2 class="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Verify your email</h2>
    <p class="mb-6 text-sm text-[var(--color-text-secondary)]">We sent a code to {{ email }}</p>
    <VerifyOtpForm :email="email" @verified="handleVerified" />
    <p class="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
      <RouterLink to="/login" class="text-[var(--color-accent)] hover:underline">
        Back to login
      </RouterLink>
    </p>
  </div>
</template>
