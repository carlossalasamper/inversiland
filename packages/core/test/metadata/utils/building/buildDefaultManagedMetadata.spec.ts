import { ServiceIdentifier } from "@inversiland/common";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { ManagedClassElementMetadata } from "../../../../src/metadata/types/ManagedClassElementMetadata";
import { buildDefaultManagedMetadata } from "../../../../src/metadata/utils/building/buildDefaultManagedMetadata";

describe(buildDefaultManagedMetadata.name, () => {
  let metadataKindFixture: ClassElementMetadataKind.singleInjection;
  let serviceIdentifierFixture: ServiceIdentifier;

  beforeAll(() => {
    metadataKindFixture = ClassElementMetadataKind.singleInjection;
    serviceIdentifierFixture = "service-id";
  });

  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      result = buildDefaultManagedMetadata(
        metadataKindFixture,
        serviceIdentifierFixture
      );
    });

    it("should return ManagedClassElementMetadata", () => {
      const expected: ManagedClassElementMetadata = {
        kind: metadataKindFixture,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: serviceIdentifierFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
