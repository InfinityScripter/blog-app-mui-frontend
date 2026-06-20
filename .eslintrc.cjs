module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  plugins: [
    "perfectionist",
    "unused-imports",
    "prettier",
    "@typescript-eslint",
  ],
  extends: ["airbnb", "airbnb/hooks", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/core-modules": ["react-map-gl"],
    "import/resolver": {
      alias: {
        map: [["src", "./src"]],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
    },
  },
  /**
   * 0 ~ 'off'
   * 1 ~ 'warn'
   * 2 ~ 'error'
   */
  rules: {
    "no-use-before-define": 0,
    "no-alert": 0,
    "no-undef": 0,
    "no-redeclare": 0,
    camelcase: 0,
    "no-console": 0,
    "no-unused-vars": 0,
    "no-nested-ternary": 0,
    "no-param-reassign": 0,
    "no-underscore-dangle": 0,
    "no-restricted-exports": 0,
    "no-promise-executor-return": 0,
    "import/prefer-default-export": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "import/named": 0,
    "import/no-self-import": 0,
    // Circular deps are currently at zero (verified with madge). Lock that in
    // as an error so they can never be reintroduced.
    "import/no-cycle": [2, { maxDepth: 1, ignoreExternal: true }],
    // Type-checker suppressions are now at zero (no @ts-nocheck anywhere).
    // Lock it: @ts-nocheck/@ts-ignore are banned outright; @ts-expect-error is
    // allowed only with a written justification (and self-clears once the
    // upstream type is fixed). Forces "fix the cause", not "silence the file".
    "@typescript-eslint/ban-ts-comment": [
      2,
      {
        "ts-nocheck": true,
        "ts-ignore": true,
        "ts-expect-error": "allow-with-description",
        minimumDescriptionLength: 10,
      },
    ],
    "import/no-relative-packages": 0,
    "import/no-extraneous-dependencies": 0,
    "import/order": 0,
    "import/first": 0,
    "prefer-destructuring": [1, { object: true, array: false }],
    // react
    "react/prop-types": 0,
    "react/no-children-prop": 0,
    "react/react-in-jsx-scope": 0,
    "react/no-array-index-key": 0,
    "react/require-default-props": 0,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "react/function-component-definition": 0,
    "react/jsx-no-duplicate-props": [1, { ignoreCase: false }],
    "react/jsx-no-useless-fragment": [1, { allowExpressions: true }],
    "react/no-unstable-nested-components": [1, { allowAsProps: true }],
    // jsx-a11y
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/control-has-associated-label": 0,
    // Stale effect deps are a real correctness footgun and the code is already
    // clean (0 violations) — lock it at error.
    "react-hooks/exhaustive-deps": 2,
    // Dead imports are noise and a refactor hazard — never allow them.
    // Autofixable, so this is cheap to keep at error.
    "unused-imports/no-unused-imports": 2,
    // Unused vars are surfaced as warnings: ~100 legacy hits in vendored
    // template code make `error` too disruptive repo-wide. Author folders are
    // raised to error per-path in eslint `overrides` (see below). `_`-prefixed
    // names are intentional placeholders and ignored.
    "unused-imports/no-unused-vars": [
      1,
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    // perfectionist
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
  },
  overrides: [
    {
      // Author-owned code is held to a stricter bar than the vendored template:
      // unused vars become errors here so our own code stays clean. Vendored
      // sections keep the repo-wide `warn` until they are cleaned per-folder.
      files: [
        "src/actions/**/*.{ts,tsx}",
        "src/auth/**/*.{ts,tsx}",
        "src/sections/blog/**/*.{ts,tsx,jsx}",
        "src/sections/admin/**/*.{ts,tsx}",
        "src/sections/portfolio/**/*.{ts,tsx}",
        "src/app/**/*.{ts,tsx}",
      ],
      rules: {
        "unused-imports/no-unused-vars": [
          2,
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
          },
        ],
      },
    },
  ],
};
