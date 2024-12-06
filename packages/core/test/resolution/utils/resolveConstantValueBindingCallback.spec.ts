import { beforeAll, describe, expect, it } from "@jest/globals";

import { InversifyCoreError } from "../../../src/error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../src/error/types/InversifyCoreErrorKind";
import { resolveConstantValueBindingCallback } from "../../../src/resolution/utils/resolveConstantValueBindingCallback";

describe(resolveConstantValueBindingCallback.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      try {
        resolveConstantValueBindingCallback();
      } catch (error: unknown) {
        result = error;
      }
    });

    it("should throw an InversifyCoreError", () => {
      const expectedErrorProperties: Partial<InversifyCoreError> = {
        kind: InversifyCoreErrorKind.unknown,
        message: "Expected constant value binding with value, none found",
      };

      expect(result).toBeInstanceOf(InversifyCoreError);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedErrorProperties)
      );
    });
  });
});
