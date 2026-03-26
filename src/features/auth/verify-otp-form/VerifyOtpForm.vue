<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "@/shared/lib/use-auth";
import { getErrorMessage } from "@/shared/api/types";
import UiOtpInput from "@/shared/ui/UiOtpInput.vue";
import UiButton from "@/shared/ui/UiButton.vue";

const props = defineProps<{
  email: string;
}>();

const emit = defineEmits<{
  verified: [];
}>();

const { sendOtp, verifyOtp } = useAuth();

const code = ref("");
const error = ref("");
const resendSuccess = ref(false);
const loading = ref(false);
const resendLoading = ref(false);
const cooldown = ref(60);

let cooldownInterval: ReturnType<typeof setInterval> | null = null;

function startCooldown() {
  cooldown.value = 60;
  if (cooldownInterval) clearInterval(cooldownInterval);
  cooldownInterval = setInterval(() => {
    cooldown.value--;
    if (cooldown.value <= 0 && cooldownInterval) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;
    }
  }, 1000);
}

onMounted(() => {
  startCooldown();
});

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval);
});

async function handleSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await verifyOtp(props.email, code.value);
    emit("verified");
  } catch (e) {
    error.value = getErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

async function handleResend() {
  error.value = "";
  resendSuccess.value = false;
  resendLoading.value = true;
  try {
    await sendOtp(props.email);
    resendSuccess.value = true;
    startCooldown();
  } catch (e) {
    error.value = getErrorMessage(e);
  } finally {
    resendLoading.value = false;
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <UiOtpInput v-model="code" :error="error" />
    <p v-if="resendSuccess" class="text-sm text-[var(--color-success)]">Code sent</p>
    <UiButton type="submit" :loading="loading" :disabled="code.length < 6" class="w-full">
      Verify
    </UiButton>
    <UiButton
      variant="ghost"
      :disabled="cooldown > 0"
      :loading="resendLoading"
      class="w-full"
      @click="handleResend"
    >
      {{ cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code" }}
    </UiButton>
  </form>
</template>
