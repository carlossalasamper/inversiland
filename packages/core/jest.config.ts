import type { JestConfigWithTsJest } from "ts-jest";

const jestUnitConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.spec.ts"],
  setupFiles: ["./test/jest.setup.ts"],
  transformIgnorePatterns: ["/node_modules/"],
  collectCoverage: true,
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "./src/**/*.ts",
    "./src/**/types/*.ts",
    "!./src/index.ts",
  ],
  coverageReporters: ["text", "json-summary"],
};

export default jestUnitConfig;
