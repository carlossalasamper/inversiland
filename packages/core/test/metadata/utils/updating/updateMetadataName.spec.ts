import { beforeAll, describe, expect, it } from "@jest/globals";

import { InversifyCoreError } from "../../../../src/error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../../src/error/types/InversifyCoreErrorKind";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { ManagedClassElementMetadata } from "../../../../src/metadata/types/ManagedClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../../../../src/metadata/types/MaybeManagedClassElementMetadata";
import { MetadataName } from "../../../../src/metadata/types/MetadataName";
import { updateMetadataName } from "../../../../src/metadata/utils/updating/updateMetadataName";

describe(updateMetadataName.name, () => {
  describe("having metadata with no name", () => {
    let metadataFixture:
      | ManagedClassElementMetadata
      | MaybeManagedClassElementMetadata;
    let nameFixture: MetadataName;

    beforeAll(() => {
      metadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: "service-id",
      };
      nameFixture = "name-fixture";
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = updateMetadataName(nameFixture)(metadataFixture);
      });

      it("should return metadata", () => {
        const expected:
          | ManagedClassElementMetadata
          | MaybeManagedClassElementMetadata = {
          ...metadataFixture,
          name: nameFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe("having metadata with name", () => {
    let metadataFixture:
      | ManagedClassElementMetadata
      | MaybeManagedClassElementMetadata;
    let nameFixture: MetadataName;

    beforeAll(() => {
      metadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: "name-fixture",
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: "service-id",
      };
      nameFixture = "name-fixture";
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        try {
          updateMetadataName(nameFixture)(metadataFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it("should throw InversifyCoreError", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.injectionDecoratorConflict,
          message: "Unexpected duplicated named decorator",
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });
});
