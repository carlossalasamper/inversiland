import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { postConstruct } from "../../../src/metadata/decorators/postConstruct";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";

describe(postConstruct.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @postConstruct()
        public dispose(): void {
          return;
        }
      }

      result = getMetadata(classMetadataReflectKey, Foo);
    });

    it("should return expected metadata", () => {
      const expected: ClassMetadata = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: "dispose",
          preDestroyMethodName: undefined,
        },
        properties: new Map(),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
