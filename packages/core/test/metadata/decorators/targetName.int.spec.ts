import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { targetName } from "../../../src/metadata/decorators/targetName";
import { MaybeClassElementMetadataKind } from "../../../src/metadata/types/MaybeClassElementMetadataKind";
import { MaybeClassMetadata } from "../../../src/metadata/types/MaybeClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";

describe(targetName.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @targetName("bar")
        public readonly bar!: string;

        @targetName("baz")
        public readonly baz!: string;

        constructor(
          @targetName("firstParam")
          public firstParam: number,
          @targetName("secondParam")
          public secondParam: number
        ) {}
      }

      result = getMetadata(classMetadataReflectKey, Foo);
    });

    it("should return expected metadata", () => {
      const expected: MaybeClassMetadata = {
        constructorArguments: [
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: "firstParam",
          },
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: "secondParam",
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
              kind: MaybeClassElementMetadataKind.unknown,
              name: undefined,
              optional: false,
              tags: new Map(),
              targetName: "bar",
            },
          ],
          [
            "baz",
            {
              kind: MaybeClassElementMetadataKind.unknown,
              name: undefined,
              optional: false,
              tags: new Map(),
              targetName: "baz",
            },
          ],
        ]),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
