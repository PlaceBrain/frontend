<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const navItems = [
  {
    name: "places",
    label: "Places",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "profile",
    label: "Profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
];

const navContainer = ref<HTMLElement>();
const itemRefs = ref<HTMLElement[]>([]);
const dotStyle = ref({ left: "0px", opacity: "0" });

function updateDot() {
  const activeIndex = navItems.findIndex((item) => item.name === route.name);
  if (activeIndex === -1 || !itemRefs.value[activeIndex] || !navContainer.value) {
    dotStyle.value = { ...dotStyle.value, opacity: "0" };
    return;
  }
  const el = itemRefs.value[activeIndex];
  const center = el.offsetLeft - navContainer.value.offsetLeft + el.offsetWidth / 2;
  dotStyle.value = { left: `${center}px`, opacity: "1" };
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  nextTick(updateDot);
  if (navContainer.value) {
    resizeObserver = new ResizeObserver(() => updateDot());
    resizeObserver.observe(navContainer.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

watch(
  () => route.name,
  () => nextTick(updateDot),
);
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]"
  >
    <div ref="navContainer" class="relative flex items-center justify-around h-16">
      <div
        class="absolute top-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[var(--color-accent)] transition-all duration-200 ease-out"
        :style="dotStyle"
      />
      <router-link
        v-for="(item, i) in navItems"
        :key="item.name"
        :ref="
          (el) => {
            if (el) itemRefs[i] = (el as any).$el ?? el;
          }
        "
        :to="{ name: item.name }"
        :class="[
          'flex flex-col items-center gap-1 py-1 px-3 transition-colors duration-150',
          route.name === item.name
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-text-secondary)]',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
        </svg>
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>
