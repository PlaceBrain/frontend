import { ref } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

function addToast(message: string, type: "success" | "error" = "success", duration = 3000) {
  const id = nextId++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, duration);
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

export function useToast() {
  return {
    toasts,
    success: (message: string) => addToast(message, "success"),
    error: (message: string) => addToast(message, "error", 5000),
    remove: removeToast,
  };
}
