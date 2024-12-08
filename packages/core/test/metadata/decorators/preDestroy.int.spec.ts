import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { preDestroy } from "../../../src/metadata/decorators/preDestroy";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";

describe(preDestroy.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @preDestroy()
        public initialize(): void {
          return;
        }
      }

      result = getMetadata(classMetadataReflectKey, Foo);
    });

    it("should return expected metadata", () => {
      const expected: ClassMetadata = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: "initialize",
        },
        properties: new Map(),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
