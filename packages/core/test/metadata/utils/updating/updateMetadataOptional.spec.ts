import { beforeAll, describe, expect, it } from "@jest/globals";

import { InversifyCoreError } from "../../../../src/error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../../src/error/types/InversifyCoreErrorKind";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { ManagedClassElementMetadata } from "../../../../src/metadata/types/ManagedClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../../../../src/metadata/types/MaybeManagedClassElementMetadata";
import { updateMetadataOptional } from "../../../../src/metadata/utils/updating/updateMetadataOptional";

describe(updateMetadataOptional.name, () => {
  describe("having metadata with no optional", () => {
    let metadataFixture:
      | ManagedClassElementMetadata
      | MaybeManagedClassElementMetadata;

    beforeAll(() => {
      metadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: "service-id",
      };
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = updateMetadataOptional(metadataFixture);
      });

      it("should return metadata", () => {
        const expected:
          | ManagedClassElementMetadata
          | MaybeManagedClassElementMetadata = {
          ...metadataFixture,
          optional: true,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe("having metadata with optional", () => {
    let metadataFixture:
      | ManagedClassElementMetadata
      | MaybeManagedClassElementMetadata;

    beforeAll(() => {
      metadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: true,
        tags: new Map(),
        targetName: undefined,
        value: "service-id",
      };
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        try {
          updateMetadataOptional(metadataFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it("should throw InversifyCoreError", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.injectionDecoratorConflict,
          message: "Unexpected duplicated optional decorator",
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });
});
