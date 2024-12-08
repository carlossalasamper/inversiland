import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock(
  "../../../../src/metadata/utils/getters/getPropertyMetadataFromLegacyMetadata"
);

import { Newable } from "@inversiland/common";

import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { LegacyMetadata } from "../../../../src/metadata/types/LegacyMetadata";
import { LegacyMetadataMap } from "../../../../src/metadata/types/LegacyMetadataMap";
import { LegacyMetadataReader } from "../../../../src/metadata/types/LegacyMetadataReader";
import { getClassMetadataPropertiesFromMetadataReader } from "../../../../src/metadata/utils/getters/getClassMetadataPropertiesFromMetadataReader";
import { getPropertyMetadataFromLegacyMetadata } from "../../../../src/metadata/utils/getters/getPropertyMetadataFromLegacyMetadata";

describe(getClassMetadataPropertiesFromMetadataReader.name, () => {
  describe("when called, and metadataReader.getPropertiesMetadata() returns LegacyMetadataMap with a symbol property", () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let classElementMetadataFixture: ClassElementMetadata;

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let result: unknown;

    beforeAll(() => {
      legacyMetadataMapPropertyFixture = Symbol();
      legacyMetadataListFixture = [
        {
          key: "key-fixture",
          value: "value-fixture",
        },
      ];

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: Symbol(),
      };

      typeFixture = class {};

      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      metadataReaderMock.getPropertiesMetadata.mockReturnValueOnce(
        legacyMetadataMap
      );

      (
        getPropertyMetadataFromLegacyMetadata as jest.Mock<
          typeof getPropertyMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataPropertiesFromMetadataReader(
        typeFixture,
        metadataReaderMock
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call metadataReader.getPropertiesMetadata()", () => {
      expect(metadataReaderMock.getPropertiesMetadata).toHaveBeenCalledTimes(1);
      expect(metadataReaderMock.getPropertiesMetadata).toHaveBeenCalledWith(
        typeFixture
      );
    });

    it("should call getPropertyMetadataFromLegacyMetadata()", () => {
      expect(getPropertyMetadataFromLegacyMetadata).toHaveBeenCalledTimes(1);
      expect(getPropertyMetadataFromLegacyMetadata).toHaveBeenCalledWith(
        typeFixture,
        legacyMetadataMapPropertyFixture,
        legacyMetadataListFixture
      );
    });

    it("should return a Map", () => {
      const expected: Map<string | symbol, ClassElementMetadata> = new Map([
        [legacyMetadataMapPropertyFixture, classElementMetadataFixture],
      ]);

      expect(result).toStrictEqual(expected);
    });
  });

  describe("when called, and metadataReader.getPropertiesMetadata() returns LegacyMetadataMap with a string property", () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let classElementMetadataFixture: ClassElementMetadata;

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let result: unknown;

    beforeAll(() => {
      legacyMetadataMapPropertyFixture = "property-fixture";
      legacyMetadataListFixture = [
        {
          key: "key-fixture",
          value: "value-fixture",
        },
      ];

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: Symbol(),
      };

      typeFixture = class {};
      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      metadataReaderMock.getPropertiesMetadata.mockReturnValueOnce(
        legacyMetadataMap
      );

      (
        getPropertyMetadataFromLegacyMetadata as jest.Mock<
          typeof getPropertyMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataPropertiesFromMetadataReader(
        typeFixture,
        metadataReaderMock
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call metadataReader.getPropertiesMetadata()", () => {
      expect(metadataReaderMock.getPropertiesMetadata).toHaveBeenCalledTimes(1);
      expect(metadataReaderMock.getPropertiesMetadata).toHaveBeenCalledWith(
        typeFixture
      );
    });

    it("should call getPropertyMetadataFromLegacyMetadata()", () => {
      expect(getPropertyMetadataFromLegacyMetadata).toHaveBeenCalledTimes(1);
      expect(getPropertyMetadataFromLegacyMetadata).toHaveBeenCalledWith(
        typeFixture,
        legacyMetadataMapPropertyFixture,
        legacyMetadataListFixture
      );
    });

    it("should return a Map", () => {
      const expected: Map<string | symbol, ClassElementMetadata> = new Map([
        [legacyMetadataMapPropertyFixture, classElementMetadataFixture],
      ]);

      expect(result).toStrictEqual(expected);
    });
  });
});
