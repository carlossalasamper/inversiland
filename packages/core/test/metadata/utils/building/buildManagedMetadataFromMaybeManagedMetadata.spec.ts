import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { ManagedClassElementMetadata } from "../../../../src/metadata/types/ManagedClassElementMetadata";
import { MaybeClassElementMetadataKind } from "../../../../src/metadata/types/MaybeClassElementMetadataKind";
import { MaybeManagedClassElementMetadata } from "../../../../src/metadata/types/MaybeManagedClassElementMetadata";
import { buildManagedMetadataFromMaybeManagedMetadata } from "../../../../src/metadata/utils/building/buildManagedMetadataFromMaybeManagedMetadata";

describe(buildManagedMetadataFromMaybeManagedMetadata.name, () => {
  describe("when called", () => {
    let metadataFixture: MaybeManagedClassElementMetadata;
    let kindFixture:
      | ClassElementMetadataKind.singleInjection
      | ClassElementMetadataKind.multipleInjection;
    let serviceIdentifierFixture: ServiceIdentifier | LazyServiceIdentifier;

    let result: unknown;

    beforeAll(() => {
      metadataFixture = {
        kind: MaybeClassElementMetadataKind.unknown,
        name: "name-fixture",
        optional: true,
        tags: new Map(),
        targetName: "target-name-fixture",
      };

      kindFixture = ClassElementMetadataKind.singleInjection;
      serviceIdentifierFixture = Symbol();

      result = buildManagedMetadataFromMaybeManagedMetadata(
        metadataFixture,
        kindFixture,
        serviceIdentifierFixture
      );
    });

    it("should return ManagedClassElementMetadata", () => {
      const expected: ManagedClassElementMetadata = {
        kind: kindFixture,
        name: metadataFixture.name,
        optional: metadataFixture.optional,
        tags: metadataFixture.tags,
        targetName: metadataFixture.targetName,
        value: serviceIdentifierFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
