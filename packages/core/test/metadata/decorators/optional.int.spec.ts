import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { optional } from "../../../src/metadata/decorators/optional";
import { MaybeClassElementMetadataKind } from "../../../src/metadata/types/MaybeClassElementMetadataKind";
import { MaybeClassMetadata } from "../../../src/metadata/types/MaybeClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";

describe(optional.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @optional()
        public readonly bar!: string;

        @optional()
        public readonly baz!: string;

        constructor(
          @optional()
          public firstParam: number,
          @optional()
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
            optional: true,
            tags: new Map(),
            targetName: undefined,
          },
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: undefined,
            optional: true,
            tags: new Map(),
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
              optional: true,
              tags: new Map(),
              targetName: undefined,
            },
          ],
          [
            "baz",
            {
              kind: MaybeClassElementMetadataKind.unknown,
              name: undefined,
              optional: true,
              tags: new Map(),
              targetName: undefined,
            },
          ],
        ]),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
