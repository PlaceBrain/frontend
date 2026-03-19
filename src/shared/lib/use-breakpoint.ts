import { onMounted, onUnmounted, ref } from "vue";

export function useBreakpoint(query = "(min-width: 768px)") {
  const matches = ref(false);

  let mediaQuery: MediaQueryList | null = null;

  const handler = (e: MediaQueryListEvent) => {
    matches.value = e.matches;
  };

  onMounted(() => {
    mediaQuery = window.matchMedia(query);
    matches.value = mediaQuery.matches;
    mediaQuery.addEventListener("change", handler);
  });

  onUnmounted(() => {
    mediaQuery?.removeEventListener("change", handler);
  });

  return { isDesktop: matches };
}
