import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("@inversiland/metadata");

import { Newable } from "@inversiland/common";

jest.mock(
  "../../../../src/metadata/utils/assertion/assertConstructorMetadataArrayFilled"
);
jest.mock(
  "../../../../src/metadata/utils/getters/getClassElementMetadataFromNewable"
);
jest.mock(
  "../../../../src/metadata/utils/getters/getConstructorArgumentMetadataFromLegacyMetadata"
);

import { getMetadata } from "@inversiland/metadata";

import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { LegacyMetadata } from "../../../../src/metadata/types/LegacyMetadata";
import { LegacyMetadataMap } from "../../../../src/metadata/types/LegacyMetadataMap";
import { assertConstructorMetadataArrayFilled } from "../../../../src/metadata/utils/assertion/assertConstructorMetadataArrayFilled";
import { getClassElementMetadataFromNewable } from "../../../../src/metadata/utils/getters/getClassElementMetadataFromNewable";
import { getClassMetadataConstructorArguments } from "../../../../src/metadata/utils/getters/getClassMetadataConstructorArguments";
import { getConstructorArgumentMetadataFromLegacyMetadata } from "../../../../src/metadata/utils/getters/getConstructorArgumentMetadataFromLegacyMetadata";
import {
  DESIGN_PARAM_TYPES,
  TAGGED,
} from "../../../../src/metadata/utils/metadataKeys";

describe(getClassMetadataConstructorArguments.name, () => {
  describe("when called, and getReflectMetadata() provides typescript metadata", () => {
    let typescriptTypeFixture: Newable;
    let typeFixture: Newable;

    let classElementMetadataFixture: ClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      typescriptTypeFixture = class {};

      typeFixture = class {};

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      (getMetadata as jest.Mock<typeof getMetadata>)
        .mockReturnValueOnce([typescriptTypeFixture])
        .mockReturnValueOnce(undefined);

      (
        getClassElementMetadataFromNewable as jest.Mock<
          typeof getClassElementMetadataFromNewable
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArguments(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getMetadata()", () => {
      expect(getMetadata).toHaveBeenCalledTimes(2);
      expect(getMetadata).toHaveBeenNthCalledWith(
        1,

        DESIGN_PARAM_TYPES,
        typeFixture
      );
      expect(getMetadata).toHaveBeenNthCalledWith(2, TAGGED, typeFixture);
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

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      (getMetadata as jest.Mock<typeof getMetadata>)
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(legacyMetadataMap);

      (
        getConstructorArgumentMetadataFromLegacyMetadata as jest.Mock<
          typeof getConstructorArgumentMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArguments(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getMetadata()", () => {
      expect(getMetadata).toHaveBeenCalledTimes(2);
      expect(getMetadata).toHaveBeenNthCalledWith(
        1,
        DESIGN_PARAM_TYPES,
        typeFixture
      );
      expect(getMetadata).toHaveBeenNthCalledWith(2, TAGGED, typeFixture);
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

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      (getMetadata as jest.Mock<typeof getMetadata>)
        .mockReturnValueOnce([typescriptTypeFixture])
        .mockReturnValueOnce(legacyMetadataMap);

      (
        getConstructorArgumentMetadataFromLegacyMetadata as jest.Mock<
          typeof getConstructorArgumentMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArguments(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getMetadata()", () => {
      expect(getMetadata).toHaveBeenCalledTimes(2);
      expect(getMetadata).toHaveBeenNthCalledWith(
        1,
        DESIGN_PARAM_TYPES,
        typeFixture
      );
      expect(getMetadata).toHaveBeenNthCalledWith(2, TAGGED, typeFixture);
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
