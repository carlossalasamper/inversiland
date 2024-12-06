import { Newable } from "@inversiland/common";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { getClassElementMetadataFromNewable } from "../../../../src/metadata/utils/getters/getClassElementMetadataFromNewable";

describe(getClassElementMetadataFromNewable.name, () => {
  describe("when called", () => {
    let typeFixture: Newable;

    let result: unknown;

    beforeAll(() => {
      typeFixture = class {};

      result = getClassElementMetadataFromNewable(typeFixture);
    });

    it("should return ClassElementMetadata", () => {
      const expected: ClassElementMetadata = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: typeFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
