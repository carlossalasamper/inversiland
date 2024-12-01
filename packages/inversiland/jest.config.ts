import type { JestConfigWithTsJest } from "ts-jest";

const jestUnitConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.spec.ts"],
  setupFiles: ["./test/jest.setup.ts"],
  collectCoverage: true,
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "./src/**/*.ts",
    "!./src/types/**/*.ts",
    "!./src/decorators/index.ts",
    "!./src/middlewares/index.ts",
    "!./src/constants.ts",
    "!./src/index.ts",
  ],
  coverageReporters: ["text", "json-summary"],
};

export default jestUnitConfig;
