"use strict";

module.exports = {
  "roots"              : ["./src"],
  "testMatch"          : ["**/__tests__/**/*.spec.ts"],
  "testEnvironment"    : "node",
  "collectCoverage"    : true,
  "collectCoverageFrom": ["./src/**/*.ts", "!./src/**/*.spec.ts"],
  "coverageDirectory"  : "coverage",
  "globals"            : {
    "ts-jest": {
      "tsConfig": "./tsconfig.json",
    },
  },
  "transform": {
    "\\.ts$": "ts-jest",
  },
};
