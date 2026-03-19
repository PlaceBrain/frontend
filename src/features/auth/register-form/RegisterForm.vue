<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/shared/lib/use-auth";
import { getErrorMessage } from "@/shared/api/types";
import UiInput from "@/shared/ui/UiInput.vue";
import UiButton from "@/shared/ui/UiButton.vue";

const router = useRouter();
const { register, login } = useAuth();

const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await register(username.value, email.value, password.value);
    await login(email.value, password.value);
    router.push({ name: "places" });
  } catch (e) {
    error.value = getErrorMessage(e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <UiInput v-model="username" label="Username" placeholder="Choose a username" />
    <UiInput v-model="email" label="Email" type="email" placeholder="your@email.com" />
    <UiInput v-model="password" label="Password" type="password" placeholder="Create a password" />
    <p v-if="error" class="text-sm text-[var(--color-danger)]">{{ error }}</p>
    <UiButton type="submit" :loading="loading" class="w-full"> Create account </UiButton>
  </form>
</template>
