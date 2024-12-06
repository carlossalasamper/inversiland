import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("@inversiland/metadata");

jest.mock(
  "../../../../src/metadata/utils/getters/getClassMetadataConstructorArguments"
);
jest.mock("../../../../src/metadata/utils/getters/getClassMetadataProperties");

import { Newable } from "@inversiland/common";
import { getMetadata } from "@inversiland/metadata";

import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { ClassMetadata } from "../../../../src/metadata/types/ClassMetadata";
import { LegacyMetadata } from "../../../../src/metadata/types/LegacyMetadata";
import { getClassMetadata } from "../../../../src/metadata/utils/getters/getClassMetadata";
import { getClassMetadataConstructorArguments } from "../../../../src/metadata/utils/getters/getClassMetadataConstructorArguments";
import { getClassMetadataProperties } from "../../../../src/metadata/utils/getters/getClassMetadataProperties";
import {
  POST_CONSTRUCT,
  PRE_DESTROY,
} from "../../../../src/metadata/utils/metadataKeys";

describe(getClassMetadata.name, () => {
  describe("when called, and getMetadata() returns LegacyMetadata", () => {
    let constructorArgumentsMetadataFixture: ClassElementMetadata[];
    let propertiesMetadataFixture: Map<string | symbol, ClassElementMetadata>;
    let postConstructMetadataFixture: LegacyMetadata;
    let preDestroyMetadataFixture: LegacyMetadata;

    let typeFixture: Newable;

    let result: unknown;

    beforeAll(() => {
      constructorArgumentsMetadataFixture = [
        {
          kind: ClassElementMetadataKind.unmanaged,
        },
      ];

      propertiesMetadataFixture = new Map([
        [
          "property-fixture",
          {
            kind: ClassElementMetadataKind.singleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: Symbol(),
          },
        ],
      ]);

      postConstructMetadataFixture = {
        key: "post-construct-key-fixture",
        value: "post-construct-value-fixture",
      };

      preDestroyMetadataFixture = {
        key: "pre-destroy-key-fixture",
        value: "pre-destroy-value-fixture",
      };

      typeFixture = class {};

      (
        getClassMetadataConstructorArguments as jest.Mock<
          typeof getClassMetadataConstructorArguments
        >
      ).mockReturnValueOnce(constructorArgumentsMetadataFixture);

      (
        getClassMetadataProperties as jest.Mock<
          typeof getClassMetadataProperties
        >
      ).mockReturnValueOnce(propertiesMetadataFixture);

      (getMetadata as jest.Mock<typeof getMetadata>)
        .mockReturnValueOnce(postConstructMetadataFixture)
        .mockReturnValueOnce(preDestroyMetadataFixture);

      result = getClassMetadata(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getMetadata()", () => {
      expect(getMetadata).toHaveBeenCalledTimes(2);
      expect(getMetadata).toHaveBeenNthCalledWith(
        1,
        POST_CONSTRUCT,
        typeFixture
      );
      expect(getMetadata).toHaveBeenNthCalledWith(2, PRE_DESTROY, typeFixture);
    });

    it("should call getClassMetadataConstructorArguments()", () => {
      expect(getClassMetadataConstructorArguments).toHaveBeenCalledTimes(1);
      expect(getClassMetadataConstructorArguments).toHaveBeenCalledWith(
        typeFixture
      );
    });

    it("should call getClassMetadataProperties()", () => {
      expect(getClassMetadataProperties).toHaveBeenCalledTimes(1);
      expect(getClassMetadataProperties).toHaveBeenCalledWith(typeFixture);
    });

    it("should return ClassMetadata", () => {
      const expected: ClassMetadata = {
        constructorArguments: constructorArgumentsMetadataFixture,
        lifecycle: {
          postConstructMethodName: postConstructMetadataFixture.value as string,
          preDestroyMethodName: preDestroyMetadataFixture.value as string,
        },
        properties: propertiesMetadataFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
