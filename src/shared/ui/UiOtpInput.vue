<script setup lang="ts">
import { ref, onMounted } from "vue";

const LENGTH = 6;

const props = defineProps<{
  modelValue: string;
  error?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const inputs = ref<HTMLInputElement[]>([]);
const digits = ref<string[]>(Array.from({ length: LENGTH }, () => ""));

function syncModel() {
  emit("update:modelValue", digits.value.join(""));
}

function setRef(el: unknown, i: number) {
  if (el instanceof HTMLInputElement) inputs.value[i] = el;
}

function handleInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const char = input.value.replace(/\D/g, "").slice(-1);
  digits.value[index] = char;
  input.value = char;
  syncModel();
  if (char && index < LENGTH - 1) {
    inputs.value[index + 1]?.focus();
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === "Backspace") {
    if (!digits.value[index] && index > 0) {
      event.preventDefault();
      digits.value[index - 1] = "";
      syncModel();
      inputs.value[index - 1]?.focus();
    } else {
      digits.value[index] = "";
      syncModel();
    }
  } else if (event.key === "ArrowLeft" && index > 0) {
    inputs.value[index - 1]?.focus();
  } else if (event.key === "ArrowRight" && index < LENGTH - 1) {
    inputs.value[index + 1]?.focus();
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  const text = (event.clipboardData?.getData("text") ?? "").replace(/\D/g, "").slice(0, LENGTH);
  for (let i = 0; i < LENGTH; i++) {
    digits.value[i] = text[i] ?? "";
  }
  syncModel();
  const focusIndex = Math.min(text.length, LENGTH - 1);
  inputs.value[focusIndex]?.focus();
}

function handleFocus(event: FocusEvent) {
  (event.target as HTMLInputElement).select();
}

onMounted(() => {
  inputs.value[0]?.focus();
});

function initDigits() {
  if (props.modelValue) {
    const chars = props.modelValue.split("");
    for (let i = 0; i < LENGTH; i++) {
      digits.value[i] = chars[i] ?? "";
    }
  }
}
initDigits();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-sm font-medium text-[var(--color-text-primary)]"> Verification code </label>
    <div class="flex gap-2 justify-between" @paste="handlePaste">
      <input
        v-for="i in LENGTH"
        :key="i"
        :ref="(el) => setRef(el, i - 1)"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="1"
        :value="digits[i - 1]"
        :disabled="disabled"
        :class="[
          'w-11 h-12 rounded-lg border text-center text-lg font-semibold transition-colors duration-150',
          'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]',
        ]"
        @input="handleInput(i - 1, $event)"
        @keydown="handleKeydown(i - 1, $event)"
        @focus="handleFocus"
      />
    </div>
    <p v-if="error" class="text-xs text-[var(--color-danger)]">{{ error }}</p>
  </div>
</template>
