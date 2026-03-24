<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { useRoute } from "vue-router";
import ThemeToggle from "@/features/theme-toggle/ThemeToggle.vue";
import UiAvatar from "@/shared/ui/UiAvatar.vue";
import LogoIcon from "@/shared/ui/LogoIcon.vue";
import { useCurrentUser } from "@/entities/user/api/user.api";

const route = useRoute();
const { data: user } = useCurrentUser();

const navItems = [
  { name: "places", label: "Places" },
  { name: "dashboard", label: "Dashboard" },
];

const navRefs = ref<HTMLElement[]>([]);
const navContainer = ref<HTMLElement>();
const indicatorStyle = ref({ left: "0px", width: "0px", opacity: "0" });

function updateIndicator() {
  const activeIndex = navItems.findIndex((item) => item.name === route.name);
  if (activeIndex === -1 || !navRefs.value[activeIndex] || !navContainer.value) {
    indicatorStyle.value = { ...indicatorStyle.value, opacity: "0" };
    return;
  }
  const el = navRefs.value[activeIndex];
  const containerRect = navContainer.value.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  indicatorStyle.value = {
    left: `${elRect.left - containerRect.left}px`,
    width: `${elRect.width}px`,
    opacity: "1",
  };
}

onMounted(() => nextTick(updateIndicator));
watch(
  () => route.name,
  () => nextTick(updateIndicator),
);
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-40 h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]"
  >
    <div class="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
      <router-link to="/" class="flex items-center gap-2 text-[var(--color-text-primary)]">
        <LogoIcon size="2rem" />
        <span class="text-lg font-semibold text-[var(--color-text-primary)] font-heading">
          PlaceBrain
        </span>
      </router-link>

      <div ref="navContainer" class="relative flex items-center gap-1">
        <div
          class="absolute bottom-0 h-0.5 rounded-full bg-[var(--color-accent)] transition-all duration-200 ease-out"
          :style="indicatorStyle"
        />
        <router-link
          v-for="(item, i) in navItems"
          :key="item.name"
          :ref="
            (el) => {
              if (el) navRefs[i] = (el as any).$el ?? el;
            }
          "
          :to="{ name: item.name }"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
            route.name === item.name
              ? 'text-[var(--color-accent)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]',
          ]"
        >
          {{ item.label }}
        </router-link>
      </div>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <router-link to="/profile">
          <UiAvatar :name="user?.username ?? '?'" size="sm" />
        </router-link>
      </div>
    </div>
  </nav>
</template>
