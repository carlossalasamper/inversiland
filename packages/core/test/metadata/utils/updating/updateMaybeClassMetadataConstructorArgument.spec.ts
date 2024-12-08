import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { ManagedClassElementMetadata } from "../../../../src/metadata/types/ManagedClassElementMetadata";
import { MaybeClassElementMetadata } from "../../../../src/metadata/types/MaybeClassElementMetadata";
import { MaybeClassMetadata } from "../../../../src/metadata/types/MaybeClassMetadata";
import { updateMaybeClassMetadataConstructorArgument } from "../../../../src/metadata/utils/updating/updateMaybeClassMetadataConstructorArgument";

describe(updateMaybeClassMetadataConstructorArgument.name, () => {
  let updateMetadataMock: jest.Mock<
    (
      classMetadata: MaybeClassElementMetadata | undefined
    ) => MaybeClassElementMetadata
  >;
  let classMetadataFixture: MaybeClassMetadata;
  let originalClassMetadataFixture: MaybeClassMetadata;
  let indexFixture: number;

  beforeAll(() => {
    updateMetadataMock = jest.fn();

    classMetadataFixture = {
      constructorArguments: [],
      lifecycle: {
        postConstructMethodName: undefined,
        preDestroyMethodName: undefined,
      },
      properties: new Map(),
    };

    originalClassMetadataFixture = {
      constructorArguments: [],
      lifecycle: {
        postConstructMethodName: undefined,
        preDestroyMethodName: undefined,
      },
      properties: new Map(),
    };

    indexFixture = 0;
  });

  describe("when called", () => {
    let classElementMetadataFixture: ManagedClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: Symbol(),
      };

      updateMetadataMock.mockReturnValueOnce(classElementMetadataFixture);

      result = updateMaybeClassMetadataConstructorArgument(
        updateMetadataMock,
        indexFixture
      )(classMetadataFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call updateMetadata()", () => {
      expect(updateMetadataMock).toHaveBeenCalledTimes(1);
      expect(updateMetadataMock).toHaveBeenCalledWith(undefined);
    });

    it("should return MaybeClassMetadata", () => {
      const expected: MaybeClassMetadata = {
        ...originalClassMetadataFixture,
        constructorArguments: [classElementMetadataFixture],
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
