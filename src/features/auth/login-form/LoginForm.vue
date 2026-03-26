<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuth } from "@/shared/lib/use-auth";
import { getErrorMessage } from "@/shared/api/types";
import UiInput from "@/shared/ui/UiInput.vue";
import UiButton from "@/shared/ui/UiButton.vue";

const router = useRouter();
const { login, sendOtp } = useAuth();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await login(email.value, password.value);
    router.push({ name: "places" });
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.data?.detail === "Email not verified") {
      try {
        await sendOtp(email.value);
      } catch {
        // OTP may already have been sent recently, ignore
      }
      router.push({ name: "verify-otp", query: { email: email.value } });
    } else {
      error.value = getErrorMessage(e);
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <UiInput v-model="email" label="Email" type="email" placeholder="your@email.com" />
    <UiInput
      v-model="password"
      label="Password"
      type="password"
      placeholder="Enter your password"
    />
    <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
    <UiButton type="submit" :loading="loading" class="w-full"> Sign in </UiButton>
  </form>
</template>
