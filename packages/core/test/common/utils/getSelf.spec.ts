import { beforeAll, describe, expect, it } from "@jest/globals";

import { getSelf } from "../../../src/common/utils/getSelf";

describe(getSelf.name, () => {
  let value: unknown;

  beforeAll(() => {
    value = Symbol();
  });

  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      result = getSelf(value);
    });

    it("should return expected value", () => {
      expect(result).toBe(value);
    });
  });
});
