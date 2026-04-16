<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

interface Tab {
  name: string;
  label: string;
}

const tabs: Tab[] = [
  { name: "place-overview", label: "Overview" },
  { name: "devices-list", label: "Devices" },
  { name: "place-charts", label: "Charts" },
  { name: "place-alerts", label: "Alerts" },
  { name: "place-members", label: "Members" },
  { name: "place-settings", label: "Settings" },
];

const route = useRoute();

const activeName = computed(() => {
  const match = tabs.find((t) => route.matched.some((r) => r.name === t.name));
  return match?.name ?? tabs[0].name;
});

const tabRefs = ref<HTMLElement[]>([]);
const containerRef = ref<HTMLElement>();
const indicatorStyle = ref({ left: "0px", width: "0px", opacity: "0" });

function updateIndicator() {
  const activeIndex = tabs.findIndex((t) => t.name === activeName.value);
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
watch(activeName, () => nextTick(updateIndicator));
</script>

<template>
  <div
    class="border-b border-[var(--color-border)] overflow-x-auto overflow-y-hidden scrollbar-hide"
  >
    <nav ref="containerRef" class="relative flex gap-1 -mb-px w-max min-w-full">
      <div
        class="absolute bottom-0 h-0.5 rounded-full bg-[var(--color-accent)] transition-all duration-200 ease-out"
        :style="indicatorStyle"
      />
      <router-link
        v-for="(tab, i) in tabs"
        :key="tab.name"
        :ref="
          (el) => {
            if (el)
              tabRefs[i] = ((el as unknown as { $el?: HTMLElement }).$el ?? el) as HTMLElement;
          }
        "
        :to="{ name: tab.name, params: { placeId: route.params.placeId } }"
        replace
        :class="[
          'px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 border-transparent whitespace-nowrap',
          activeName === tab.name
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
        ]"
      >
        {{ tab.label }}
      </router-link>
    </nav>
  </div>
</template>
