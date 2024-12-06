import { beforeAll, describe, expect, it } from "@jest/globals";

import { MaybeClassElementMetadataKind } from "../../../../src/metadata/types/MaybeClassElementMetadataKind";
import { MaybeManagedClassElementMetadata } from "../../../../src/metadata/types/MaybeManagedClassElementMetadata";
import { buildDefaultMaybeClassElementMetadata } from "../../../../src/metadata/utils/building/buildDefaultMaybeClassElementMetadata";

describe(buildDefaultMaybeClassElementMetadata.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      result = buildDefaultMaybeClassElementMetadata();
    });

    it("should return MaybeManagedClassElementMetadata", () => {
      const expected: MaybeManagedClassElementMetadata = {
        kind: MaybeClassElementMetadataKind.unknown,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
