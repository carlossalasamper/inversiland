import { beforeAll, describe, expect, it } from "@jest/globals";

import { InversifyCoreError } from "../../../../src/error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../../src/error/types/InversifyCoreErrorKind";
import { MaybeClassMetadata } from "../../../../src/metadata/types/MaybeClassMetadata";
import { updateMaybeClassMetadataPostConstructor } from "../../../../src/metadata/utils/updating/updateMaybeClassMetadataPostConstructor";

describe(updateMaybeClassMetadataPostConstructor.name, () => {
  describe("having metadata with no postConstructorMethodName", () => {
    let metadataFixture: MaybeClassMetadata;
    let methodNameFixture: string | symbol;

    beforeAll(() => {
      metadataFixture = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: undefined,
        },
        properties: new Map(),
      };
      methodNameFixture = Symbol();
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result =
          updateMaybeClassMetadataPostConstructor(methodNameFixture)(
            metadataFixture
          );
      });

      it("should return MaybeClassMetadata", () => {
        const expected: MaybeClassMetadata = {
          constructorArguments: [],
          lifecycle: {
            postConstructMethodName: methodNameFixture,
            preDestroyMethodName: undefined,
          },
          properties: new Map(),
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe("having metadata with postConstructorMethodName", () => {
    let metadataFixture: MaybeClassMetadata;
    let methodNameFixture: string | symbol;

    beforeAll(() => {
      metadataFixture = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: "postConstructorMethodName",
          preDestroyMethodName: undefined,
        },
        properties: new Map(),
      };
      methodNameFixture = Symbol();
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        try {
          updateMaybeClassMetadataPostConstructor(methodNameFixture)(
            metadataFixture
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      it("should throw InversifyCoreError", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.injectionDecoratorConflict,
          message: "Unexpected duplicated postConstruct decorator",
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });
});
