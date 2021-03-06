"use strict";

module.exports = {
  plugins: ["prettier", "jest", "jest-formatting"],
  overrides: [
    {
      files: ["*.ts"],
      extends: [
        "@susisu/eslint-config/preset/ts-types",
        "prettier",
        "plugin:eslint-comments/recommended",
        "prettier/@typescript-eslint",
      ],
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      env: {
        es6: true,
      },
      rules: {
        "prettier/prettier": "error",
        "eslint-comments/no-unused-disable": "error",
      },
    },
    {
      files: ["*.spec.ts"],
      extends: ["plugin:jest/recommended", "plugin:jest-formatting/recommended"],
      env: {
        "jest/globals": true,
      },
    },
    {
      files: ["*.js"],
      extends: [
        "@susisu/eslint-config/preset/es",
        "prettier",
        "plugin:eslint-comments/recommended",
      ],
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: "script",
      },
      env: {
        es6: true,
        node: true,
      },
      rules: {
        "prettier/prettier": "error",
        "eslint-comments/no-unused-disable": "error",
      },
    },
  ],
};
