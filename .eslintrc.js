"use strict";

module.exports = {
  "overrides": [
    {
      "files"        : ["*.ts"],
      "extends"      : ["@susisu/eslint-config/preset/ts-types"],
      "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType" : "module",
        "project"    : "./tsconfig.json",
      },
      "env": {
        "es6": true,
      },
      "rules": {
        "no-dupe-class-members": "off",
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
    {
      "files": ["*.spec.ts"],
      "env"  : {
        "jest": true,
      },
    },
  ],
};
