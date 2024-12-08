import { beforeAll, describe, expect, it } from "@jest/globals";

import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { UnmanagedClassElementMetadata } from "../../../../src/metadata/types/UnmanagedClassElementMetadata";
import { buildDefaultUnmanagedMetadata } from "../../../../src/metadata/utils/building/buildDefaultUnmanagedMetadata";

describe(buildDefaultUnmanagedMetadata.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      result = buildDefaultUnmanagedMetadata();
    });

    it("should return UnmanagedClassElementMetadata", () => {
      const expected: UnmanagedClassElementMetadata = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
