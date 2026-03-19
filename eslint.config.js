import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import importX from "eslint-plugin-import-x";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,vue}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, ...pluginVue.configs["flat/recommended"]],
    plugins: {
      "import-x": importX,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      "import-x/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "never",
        },
      ],
      "import-x/no-duplicates": "warn",
      "vue/multi-word-component-names": "off",
    },
  },
  prettierConfig,
]);
