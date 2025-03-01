import jsxA11Y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/vite-env.d.ts", "**/node_modules/", "**/dist/"],
  },
  ...fixupConfigRules(
    compat.extends(
      "plugin:jsx-a11y/recommended",
      "standard",
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ),
  ),
  {
    plugins: {
      react: fixupPluginRules(react),
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      prettier,
      "jsx-a11y": fixupPluginRules(jsxA11Y),
      "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },

      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": "error",
      "no-use-before-define": "off",
      "import/newline-after-import": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // `react` first, `next` second, then packages starting with a character
            ["^react$", "^next", "^[a-z]"],
            // Packages starting with `@`
            ["^@"],
            // Packages starting with `~`
            ["^~"],
            // Imports starting with `../`
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Imports starting with `./`
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.s?css$"],
            // Side effect imports
            ["^\\u0000"],
          ],
        },
      ],
    },
  },
];
