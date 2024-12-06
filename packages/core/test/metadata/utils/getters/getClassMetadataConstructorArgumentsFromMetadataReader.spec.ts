import { Newable } from "@inversiland/common";
import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock(
  "../../../../src/metadata/utils/assertion/assertConstructorMetadataArrayFilled"
);
jest.mock(
  "../../../../src/metadata/utils/getters/getClassElementMetadataFromNewable"
);
jest.mock(
  "../../../../src/metadata/utils/getters/getConstructorArgumentMetadataFromLegacyMetadata"
);

import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { LegacyMetadata } from "../../../../src/metadata/types/LegacyMetadata";
import { LegacyMetadataMap } from "../../../../src/metadata/types/LegacyMetadataMap";
import { LegacyMetadataReader } from "../../../../src/metadata/types/LegacyMetadataReader";
import { assertConstructorMetadataArrayFilled } from "../../../../src/metadata/utils/assertion/assertConstructorMetadataArrayFilled";
import { getClassElementMetadataFromNewable } from "../../../../src/metadata/utils/getters/getClassElementMetadataFromNewable";
import { getClassMetadataConstructorArgumentsFromMetadataReader } from "../../../../src/metadata/utils/getters/getClassMetadataConstructorArgumentsFromMetadataReader";
import { getConstructorArgumentMetadataFromLegacyMetadata } from "../../../../src/metadata/utils/getters/getConstructorArgumentMetadataFromLegacyMetadata";

describe(getClassMetadataConstructorArgumentsFromMetadataReader.name, () => {
  describe("when called, and getReflectMetadata() provides typescript metadata", () => {
    let typescriptTypeFixture: Newable;

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let classElementMetadataFixture: ClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      typescriptTypeFixture = class {};

      typeFixture = class {};
      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      metadataReaderMock.getConstructorMetadata.mockReturnValueOnce({
        compilerGeneratedMetadata: [typescriptTypeFixture],
        userGeneratedMetadata: {},
      });

      (
        getClassElementMetadataFromNewable as jest.Mock<
          typeof getClassElementMetadataFromNewable
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArgumentsFromMetadataReader(
        typeFixture,
        metadataReaderMock
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call metadataReader.getConstructorMetadata()", () => {
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledTimes(
        1
      );
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledWith(
        typeFixture
      );
    });

    it("should call getClassElementMetadataFromNewable()", () => {
      expect(getClassElementMetadataFromNewable).toHaveBeenCalledTimes(1);
      expect(getClassElementMetadataFromNewable).toHaveBeenCalledWith(
        typescriptTypeFixture
      );
    });

    it("should call assertConstructorMetadataArrayFilled()", () => {
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledTimes(1);
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledWith(
        typeFixture,
        [classElementMetadataFixture]
      );
    });

    it("should return ClassElementMetadata[]", () => {
      expect(result).toStrictEqual([classElementMetadataFixture]);
    });
  });

  describe("when called, and getReflectMetadata() provides tag metadata", () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let classElementMetadataFixture: ClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      legacyMetadataMapPropertyFixture = "0";
      legacyMetadataListFixture = [
        {
          key: "key-fixture",
          value: "value-fixture",
        },
      ];

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      typeFixture = class {};
      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      metadataReaderMock.getConstructorMetadata.mockReturnValueOnce({
        compilerGeneratedMetadata: undefined,
        userGeneratedMetadata: legacyMetadataMap,
      });

      (
        getConstructorArgumentMetadataFromLegacyMetadata as jest.Mock<
          typeof getConstructorArgumentMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArgumentsFromMetadataReader(
        typeFixture,
        metadataReaderMock
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call metadataReader.getConstructorMetadata()", () => {
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledTimes(
        1
      );
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledWith(
        typeFixture
      );
    });

    it("should call getConstructorArgumentMetadataFromLegacyMetadata()", () => {
      expect(
        getConstructorArgumentMetadataFromLegacyMetadata
      ).toHaveBeenCalledTimes(1);
      expect(
        getConstructorArgumentMetadataFromLegacyMetadata
      ).toHaveBeenCalledWith(typeFixture, 0, legacyMetadataListFixture);
    });

    it("should call assertConstructorMetadataArrayFilled()", () => {
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledTimes(1);
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledWith(
        typeFixture,
        [classElementMetadataFixture]
      );
    });

    it("should return ClassElementMetadata[]", () => {
      expect(result).toStrictEqual([classElementMetadataFixture]);
    });
  });

  describe("when called, and getReflectMetadata() provides both typescript and tag metadata", () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let typescriptTypeFixture: Newable;

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let classElementMetadataFixture: ClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      legacyMetadataMapPropertyFixture = "0";
      legacyMetadataListFixture = [
        {
          key: "key-fixture",
          value: "value-fixture",
        },
      ];

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      typescriptTypeFixture = class {};

      typeFixture = class {};
      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      metadataReaderMock.getConstructorMetadata.mockReturnValueOnce({
        compilerGeneratedMetadata: [typescriptTypeFixture],
        userGeneratedMetadata: legacyMetadataMap,
      });

      (
        getConstructorArgumentMetadataFromLegacyMetadata as jest.Mock<
          typeof getConstructorArgumentMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArgumentsFromMetadataReader(
        typeFixture,
        metadataReaderMock
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call metadataReader.getConstructorMetadata()", () => {
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledTimes(
        1
      );
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledWith(
        typeFixture
      );
    });

    it("should call getConstructorArgumentMetadataFromLegacyMetadata()", () => {
      expect(
        getConstructorArgumentMetadataFromLegacyMetadata
      ).toHaveBeenCalledTimes(1);
      expect(
        getConstructorArgumentMetadataFromLegacyMetadata
      ).toHaveBeenCalledWith(typeFixture, 0, legacyMetadataListFixture);
    });

    it("should not call getClassElementMetadataFromNewable()", () => {
      expect(getClassElementMetadataFromNewable).not.toHaveBeenCalled();
    });

    it("should call assertConstructorMetadataArrayFilled()", () => {
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledTimes(1);
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledWith(
        typeFixture,
        [classElementMetadataFixture]
      );
    });

    it("should return ClassElementMetadata[]", () => {
      expect(result).toStrictEqual([classElementMetadataFixture]);
    });
  });
});
