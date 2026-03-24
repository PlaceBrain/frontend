<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from "vue";

interface Props {
  open: boolean;
  title?: string;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const modalRef = ref<HTMLElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

function trapFocus(event: KeyboardEvent) {
  if (!modalRef.value || event.key !== "Tab") return;

  const focusable = modalRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement;
      await nextTick();
      const firstFocusable = modalRef.value?.querySelector<HTMLElement>(
        'input, select, textarea, button:not([aria-label="Close"])',
      );
      firstFocusable?.focus();
      document.addEventListener("keydown", trapFocus);
    } else {
      document.removeEventListener("keydown", trapFocus);
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  },
);

onUnmounted(() => {
  document.removeEventListener("keydown", trapFocus);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="absolute inset-0 bg-black/40" @click="$emit('close')" />
        <Transition name="scale" appear>
          <div
            v-if="open"
            ref="modalRef"
            class="relative z-10 w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg"
          >
            <div v-if="title" class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">
                {{ title }}
              </h2>
              <button
                class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                aria-label="Close"
                @click="$emit('close')"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
