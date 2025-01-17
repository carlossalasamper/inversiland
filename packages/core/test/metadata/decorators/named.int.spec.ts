import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { named } from "../../../src/metadata/decorators/named";
import { MaybeClassElementMetadataKind } from "../../../src/metadata/types/MaybeClassElementMetadataKind";
import { MaybeClassMetadata } from "../../../src/metadata/types/MaybeClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";

describe(named.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @named("bar")
        public readonly bar!: string;

        @named("baz")
        public readonly baz!: string;

        constructor(
          @named("firstParam")
          public firstParam: number,
          @named("secondParam")
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
            name: "firstParam",
            optional: false,
            tags: new Map(),
            targetName: undefined,
          },
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: "secondParam",
            optional: false,
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
              name: "bar",
              optional: false,
              tags: new Map(),
              targetName: undefined,
            },
          ],
          [
            "baz",
            {
              kind: MaybeClassElementMetadataKind.unknown,
              name: "baz",
              optional: false,
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
