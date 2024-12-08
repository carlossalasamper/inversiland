import type { JestConfigWithTsJest } from "ts-jest";

const jestUnitConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/test/*.spec.ts"],
  setupFiles: ["./test/jest.setup.ts"],
  collectCoverage: true,
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["./src/*.ts", "!./src/index.ts"],
  coverageReporters: ["text", "json-summary"],
};

export default jestUnitConfig;
