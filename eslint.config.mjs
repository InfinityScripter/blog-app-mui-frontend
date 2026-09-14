import path from "node:path";
import { fileURLToPath } from "node:url";

import eslintReact from "@eslint-react/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import { importX } from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import { configs as tsConfigs } from "typescript-eslint";

// ESLint 10 flat config. Airbnb + eslint-plugin-react still peer eslint≤9 and
// crash on ESLint 10's RuleContext API — switched to @eslint-react + import-x
// (BACKLOG: «сменить базовый конфиг»). Custom project ratchets kept as-is.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextRules = {
  ...nextPlugin.configs.recommended.rules,
  ...nextPlugin.configs["core-web-vitals"].rules,
};

export default defineConfig(
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "public/**",
      "e2e/**",
      "scripts/**",
      "examples/**",
      "playwright.config.ts",
      "vitest.config.ts",
      "next.config.mjs",
      "eslint.config.mjs",
    ],
  },
  ...tsConfigs.recommended,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "import-x": importX,
      perfectionist,
      "unused-imports": unusedImports,
      ...eslintReact.configs.recommended.plugins,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
      "import-x/resolver": {
        typescript: { project: path.join(__dirname, "tsconfig.json") },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx", ".json"] },
      },
      next: { rootDir: __dirname },
    },
    rules: {
      ...nextRules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      "no-restricted-syntax": [
        2,
        {
          selector: "ForInStatement",
          message:
            "for..in ходит и по прототипной цепочке. Используйте Object.{keys,values,entries} + map/filter/reduce.",
        },
        {
          selector: "ForOfStatement",
          message:
            "for..of требует regenerator при es5-таргете. Используйте map/filter/reduce.",
        },
        {
          selector: "WhileStatement",
          message:
            "while — императивный цикл. Используйте рекурсию или функциональные методы массивов.",
        },
        {
          selector: "DoWhileStatement",
          message:
            "do..while — императивный цикл. Используйте рекурсию или функциональные методы массивов.",
        },
        {
          selector: "LabeledStatement",
          message: "Labels — форма GOTO, усложняют поток управления.",
        },
        {
          selector: "WithStatement",
          message:
            "`with` запрещён в strict mode и делает код непредсказуемым.",
        },
      ],
      "no-console": 0,
      "no-nested-ternary": 0,
      "no-param-reassign": 0,
      "no-underscore-dangle": 0,
      "@typescript-eslint/ban-ts-comment": [
        2,
        {
          "ts-nocheck": true,
          "ts-ignore": true,
          "ts-expect-error": "allow-with-description",
          minimumDescriptionLength: 10,
        },
      ],
      "@typescript-eslint/no-unused-vars": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/consistent-type-imports": 0,
      "import-x/no-cycle": [2, { maxDepth: 1, ignoreExternal: true }],
      "import-x/no-unresolved": 0,
      "import-x/prefer-default-export": 0,
      "import-x/extensions": 0,
      "jsx-a11y/anchor-is-valid": 0,
      "jsx-a11y/control-has-associated-label": 0,
      // Keep the pre-upgrade ratchet. react-hooks v7 adds Compiler-oriented
      // rules (set-state-in-effect, immutability, …) that fire on established
      // patterns; migrate those separately, don't block the ESLint 10 bump.
      "react-hooks/exhaustive-deps": 2,
      "react-hooks/set-state-in-effect": 0,
      "react-hooks/immutability": 0,
      "react-hooks/preserve-manual-memoization": 0,
      "react-hooks/refs": 0,
      "react-hooks/incompatible-library": 0,
      "react/no-danger": 0,
      "jsx-a11y/no-autofocus": 0,
      "unused-imports/no-unused-imports": 2,
      "unused-imports/no-unused-vars": [
        2,
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "perfectionist/sort-exports": [1, { order: "asc", type: "line-length" }],
      "perfectionist/sort-named-imports": [
        1,
        { order: "asc", type: "line-length" },
      ],
      "perfectionist/sort-named-exports": [
        1,
        { order: "asc", type: "line-length" },
      ],
      "perfectionist/sort-imports": [
        1,
        {
          order: "asc",
          type: "line-length",
          newlinesBetween: "always",
          groups: [
            "style",
            "type",
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index"],
            ["parent-type", "sibling-type", "index-type"],
            "object",
            "unknown",
          ],
        },
      ],
      "max-lines": [2, { max: 200, skipBlankLines: true, skipComments: true }],
      // @eslint-react replaces eslint-plugin-react; keep it advisory until a
      // dedicated cleanup pass. Errors would fail the 0/0 CI ratchet.
      "@eslint-react/no-leaked-conditional-rendering": 0,
      "@eslint-react/no-missing-key": 0,
      "@eslint-react/no-unstable-default-props": 0,
      "@eslint-react/dom/no-dangerously-set-innerhtml": 0,
      "@eslint-react/dom-no-dangerously-set-innerhtml": 0,
      "@eslint-react/jsx-no-key-after-spread": 0,
      "@eslint-react/set-state-in-effect": 0,
      "@eslint-react/no-forward-ref": 0,
      "@eslint-react/exhaustive-deps": 0,
      "@eslint-react/no-array-index-key": 0,
      "@eslint-react/no-context-provider": 0,
      "@eslint-react/no-use-context": 0,
      "@eslint-react/use-state": 0,
      "@eslint-react/jsx-no-children-prop": 0,
      "@eslint-react/purity": 0,
      "@eslint-react/naming-convention-ref-name": 0,
      "@eslint-react/no-unnecessary-use-prefix": 0,
      "@eslint-react/no-clone-element": 0,
    },
  },
  {
    files: [
      "src/_mock/**",
      "src/assets/illustrations/**",
      "src/assets/data/**",
      "src/theme/**",
      "src/sections/llm-timeline/const.ts",
      "src/sections/llm-timeline/data/**",
      "src/sections/llm-compare/data/**",
      "src/sections/library/data/**",
      // Dense admin table view — pagination + filters push past the
      // component budget without a meaningful extract.
      "src/sections/admin/admin-audit-logs-view.tsx",
    ],
    rules: { "max-lines": 0 },
  },
  prettier,
);
