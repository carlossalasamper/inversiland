import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { tagged } from "../../../src/metadata/decorators/tagged";
import { MaybeClassElementMetadataKind } from "../../../src/metadata/types/MaybeClassElementMetadataKind";
import { MaybeClassMetadata } from "../../../src/metadata/types/MaybeClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";

describe(tagged.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @tagged("bar", "bar-value")
        public readonly bar!: string;

        @tagged("baz", "baz-value")
        public readonly baz!: string;

        constructor(
          @tagged("firstParam", "firstParam-value")
          public firstParam: number,
          @tagged("secondParam", "secondParam-value")
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
            tags: new Map([["firstParam", "firstParam-value"]]),
            targetName: undefined,
          },
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: undefined,
            optional: false,
            tags: new Map([["secondParam", "secondParam-value"]]),
            targetName: undefined,
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
              tags: new Map([["bar", "bar-value"]]),
              targetName: undefined,
            },
          ],
          [
            "baz",
            {
              kind: MaybeClassElementMetadataKind.unknown,
              name: undefined,
              optional: false,
              tags: new Map([["baz", "baz-value"]]),
              targetName: undefined,
            },
          ],
        ]),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
