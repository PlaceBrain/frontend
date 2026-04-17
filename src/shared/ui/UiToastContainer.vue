<script setup lang="ts">
import { useToast } from "@/shared/composables/useToast";
import { useBreakpoint } from "@/shared/lib/use-breakpoint";

const { toasts, remove } = useToast();
const { isDesktop } = useBreakpoint();
</script>

<template>
  <Teleport to="body">
    <div
      :class="['fixed right-6 z-[100] flex flex-col gap-2', isDesktop ? 'bottom-8' : 'bottom-20']"
      aria-live="polite"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm min-w-[280px] max-w-[400px]',
            toast.type === 'success'
              ? 'border-[var(--color-toast-success-border)] bg-[var(--color-toast-success-bg)] text-[var(--color-toast-success-text)]'
              : 'border-[var(--color-toast-error-border)] bg-[var(--color-toast-error-bg)] text-[var(--color-toast-error-text)]',
          ]"
        >
          <span class="flex-1">{{ toast.message }}</span>
          <button
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Dismiss notification"
            @click="remove(toast.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
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
      </TransitionGroup>
    </div>
  </Teleport>
</template>
