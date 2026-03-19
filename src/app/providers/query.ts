import { VueQueryPlugin, type VueQueryPluginOptions } from "@tanstack/vue-query";
import type { Plugin } from "vue";

const queryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  },
};

export const queryPlugin: Plugin = {
  install(app) {
    app.use(VueQueryPlugin, queryPluginOptions);
  },
};
