<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";

interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  modelValue: string;
}

const props = defineProps<Props>();

defineEmits<{
  "update:modelValue": [key: string];
}>();

const tabRefs = ref<HTMLElement[]>([]);
const containerRef = ref<HTMLElement>();
const indicatorStyle = ref({ left: "0px", width: "0px", opacity: "0" });

function updateIndicator() {
  const activeIndex = props.tabs.findIndex((tab) => tab.key === props.modelValue);
  if (activeIndex === -1 || !tabRefs.value[activeIndex] || !containerRef.value) {
    indicatorStyle.value = { ...indicatorStyle.value, opacity: "0" };
    return;
  }
  const el = tabRefs.value[activeIndex];
  const containerRect = containerRef.value.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  indicatorStyle.value = {
    left: `${elRect.left - containerRect.left}px`,
    width: `${elRect.width}px`,
    opacity: "1",
  };
}

onMounted(() => nextTick(updateIndicator));
watch(
  () => props.modelValue,
  () => nextTick(updateIndicator),
);
</script>

<template>
  <div class="border-b border-[var(--color-border)]">
    <nav ref="containerRef" class="relative flex gap-1 -mb-px">
      <div
        class="absolute bottom-0 h-0.5 rounded-full bg-[var(--color-accent)] transition-all duration-200 ease-out"
        :style="indicatorStyle"
      />
      <button
        v-for="(tab, i) in tabs"
        :key="tab.key"
        :ref="
          (el) => {
            if (el) tabRefs[i] = (el as any).$el ?? el;
          }
        "
        :class="[
          'px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 border-transparent cursor-pointer',
          modelValue === tab.key
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
        ]"
        @click="$emit('update:modelValue', tab.key)"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>
