import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("../../../src/prototype/utils/getBaseType");
jest.mock("../../../src/legacyTarget/utils/getTargetId");

import { Newable } from "@inversiland/common";

import { LegacyTargetImpl } from "../../../src/legacyTarget/models/LegacyTargetImpl";
import { LegacyTarget } from "../../../src/legacyTarget/types/LegacyTarget";
import { getTargetId } from "../../../src/legacyTarget/utils/getTargetId";
import { getTargetsFromMetadataProviders } from "../../../src/legacyTarget/utils/getTargetsFromMetadataProviders";
import { ClassElementMetadata } from "../../../src/metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../../src/metadata/types/ClassElementMetadataKind";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { ManagedClassElementMetadata } from "../../../src/metadata/types/ManagedClassElementMetadata";
import { getBaseType } from "../../../src/prototype/utils/getBaseType";

describe(getTargetsFromMetadataProviders.name, () => {
  describe("having a type with a base type", () => {
    let getClassMetadataMock: jest.Mock<(type: Newable) => ClassMetadata>;
    let getClassMetadataPropertiesMock: jest.Mock<
      (type: Newable) => Map<string | symbol, ClassElementMetadata>
    >;

    class BaseType {}

    class Type extends BaseType {}

    beforeAll(() => {
      getClassMetadataMock = jest.fn();
      getClassMetadataPropertiesMock = jest.fn();
    });

    describe("when called, and getClassMetadataProperties() returns new and existing properties", () => {
      let existingProperty: string;
      let newProperty: string;

      let targetIdFixture: number;

      let classMetadataFixture: ClassMetadata;
      let constructorParamMetadata: ManagedClassElementMetadata;
      let existingPropertyBaseMetadata: ClassElementMetadata;
      let existingPropertyMetadata: ManagedClassElementMetadata;
      let newPropertyMetadata: ManagedClassElementMetadata;

      let result: unknown;

      beforeAll(() => {
        existingProperty = "existing-property";
        newProperty = "new-property";

        targetIdFixture = 13;

        constructorParamMetadata = {
          kind: ClassElementMetadataKind.multipleInjection,
          name: "constructor-name-fixture",
          optional: false,
          tags: new Map(),
          targetName: "constructor-target-name-fixture",
          value: Symbol(),
        };

        existingPropertyMetadata = {
          kind: ClassElementMetadataKind.singleInjection,
          name: "existing-name-fixture",
          optional: false,
          tags: new Map(),
          targetName: "existing-target-name-fixture",
          value: Symbol(),
        };

        existingPropertyBaseMetadata = {
          kind: ClassElementMetadataKind.singleInjection,
          name: "existing-base-name-fixture",
          optional: false,
          tags: new Map(),
          targetName: "existing-base-target-name-fixture",
          value: Symbol(),
        };

        newPropertyMetadata = {
          kind: ClassElementMetadataKind.singleInjection,
          name: "new-name-fixture",
          optional: false,
          tags: new Map(),
          targetName: "new-target-name-fixture",
          value: Symbol(),
        };

        classMetadataFixture = {
          constructorArguments: [constructorParamMetadata],
          lifecycle: {
            postConstructMethodName: undefined,
            preDestroyMethodName: undefined,
          },
          properties: new Map([
            [existingProperty, existingPropertyBaseMetadata],
          ]),
        };

        (getTargetId as jest.Mock<typeof getTargetId>).mockReturnValue(
          targetIdFixture
        );

        (getBaseType as jest.Mock<typeof getBaseType>)
          .mockReturnValueOnce(BaseType)
          .mockReturnValueOnce(Object);

        getClassMetadataMock.mockReturnValueOnce(classMetadataFixture);
        getClassMetadataPropertiesMock.mockReturnValueOnce(
          new Map([
            [existingProperty, existingPropertyMetadata],
            [newProperty, newPropertyMetadata],
          ])
        );

        result = getTargetsFromMetadataProviders(
          getClassMetadataMock,
          getClassMetadataPropertiesMock
        )(Type);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call getClassMetadataMock()", () => {
        expect(getClassMetadataMock).toHaveBeenCalledTimes(1);
        expect(getClassMetadataMock).toHaveBeenCalledWith(Type);
      });

      it("should call getBaseType", () => {
        expect(getBaseType).toHaveBeenCalledTimes(2);
        expect(getBaseType).toHaveBeenNthCalledWith(1, Type);
        expect(getBaseType).toHaveBeenNthCalledWith(2, BaseType);
      });

      it("should call getClassMetadataPropertiesMock()", () => {
        expect(getClassMetadataPropertiesMock).toHaveBeenCalledTimes(1);
        expect(getClassMetadataPropertiesMock).toHaveBeenCalledWith(BaseType);
      });

      it("should return LegacyTarget[]", () => {
        const expected: LegacyTarget[] = [
          new LegacyTargetImpl(
            "",
            constructorParamMetadata,
            "ConstructorArgument"
          ),
          new LegacyTargetImpl(
            existingProperty,
            existingPropertyMetadata,
            "ClassProperty"
          ),
          new LegacyTargetImpl(
            newProperty,
            newPropertyMetadata,
            "ClassProperty"
          ),
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
