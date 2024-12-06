import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { multiInject } from "../../../src/metadata/decorators/multiInject";
import { ClassElementMetadataKind } from "../../../src/metadata/types/ClassElementMetadataKind";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";

describe(multiInject.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @multiInject("bar")
        public readonly bar!: string;

        @multiInject("baz")
        public readonly baz!: string;

        constructor(
          @multiInject("firstParam")
          public firstParam: number,
          @multiInject("secondParam")
          public secondParam: number
        ) {}
      }

      result = getMetadata(classMetadataReflectKey, Foo);
    });

    it("should return expected metadata", () => {
      const expected: ClassMetadata = {
        constructorArguments: [
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "firstParam",
          },
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "secondParam",
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
              kind: ClassElementMetadataKind.multipleInjection,
              name: undefined,
              optional: false,
              tags: new Map(),
              targetName: undefined,
              value: "bar",
            },
          ],
          [
            "baz",
            {
              kind: ClassElementMetadataKind.multipleInjection,
              name: undefined,
              optional: false,
              tags: new Map(),
              targetName: undefined,
              value: "baz",
            },
          ],
        ]),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
