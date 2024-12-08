import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("@inversiland/metadata");

jest.mock(
  "../../../../src/metadata/utils/getters/getPropertyMetadataFromLegacyMetadata"
);

import { Newable } from "@inversiland/common";
import { getMetadata } from "@inversiland/metadata";

import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { LegacyMetadata } from "../../../../src/metadata/types/LegacyMetadata";
import { LegacyMetadataMap } from "../../../../src/metadata/types/LegacyMetadataMap";
import { getClassMetadataProperties } from "../../../../src/metadata/utils/getters/getClassMetadataProperties";
import { getPropertyMetadataFromLegacyMetadata } from "../../../../src/metadata/utils/getters/getPropertyMetadataFromLegacyMetadata";
import { TAGGED_PROP } from "../../../../src/metadata/utils/metadataKeys";

describe(getClassMetadataProperties.name, () => {
  describe("when called, and getReflectMetadata returns undefined", () => {
    let typeFixture: Newable;

    let result: unknown;

    beforeAll(() => {
      typeFixture = class {};

      (getMetadata as jest.Mock<typeof getMetadata>).mockReturnValueOnce(
        undefined
      );

      result = getClassMetadataProperties(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getMetadata()", () => {
      expect(getMetadata).toHaveBeenCalledTimes(1);
      expect(getMetadata).toHaveBeenCalledWith(TAGGED_PROP, typeFixture);
    });

    it("should return an empty Map", () => {
      expect(result).toStrictEqual(new Map());
    });
  });

  describe("when called, and getReflectMetadata returns LegacyMetadataMap with a symbol property", () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let classElementMetadataFixture: ClassElementMetadata;

    let typeFixture: Newable;

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

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      (getMetadata as jest.Mock<typeof getMetadata>).mockReturnValueOnce(
        legacyMetadataMap
      );

      (
        getPropertyMetadataFromLegacyMetadata as jest.Mock<
          typeof getPropertyMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataProperties(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getMetadata()", () => {
      expect(getMetadata).toHaveBeenCalledTimes(1);
      expect(getMetadata).toHaveBeenCalledWith(TAGGED_PROP, typeFixture);
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

  describe("when called, and getReflectMetadata returns LegacyMetadataMap with a string property", () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let classElementMetadataFixture: ClassElementMetadata;

    let typeFixture: Newable;

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

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      (getMetadata as jest.Mock<typeof getMetadata>).mockReturnValueOnce(
        legacyMetadataMap
      );

      (
        getPropertyMetadataFromLegacyMetadata as jest.Mock<
          typeof getPropertyMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataProperties(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getMetadata()", () => {
      expect(getMetadata).toHaveBeenCalledTimes(1);
      expect(getMetadata).toHaveBeenCalledWith(TAGGED_PROP, typeFixture);
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
