<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Plus } from "lucide-vue-next";
import { usePlaces } from "@/entities/place/api/place.api";
import PlaceAvatar from "@/entities/place/ui/PlaceAvatar.vue";
import CreatePlaceModal from "@/features/create-place/CreatePlaceModal.vue";
import UiSpinner from "@/shared/ui/UiSpinner.vue";
import { useUiStore } from "@/shared/stores/ui.store";

const ui = useUiStore();
const route = useRoute();
const { data: places, isLoading } = usePlaces();

const collapsed = computed(() => ui.sidebarCollapsed);
const activePlaceId = computed(() => {
  const raw = route.params.placeId;
  return Array.isArray(raw) ? raw[0] : raw;
});

const showCreateModal = ref(false);
const scrollContainer = ref<HTMLElement>();

function scrollActiveIntoView() {
  if (!scrollContainer.value || !activePlaceId.value) return;
  const el = scrollContainer.value.querySelector<HTMLElement>(
    `[data-place-id="${activePlaceId.value}"]`,
  );
  el?.scrollIntoView({ block: "nearest" });
}

onMounted(() => nextTick(scrollActiveIntoView));
watch(activePlaceId, () => nextTick(scrollActiveIntoView));
watch(places, () => nextTick(scrollActiveIntoView));
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div class="flex h-8 items-end px-5 pb-1">
      <span
        :class="[
          'text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] whitespace-nowrap transition-opacity duration-200',
          collapsed ? 'opacity-0' : 'opacity-100',
        ]"
        :aria-hidden="collapsed"
      >
        Places
      </span>
    </div>

    <div ref="scrollContainer" class="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-2">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-lg h-10 px-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
        :aria-label="collapsed ? 'New place' : undefined"
        :title="collapsed ? 'New place' : undefined"
        @click="showCreateModal = true"
      >
        <Plus class="h-6 w-6 shrink-0" />
        <span
          :class="[
            'text-sm font-medium whitespace-nowrap transition-opacity duration-200',
            collapsed ? 'opacity-0' : 'opacity-100',
          ]"
          :aria-hidden="collapsed"
          >New place</span
        >
      </button>

      <div v-if="isLoading" class="flex justify-center py-6">
        <UiSpinner size="sm" />
      </div>
      <p
        v-else-if="!places?.length && !collapsed"
        class="px-3 py-2 text-xs text-[var(--color-text-secondary)]"
      >
        No places yet.
      </p>
      <ul v-else class="flex flex-col gap-0.5">
        <li v-for="place in places" :key="place.place_id">
          <router-link
            :to="{ name: 'place-detail', params: { placeId: place.place_id } }"
            :data-place-id="place.place_id"
            :class="[
              'group relative flex items-center gap-3 rounded-lg h-10 px-3 transition-colors',
              activePlaceId === place.place_id
                ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]',
            ]"
            :aria-label="collapsed ? place.name : undefined"
            :title="collapsed ? place.name : undefined"
          >
            <span
              v-if="activePlaceId === place.place_id"
              class="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--color-accent)]"
            />
            <PlaceAvatar :place="place" size="sm" />
            <span
              :class="[
                'truncate text-sm whitespace-nowrap transition-opacity duration-200',
                collapsed ? 'opacity-0' : 'opacity-100',
              ]"
              :aria-hidden="collapsed"
            >
              {{ place.name }}
            </span>
          </router-link>
        </li>
      </ul>
    </div>

    <CreatePlaceModal :open="showCreateModal" @close="showCreateModal = false" />
  </div>
</template>

<style scoped>
.sidebar-scroll {
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    black 12px,
    black calc(100% - 12px),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    black 12px,
    black calc(100% - 12px),
    transparent 100%
  );
  scrollbar-width: thin;
}
.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 2px;
}
</style>
