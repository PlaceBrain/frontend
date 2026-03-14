import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  );

  function applyTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  function toggleTheme(event?: MouseEvent) {
    if (!document.startViewTransition || !event) {
      applyTheme();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(applyTheme);
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  }

  watch(theme, (value) => {
    localStorage.setItem('theme', value);
    document.documentElement.classList.toggle('dark', value === 'dark');
  }, { immediate: true });

  return { theme, toggleTheme };
});
