import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("@inversiland/metadata");

jest.mock(
  "../../../../src/metadata/utils/getters/getClassMetadataConstructorArgumentsFromMetadataReader"
);
jest.mock(
  "../../../../src/metadata/utils/getters/getClassMetadataPropertiesFromMetadataReader"
);

import { Newable } from "@inversiland/common";
import { getMetadata } from "@inversiland/metadata";

import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { ClassMetadata } from "../../../../src/metadata/types/ClassMetadata";
import { LegacyMetadata } from "../../../../src/metadata/types/LegacyMetadata";
import { LegacyMetadataReader } from "../../../../src/metadata/types/LegacyMetadataReader";
import { getClassMetadataConstructorArgumentsFromMetadataReader } from "../../../../src/metadata/utils/getters/getClassMetadataConstructorArgumentsFromMetadataReader";
import { getClassMetadataFromMetadataReader } from "../../../../src/metadata/utils/getters/getClassMetadataFromMetadataReader";
import { getClassMetadataPropertiesFromMetadataReader } from "../../../../src/metadata/utils/getters/getClassMetadataPropertiesFromMetadataReader";
import {
  POST_CONSTRUCT,
  PRE_DESTROY,
} from "../../../../src/metadata/utils/metadataKeys";

describe(getClassMetadataFromMetadataReader.name, () => {
  describe("when called, and getReflectMetadata() returns LegacyMetadata", () => {
    let constructorArgumentsMetadataFixture: ClassElementMetadata[];
    let propertiesMetadataFixture: Map<string | symbol, ClassElementMetadata>;
    let postConstructMetadataFixture: LegacyMetadata;
    let preDestroyMetadataFixture: LegacyMetadata;

    let typeFixture: Newable;
    let metadataReaderFixture: LegacyMetadataReader;

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
      metadataReaderFixture = Symbol() as unknown as LegacyMetadataReader;

      (
        getClassMetadataConstructorArgumentsFromMetadataReader as jest.Mock<
          typeof getClassMetadataConstructorArgumentsFromMetadataReader
        >
      ).mockReturnValueOnce(constructorArgumentsMetadataFixture);

      (
        getClassMetadataPropertiesFromMetadataReader as jest.Mock<
          typeof getClassMetadataPropertiesFromMetadataReader
        >
      ).mockReturnValueOnce(propertiesMetadataFixture);

      (getMetadata as jest.Mock<typeof getMetadata>)
        .mockReturnValueOnce(postConstructMetadataFixture)
        .mockReturnValueOnce(preDestroyMetadataFixture);

      result = getClassMetadataFromMetadataReader(
        typeFixture,
        metadataReaderFixture
      );
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

    it("should call getClassMetadataConstructorArgumentsFromMetadataReader()", () => {
      expect(
        getClassMetadataConstructorArgumentsFromMetadataReader
      ).toHaveBeenCalledTimes(1);
      expect(
        getClassMetadataConstructorArgumentsFromMetadataReader
      ).toHaveBeenCalledWith(typeFixture, metadataReaderFixture);
    });

    it("should call getClassMetadataPropertiesFromMetadataReader()", () => {
      expect(
        getClassMetadataPropertiesFromMetadataReader
      ).toHaveBeenCalledTimes(1);
      expect(getClassMetadataPropertiesFromMetadataReader).toHaveBeenCalledWith(
        typeFixture,
        metadataReaderFixture
      );
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
