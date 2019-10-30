"use strict";

module.exports = {
  "overrides": [
    {
      "files"        : ["*.ts"],
      "extends"      : ["@susisu/eslint-config/preset/ts-types"],
      "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType" : "module",
      },
      "env": {
        "es6": true,
      },
      "rules": {
        "no-dupe-class-members": "off",
      },
    },
    {
      "files": ["*.spec.ts"],
      "env"  : {
        "jest": true,
      },
    },
    {
      "files"        : ["src/**/*.ts"],
      "parserOptions": {
        "project": "./tsconfig.build.json",
      },
    },
    {
      "files"        : ["src/**/*.spec.ts", "src/**/__tests__/**/*.ts"],
      "parserOptions": {
        "project": "./tsconfig.test.json",
      },
    },
    {
      "files"        : ["*.js"],
      "extends"      : ["@susisu/eslint-config/preset/es"],
      "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType" : "script",
      },
      "env": {
        "es6" : true,
        "node": true,
      },
    },
  ],
};
