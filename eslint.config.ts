import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config({ ignores: ["dist"] }, js.configs.recommended, ...tseslint.configs.recommended, {
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: "latest",
    globals: globals.browser,
    parserOptions: {
      ecmaVersion: "latest",
      ecmaFeatures: { jsx: true },
      projectService: true,
      sourceType: "module",
    },
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    react: react,
    "jsx-a11y": jsxA11y,
    import: importPlugin,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
    ...jsxA11y.configs.recommended.rules,

    // React specific rules
    "react-hooks/exhaustive-deps": "error",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",

    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",

    // Import rules
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "import/no-unresolved": "error",
    "import/no-unused-modules": "warn",
    "import/no-default-export": "off", // Allow default exports for React components
    "import/prefer-default-export": "off",
    "import/no-duplicates": "error",
    "import/no-cycle": "error",
    "import/no-self-import": "error",

    // Security rules
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",
    "no-alert": "warn",
    "no-debugger": "error",

    // Code quality rules
    "prefer-const": "error",
    "no-var": "error",
    "no-unused-expressions": "error",
    "no-unreachable": "error",
    "no-duplicate-imports": "error",
    "no-useless-return": "error",
    "no-useless-rename": "error",
    "no-useless-computed-key": "error",
    "no-useless-constructor": "error",
    "no-useless-concat": "error",
    "no-template-curly-in-string": "error",
    "no-throw-literal": "error",
    "no-self-assign": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-unmodified-loop-condition": "error",
    "no-unused-labels": "error",
    "no-useless-call": "error",
    "no-useless-escape": "error",
    "no-void": "error",
    "no-with": "error",

    // Best practices
    "array-callback-return": "error",
    "block-scoped-var": "error",
    "class-methods-use-this": "off", // Often not applicable in React
    "consistent-return": "error",
    curly: ["error", "all"],
    "default-case": "error",
    "default-case-last": "error",
    "dot-notation": "error",
    eqeqeq: ["error", "always", { null: "ignore" }],
    "guard-for-in": "error",
    "no-await-in-loop": "warn",
    "no-constructor-return": "error",
    "no-else-return": "error",
    "no-empty-function": "warn",
    "no-eq-null": "off", // Conflicts with eqeqeq
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-label": "error",
    "no-floating-decimal": "error",
    "no-implicit-coercion": "error",
    "no-implicit-globals": "error",
    "no-invalid-this": "off", // Handled by TypeScript
    "no-iterator": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-magic-numbers": "off", // Too restrictive for React apps
    "no-multi-spaces": "error",
    "no-multi-str": "error",
    "no-new": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-param-reassign": ["error", { props: false }],
    "no-proto": "error",
    "no-return-assign": "error",
    "no-return-await": "error",
    "no-unneeded-ternary": "error",
    "prefer-arrow-callback": "error",
    "prefer-object-spread": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    radix: "error",
    yoda: "error",

    // Style and formatting
    camelcase: ["error", { properties: "never" }],
    "func-names": "off",
    "func-style": "off",
    "max-classes-per-file": "off",
    "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
    "max-lines-per-function": "off",
    "max-nested-callbacks": ["warn", 4],
    "max-params": ["warn", 5],
    "new-cap": ["error", { newIsCap: true, capIsNew: false }],
    "no-array-constructor": "error",
    "no-bitwise": "warn",
    "no-continue": "off",
    "no-inline-comments": "off",
    "no-lonely-if": "error",
    "no-negated-condition": "off",
    "no-nested-ternary": "warn",
    "no-new-object": "error",
    "no-plusplus": "off",
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
    "no-underscore-dangle": "off",
    "one-var": ["error", "never"],
    "operator-assignment": ["error", "always"],
    "prefer-destructuring": [
      "error",
      {
        array: true,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    "spaced-comment": [
      "error",
      "always",
      {
        line: {
          markers: ["/"],
          exceptions: ["-", "+"],
        },
        block: {
          markers: ["!"],
          exceptions: ["*"],
          balanced: true,
        },
      },
    ],

    // Additional React rules
    "react/boolean-prop-naming": "off",
    "react/button-has-type": "warn",
    "react/default-props-match-prop-types": "off", // Not needed with TypeScript
    "react/destructuring-assignment": "off",
    "react/forbid-component-props": "off",
    "react/forbid-dom-props": "off",
    "react/forbid-elements": "off",
    "react/forbid-prop-types": "off",
    "react/forbid-foreign-prop-types": "off",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/jsx-boolean-value": ["error", "never"],
    "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/jsx-fragments": ["error", "syntax"],
    "react/jsx-handler-names": "off",
    "react/jsx-max-depth": "off",
    "react/jsx-no-bind": "off", // useCallback handles this
    "react/jsx-no-constructed-context-values": "error",
    "react/jsx-no-literals": "off",
    "react/jsx-no-script-url": "error",
    "react/jsx-no-useless-fragment": "error",
    "react/jsx-pascal-case": "error",
    "react/jsx-props-no-spreading": "off",
    "react/jsx-sort-props": "off",
    "react/no-access-state-in-setstate": "error",
    "react/no-array-index-key": "warn",
    "react/no-danger": "warn",
    "react/no-did-mount-set-state": "error",
    "react/no-did-update-set-state": "error",
    "react/no-multi-comp": "off",
    "react/no-redundant-should-component-update": "error",
    "react/no-set-state": "off",
    "react/no-typos": "error",
    "react/no-unused-state": "error",
    "react/prefer-stateless-function": "error",
    "react/require-default-props": "off", // Not needed with TypeScript
    "react/self-closing-comp": "error",
    "react/sort-comp": "off",
    "react/sort-prop-types": "off",
    "react/state-in-constructor": "off",
    "react/static-property-placement": "off",
  },
});
