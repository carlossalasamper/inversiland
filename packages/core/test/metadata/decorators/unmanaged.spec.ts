import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock(
  "../../../src/metadata/utils/building/buildUnmanagedMetadataFromMaybeClassElementMetadata"
);
jest.mock("../../../src/metadata/utils/errors/handleInjectionError");
jest.mock("../../../src/metadata/decorators/injectBase");

import { injectBase } from "../../../src/metadata/decorators/injectBase";
import { unmanaged } from "../../../src/metadata/decorators/unmanaged";
import { ClassElementMetadata } from "../../../src/metadata/types/ClassElementMetadata";
import { MaybeClassElementMetadata } from "../../../src/metadata/types/MaybeClassElementMetadata";
import { buildUnmanagedMetadataFromMaybeClassElementMetadata } from "../../../src/metadata/utils/building/buildUnmanagedMetadataFromMaybeClassElementMetadata";
import { handleInjectionError } from "../../../src/metadata/utils/errors/handleInjectionError";

describe(unmanaged.name, () => {
  describe("having a non undefined propertyKey and an undefined parameterIndex", () => {
    let targetFixture: object;
    let propertyKeyFixture: string | symbol;

    beforeAll(() => {
      targetFixture = class {};
      propertyKeyFixture = "property-key";
    });

    describe("when called", () => {
      let injectBaseDecoratorMock: jest.Mock<
        ParameterDecorator & PropertyDecorator
      > &
        ParameterDecorator &
        PropertyDecorator;

      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined
        ) => ClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        injectBaseDecoratorMock = jest.fn() as jest.Mock<
          ParameterDecorator & PropertyDecorator
        > &
          ParameterDecorator &
          PropertyDecorator;

        updateMetadataMock = jest.fn();

        (
          buildUnmanagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildUnmanagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockReturnValueOnce(
          injectBaseDecoratorMock
        );

        result = unmanaged()(targetFixture, propertyKeyFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call buildUnmanagedMetadataFromMaybeClassElementMetadata()", () => {
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata
        ).toHaveBeenCalledTimes(1);
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata
        ).toHaveBeenCalledWith();
      });

      it("should call injectBase()", () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(updateMetadataMock);
      });

      it("should call injectBaseDecorator()", () => {
        expect(injectBaseDecoratorMock).toHaveBeenCalledTimes(1);
        expect(injectBaseDecoratorMock).toHaveBeenCalledWith(
          targetFixture,
          propertyKeyFixture
        );
      });

      it("should return undefined", () => {
        expect(result).toBeUndefined();
      });
    });

    describe("when called, and injectBase throws an Error", () => {
      let errorFixture: Error;
      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined
        ) => ClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        errorFixture = new Error("message-error-fixture");
        updateMetadataMock = jest.fn();

        (
          buildUnmanagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildUnmanagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockImplementation(
          (): never => {
            throw errorFixture;
          }
        );

        (
          handleInjectionError as jest.Mock<typeof handleInjectionError>
        ).mockImplementation(
          (
            _target: object,
            _propertyKey: string | symbol | undefined,
            _parameterIndex: number | undefined,
            error: unknown
          ): never => {
            throw error;
          }
        );

        try {
          unmanaged()(targetFixture, propertyKeyFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call buildUnmanagedMetadataFromMaybeClassElementMetadata()", () => {
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata
        ).toHaveBeenCalledTimes(1);
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata
        ).toHaveBeenCalledWith();
      });

      it("should call injectBase()", () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(updateMetadataMock);
      });

      it("should throw handleInjectionError()", () => {
        expect(handleInjectionError).toHaveBeenCalledTimes(1);
        expect(handleInjectionError).toHaveBeenCalledWith(
          targetFixture,
          propertyKeyFixture,
          undefined,
          errorFixture
        );
      });

      it("should throw an Error", () => {
        expect(result).toBe(errorFixture);
      });
    });
  });

  describe("having an undefined propertyKey and an non undefined parameterIndex", () => {
    let targetFixture: object;
    let paramIndexFixture: number;

    beforeAll(() => {
      targetFixture = class {};
      paramIndexFixture = 0;
    });

    describe("when called", () => {
      let injectBaseDecoratorMock: jest.Mock<
        ParameterDecorator & PropertyDecorator
      > &
        ParameterDecorator &
        PropertyDecorator;

      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined
        ) => ClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        injectBaseDecoratorMock = jest.fn() as jest.Mock<
          ParameterDecorator & PropertyDecorator
        > &
          ParameterDecorator &
          PropertyDecorator;

        updateMetadataMock = jest.fn();

        (
          buildUnmanagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildUnmanagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockReturnValueOnce(
          injectBaseDecoratorMock
        );

        result = unmanaged()(targetFixture, undefined, paramIndexFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call buildUnmanagedMetadataFromMaybeClassElementMetadata()", () => {
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata
        ).toHaveBeenCalledTimes(1);
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata
        ).toHaveBeenCalledWith();
      });

      it("should call injectBase()", () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(updateMetadataMock);
      });

      it("should call injectBaseDecorator()", () => {
        expect(injectBaseDecoratorMock).toHaveBeenCalledTimes(1);
        expect(injectBaseDecoratorMock).toHaveBeenCalledWith(
          targetFixture,
          undefined,
          paramIndexFixture
        );
      });

      it("should return undefined", () => {
        expect(result).toBeUndefined();
      });
    });

    describe("when called, and injectBase throws an Error", () => {
      let errorFixture: Error;
      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined
        ) => ClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        errorFixture = new Error("message-error-fixture");
        updateMetadataMock = jest.fn();

        (
          buildUnmanagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildUnmanagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockImplementation(
          (): never => {
            throw errorFixture;
          }
        );

        (
          handleInjectionError as jest.Mock<typeof handleInjectionError>
        ).mockImplementation(
          (
            _target: object,
            _propertyKey: string | symbol | undefined,
            _parameterIndex: number | undefined,
            error: unknown
          ): never => {
            throw error;
          }
        );

        try {
          unmanaged()(targetFixture, undefined, paramIndexFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call buildUnmanagedMetadataFromMaybeClassElementMetadata()", () => {
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata
        ).toHaveBeenCalledTimes(1);
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata
        ).toHaveBeenCalledWith();
      });

      it("should call injectBase()", () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(updateMetadataMock);
      });

      it("should throw handleInjectionError()", () => {
        expect(handleInjectionError).toHaveBeenCalledTimes(1);
        expect(handleInjectionError).toHaveBeenCalledWith(
          targetFixture,
          undefined,
          paramIndexFixture,
          errorFixture
        );
      });

      it("should throw an Error", () => {
        expect(result).toBe(errorFixture);
      });
    });
  });
});
