import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("@inversiland/metadata");

import { getMetadata, updateMetadata } from "@inversiland/metadata";

import { getTargetId } from "../../../src/legacyTarget/utils/getTargetId";

describe(getTargetId.name, () => {
  describe("when called, and getMetadata() returns undefined", () => {
    let result: unknown;

    beforeAll(() => {
      (getMetadata as jest.Mock<typeof getMetadata>).mockReturnValueOnce(0);

      result = getTargetId();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getMetadata()", () => {
      expect(getMetadata).toHaveBeenCalledTimes(1);
      expect(getMetadata).toHaveBeenCalledWith(
        "@inversifyjs/core/targetId",
        Object
      );
    });

    it("should call updateMetadata()", () => {
      expect(updateMetadata).toHaveBeenCalledTimes(1);
      expect(updateMetadata).toHaveBeenCalledWith(
        "@inversifyjs/core/targetId",
        0,
        expect.any(Function),
        Object
      );
    });

    it("should return default id", () => {
      expect(result).toBe(0);
    });
  });

  describe("when called, and getMetadata() returns Number.MAX_SAFE_INTEGER", () => {
    let result: unknown;

    beforeAll(() => {
      (getMetadata as jest.Mock<typeof getMetadata>).mockReturnValueOnce(
        Number.MAX_SAFE_INTEGER
      );

      result = getTargetId();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getMetadata()", () => {
      expect(getMetadata).toHaveBeenCalledTimes(1);
      expect(getMetadata).toHaveBeenCalledWith(
        "@inversifyjs/core/targetId",
        Object
      );
    });

    it("should call updateMetadata()", () => {
      expect(updateMetadata).toHaveBeenCalledTimes(1);
      expect(updateMetadata).toHaveBeenCalledWith(
        "@inversifyjs/core/targetId",
        Number.MAX_SAFE_INTEGER,
        expect.any(Function),
        Object
      );
    });

    it("should return default id", () => {
      expect(result).toBe(Number.MAX_SAFE_INTEGER);
    });
  });
});
