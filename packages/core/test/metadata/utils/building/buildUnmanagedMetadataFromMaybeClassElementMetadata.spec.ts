import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock(
  "../../../../src/metadata/utils/building/buildClassElementMetadataFromMaybeClassElementMetadata",
  () => ({
    buildClassElementMetadataFromMaybeClassElementMetadata: jest
      .fn()
      .mockReturnValue(jest.fn()),
  })
);

import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { MaybeClassElementMetadata } from "../../../../src/metadata/types/MaybeClassElementMetadata";
import { buildUnmanagedMetadataFromMaybeClassElementMetadata } from "../../../../src/metadata/utils/building/buildUnmanagedMetadataFromMaybeClassElementMetadata";

describe(buildUnmanagedMetadataFromMaybeClassElementMetadata.name, () => {
  describe("when called", () => {
    let buildClassMetadataMock: jest.Mock<
      (metadata: MaybeClassElementMetadata | undefined) => ClassElementMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      buildClassMetadataMock = jest.fn();

      (
        buildUnmanagedMetadataFromMaybeClassElementMetadata as jest.Mock<
          typeof buildUnmanagedMetadataFromMaybeClassElementMetadata
        >
      ).mockReturnValueOnce(buildClassMetadataMock);

      result = buildUnmanagedMetadataFromMaybeClassElementMetadata();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should return expected function", () => {
      expect(result).toBe(buildClassMetadataMock);
    });
  });
});
