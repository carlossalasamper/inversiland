import { LegacyQueryableStringImpl } from "../../../src/string/models/LegacyQueryableStringImpl";

describe(LegacyQueryableStringImpl.name, () => {
  let stringFixture: string;
  let legacyQueryableStringImpl: LegacyQueryableStringImpl;

  beforeAll(() => {
    stringFixture = "string-fixture";

    legacyQueryableStringImpl = new LegacyQueryableStringImpl(stringFixture);
  });

  describe(".startsWith", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyQueryableStringImpl.startsWith(stringFixture);
      });

      it("should return expected result", () => {
        expect(result).toBe(true);
      });
    });
  });

  describe(".endsWith", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyQueryableStringImpl.endsWith(stringFixture);
      });

      it("should return expected result", () => {
        expect(result).toBe(true);
      });
    });
  });

  describe(".contains", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyQueryableStringImpl.contains(stringFixture);
      });

      it("should return expected result", () => {
        expect(result).toBe(true);
      });
    });
  });

  describe(".equals", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyQueryableStringImpl.equals(stringFixture);
      });

      it("should return expected result", () => {
        expect(result).toBe(true);
      });
    });
  });

  describe(".value", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyQueryableStringImpl.value();
      });

      it("should return expected result", () => {
        expect(result).toBe(stringFixture);
      });
    });
  });
});
