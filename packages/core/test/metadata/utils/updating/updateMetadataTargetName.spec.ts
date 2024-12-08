import { beforeAll, describe, expect, it } from "@jest/globals";

import { InversifyCoreError } from "../../../../src/error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../../src/error/types/InversifyCoreErrorKind";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { ManagedClassElementMetadata } from "../../../../src/metadata/types/ManagedClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../../../../src/metadata/types/MaybeManagedClassElementMetadata";
import { MetadataTargetName } from "../../../../src/metadata/types/MetadataTargetName";
import { updateMetadataTargetName } from "../../../../src/metadata/utils/updating/updateMetadataTargetName";

describe(updateMetadataTargetName.name, () => {
  describe("having metadata with no target name", () => {
    let metadataFixture:
      | ManagedClassElementMetadata
      | MaybeManagedClassElementMetadata;
    let targetNameFixture: MetadataTargetName;

    beforeAll(() => {
      metadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: "service-id",
      };
      targetNameFixture = "target-name-fixture";
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = updateMetadataTargetName(targetNameFixture)(metadataFixture);
      });

      it("should return metadata", () => {
        const expected:
          | ManagedClassElementMetadata
          | MaybeManagedClassElementMetadata = {
          ...metadataFixture,
          targetName: targetNameFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe("having metadata with target name", () => {
    let metadataFixture:
      | ManagedClassElementMetadata
      | MaybeManagedClassElementMetadata;
    let targetNameFixture: MetadataTargetName;

    beforeAll(() => {
      metadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: "target-name-fixture",
        value: "service-id",
      };
      targetNameFixture = "target-name-fixture";
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        try {
          updateMetadataTargetName(targetNameFixture)(metadataFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it("should throw InversifyCoreError", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.injectionDecoratorConflict,
          message: "Unexpected duplicated targetName decorator",
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });
});
