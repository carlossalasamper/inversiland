import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { inject } from "../../../src/metadata/decorators/inject";
import { ClassElementMetadataKind } from "../../../src/metadata/types/ClassElementMetadataKind";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";

describe(inject.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @inject("bar")
        public readonly bar!: string;

        @inject("baz")
        public readonly baz!: string;

        constructor(
          @inject("firstParam")
          public firstParam: number,
          @inject("secondParam")
          public secondParam: number
        ) {}
      }

      result = getMetadata(classMetadataReflectKey, Foo);
    });

    it("should return expected metadata", () => {
      const expected: ClassMetadata = {
        constructorArguments: [
          {
            kind: ClassElementMetadataKind.singleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "firstParam",
          },
          {
            kind: ClassElementMetadataKind.singleInjection,
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
              kind: ClassElementMetadataKind.singleInjection,
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
              kind: ClassElementMetadataKind.singleInjection,
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
