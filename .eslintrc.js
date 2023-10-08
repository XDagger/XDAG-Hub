// Copyright (c) XdagEcoSystem.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  plugins: [],
  extends: ["eslint:recommended", "react-app", "plugin:import/typescript"],
  settings: {
    react: {
      version: "18",
    },
    "import/resolver": {
      typescript: true,
    },
  },
  env: {
    es2020: true,
  },
  root: true,
  ignorePatterns: [
    "node_modules",
    "build",
    "dist",
    "coverage",
    "apps/icons/src",
    "next-env.d.ts",
    "doc/book",
    "external-crates",
  ],
  rules: {
    "@typescript-eslint/no-redeclare": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@tanstack/query/exhaustive-deps": "off",
    "no-useless-catch": "off",
    "no-case-declarations": "off",
    "no-mixed-spaces-and-tabs":"off",
    "no-debugger": "off",
    " no-prototype-builtins":"off"
  },
  overrides: [],
};
