import { beforeAll, describe, expect, it } from "@jest/globals";

import { ClassMetadata } from "../../../../src/metadata/types/ClassMetadata";
import { getDefaultClassMetadata } from "../../../../src/metadata/utils/getters/getDefaultClassMetadata";

describe(getDefaultClassMetadata.name, () => {
  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      result = getDefaultClassMetadata();
    });

    it("should return ClassMetadata", () => {
      const expected: ClassMetadata = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: undefined,
        },
        properties: new Map(),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
