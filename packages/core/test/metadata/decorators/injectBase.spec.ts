import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("@inversiland/metadata");

jest.mock(
  "../../../src/metadata/utils/updating/updateMaybeClassMetadataConstructorArgument",
  () => ({
    updateMaybeClassMetadataConstructorArgument: jest.fn(),
  })
);

jest.mock(
  "../../../src/metadata/utils/updating/updateMaybeClassMetadataProperty",
  () => ({
    updateMaybeClassMetadataProperty: jest.fn(),
  })
);

jest.mock("../../../src/metadata/utils/getters/getDefaultClassMetadata");

import { Newable } from "@inversiland/common";
import { updateMetadata } from "@inversiland/metadata";

import { injectBase } from "../../../src/metadata/decorators/injectBase";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { MaybeClassElementMetadata } from "../../../src/metadata/types/MaybeClassElementMetadata";
import { MaybeClassMetadata } from "../../../src/metadata/types/MaybeClassMetadata";
import { getDefaultClassMetadata } from "../../../src/metadata/utils/getters/getDefaultClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";
import { updateMaybeClassMetadataConstructorArgument } from "../../../src/metadata/utils/updating/updateMaybeClassMetadataConstructorArgument";
import { updateMaybeClassMetadataProperty } from "../../../src/metadata/utils/updating/updateMaybeClassMetadataProperty";

describe(injectBase.name, () => {
  let updateMetadataMock: jest.Mock<
    (
      metadata: MaybeClassElementMetadata | undefined
    ) => MaybeClassElementMetadata
  >;

  beforeAll(() => {
    updateMetadataMock =
      jest.fn<
        (
          metadata: MaybeClassElementMetadata | undefined
        ) => MaybeClassElementMetadata
      >();
  });

  describe("when called, as property decorator", () => {
    let defaultClassMetadataFixture: ClassMetadata;
    let targetFixture: Newable;
    let updateMaybeClassMetadataPropertyResult: jest.Mock<
      (classMetadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    beforeAll(() => {
      defaultClassMetadataFixture = {
        [Symbol()]: Symbol(),
      } as unknown as ClassMetadata;

      updateMaybeClassMetadataPropertyResult = jest.fn();

      (
        getDefaultClassMetadata as jest.Mock<typeof getDefaultClassMetadata>
      ).mockReturnValueOnce(defaultClassMetadataFixture);

      (
        updateMaybeClassMetadataProperty as jest.Mock<
          typeof updateMaybeClassMetadataProperty
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataPropertyResult);

      class TargetFixture {
        @injectBase(updateMetadataMock)
        public foo: string | undefined;
      }

      targetFixture = TargetFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call updateMetadata()", () => {
      expect(updateMetadata).toHaveBeenCalledTimes(1);
      expect(updateMetadata).toHaveBeenCalledWith(
        classMetadataReflectKey,
        defaultClassMetadataFixture,
        updateMaybeClassMetadataPropertyResult,
        targetFixture
      );
    });
  });

  describe("when called, as constructor parameter decorator", () => {
    let defaultClassMetadataFixture: ClassMetadata;
    let targetFixture: Newable;
    let updateMaybeClassMetadataConstructorArgumentsResult: jest.Mock<
      (classMetadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    beforeAll(() => {
      defaultClassMetadataFixture = {
        [Symbol()]: Symbol(),
      } as unknown as ClassMetadata;

      updateMaybeClassMetadataConstructorArgumentsResult = jest.fn();

      (
        getDefaultClassMetadata as jest.Mock<typeof getDefaultClassMetadata>
      ).mockReturnValueOnce(defaultClassMetadataFixture);

      (
        updateMaybeClassMetadataConstructorArgument as jest.Mock<
          typeof updateMaybeClassMetadataConstructorArgument
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataConstructorArgumentsResult);

      class TargetFixture {
        constructor(
          @injectBase(updateMetadataMock)
          public foo: string | undefined
        ) {}
      }

      targetFixture = TargetFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call updateMetadata()", () => {
      expect(updateMetadata).toHaveBeenCalledTimes(1);
      expect(updateMetadata).toHaveBeenCalledWith(
        classMetadataReflectKey,
        expect.anything(),
        updateMaybeClassMetadataConstructorArgumentsResult,
        targetFixture
      );
    });
  });

  describe("when called, as non constructor parameter decorator", () => {
    let result: unknown;

    beforeAll(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line unused-imports/no-unused-vars
        class TargetFixture {
          public doSomethingWithFoo(
            @injectBase(updateMetadataMock)
            foo: string | undefined
          ) {
            console.log(foo ?? "?");
          }
        }
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should throw an error", () => {
      const expectedPartialError: Partial<Error> = {
        message: `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method "doSomethingWithFoo" at class "TargetFixture"`,
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedPartialError)
      );
    });
  });
});
