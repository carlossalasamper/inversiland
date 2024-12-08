import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { unmanaged } from "../../../src/metadata/decorators/unmanaged";
import { ClassElementMetadataKind } from "../../../src/metadata/types/ClassElementMetadataKind";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";

describe(unmanaged.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @unmanaged()
        public readonly bar!: string;

        @unmanaged()
        public readonly baz!: string;

        constructor(
          @unmanaged()
          public firstParam: number,
          @unmanaged()
          public secondParam: number
        ) {}
      }

      result = getMetadata(classMetadataReflectKey, Foo);
    });

    it("should return expected metadata", () => {
      const expected: ClassMetadata = {
        constructorArguments: [
          {
            kind: ClassElementMetadataKind.unmanaged,
          },
          {
            kind: ClassElementMetadataKind.unmanaged,
          },
        ],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: undefined,
        },
        properties: new Map([
          [
            "bar",
            {
              kind: ClassElementMetadataKind.unmanaged,
            },
          ],
          [
            "baz",
            {
              kind: ClassElementMetadataKind.unmanaged,
            },
          ],
        ]),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
