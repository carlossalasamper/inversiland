import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("@inversiland/metadata");

jest.mock(
  "../../../src/metadata/utils/updating/updateMaybeClassMetadataPreDestroy"
);
jest.mock("../../../src/metadata/utils/getters/getDefaultClassMetadata");
jest.mock("../../../src/metadata/utils/errors/handleInjectionError");

import { updateMetadata } from "@inversiland/metadata";

import { preDestroy } from "../../../src/metadata/decorators/preDestroy";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { MaybeClassMetadata } from "../../../src/metadata/types/MaybeClassMetadata";
import { handleInjectionError } from "../../../src/metadata/utils/errors/handleInjectionError";
import { getDefaultClassMetadata } from "../../../src/metadata/utils/getters/getDefaultClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";
import { updateMaybeClassMetadataPreDestroy } from "../../../src/metadata/utils/updating/updateMaybeClassMetadataPreDestroy";

describe(preDestroy.name, () => {
  let targetFixture: object;
  let propertyKeyFixture: string | symbol;
  let descriptorFixture: TypedPropertyDescriptor<unknown>;

  beforeAll(() => {
    targetFixture = class Foo {}.prototype;
    propertyKeyFixture = Symbol();
    descriptorFixture = {};
  });

  describe("when caled", () => {
    let classMetadataFixture: ClassMetadata;

    let updateMaybeClassMetadataPostConstructorResult: jest.Mock<
      (metadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      classMetadataFixture = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: undefined,
        },
        properties: new Map(),
      };

      updateMaybeClassMetadataPostConstructorResult = jest.fn();

      (
        getDefaultClassMetadata as jest.Mock<typeof getDefaultClassMetadata>
      ).mockReturnValueOnce(classMetadataFixture);

      (
        updateMaybeClassMetadataPreDestroy as jest.Mock<
          typeof updateMaybeClassMetadataPreDestroy
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataPostConstructorResult);

      result = preDestroy()(
        targetFixture,
        propertyKeyFixture,
        descriptorFixture
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getDefaultClassMetadata()", () => {
      expect(getDefaultClassMetadata).toHaveBeenCalledTimes(1);
      expect(getDefaultClassMetadata).toHaveBeenCalledWith();
    });

    it("should call updateMaybeClassMetadataPreDestroy()", () => {
      expect(updateMaybeClassMetadataPreDestroy).toHaveBeenCalledTimes(1);
      expect(updateMaybeClassMetadataPreDestroy).toHaveBeenCalledWith(
        propertyKeyFixture
      );
    });

    it("should call updateMetadata()", () => {
      expect(updateMetadata).toHaveBeenCalledTimes(1);
      expect(updateMetadata).toHaveBeenCalledWith(
        classMetadataReflectKey,
        classMetadataFixture,
        updateMaybeClassMetadataPostConstructorResult,
        targetFixture.constructor
      );
    });

    it("should return undefined", () => {
      expect(result).toBeUndefined();
    });
  });

  describe("when caled, and updateReflectMetadata throws an Error", () => {
    let classMetadataFixture: ClassMetadata;
    let errorFixture: Error;

    let updateMaybeClassMetadataPostConstructorResult: jest.Mock<
      (metadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      classMetadataFixture = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: undefined,
        },
        properties: new Map(),
      };

      errorFixture = new Error("error-fixture");

      updateMaybeClassMetadataPostConstructorResult = jest.fn();

      (
        getDefaultClassMetadata as jest.Mock<typeof getDefaultClassMetadata>
      ).mockReturnValueOnce(classMetadataFixture);

      (
        updateMaybeClassMetadataPreDestroy as jest.Mock<
          typeof updateMaybeClassMetadataPreDestroy
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataPostConstructorResult);

      (updateMetadata as jest.Mock<typeof updateMetadata>).mockImplementation(
        (): never => {
          throw errorFixture;
        }
      );

      result = preDestroy()(
        targetFixture,
        propertyKeyFixture,
        descriptorFixture
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call getDefaultClassMetadata()", () => {
      expect(getDefaultClassMetadata).toHaveBeenCalledTimes(1);
      expect(getDefaultClassMetadata).toHaveBeenCalledWith();
    });

    it("should call updateMaybeClassMetadataPreDestroy()", () => {
      expect(updateMaybeClassMetadataPreDestroy).toHaveBeenCalledTimes(1);
      expect(updateMaybeClassMetadataPreDestroy).toHaveBeenCalledWith(
        propertyKeyFixture
      );
    });

    it("should call updateMetadata()", () => {
      expect(updateMetadata).toHaveBeenCalledTimes(1);
      expect(updateMetadata).toHaveBeenCalledWith(
        classMetadataReflectKey,
        classMetadataFixture,
        updateMaybeClassMetadataPostConstructorResult,
        targetFixture.constructor
      );
    });

    it("should call handleInjectionError", () => {
      expect(handleInjectionError).toHaveBeenCalledTimes(1);
      expect(handleInjectionError).toHaveBeenCalledWith(
        targetFixture,
        propertyKeyFixture,
        undefined,
        errorFixture
      );
    });

    it("should return undefined", () => {
      expect(result).toBeUndefined();
    });
  });
});
