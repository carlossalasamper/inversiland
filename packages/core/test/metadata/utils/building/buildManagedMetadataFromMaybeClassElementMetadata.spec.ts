import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";
import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock(
  "../../../../src/metadata/utils/building/buildClassElementMetadataFromMaybeClassElementMetadata",
  () => ({
    buildClassElementMetadataFromMaybeClassElementMetadata: jest
      .fn()
      .mockReturnValue(jest.fn()),
  })
);

import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { MaybeClassElementMetadata } from "../../../../src/metadata/types/MaybeClassElementMetadata";
import { buildManagedMetadataFromMaybeClassElementMetadata } from "../../../../src/metadata/utils/building/buildManagedMetadataFromMaybeClassElementMetadata";

describe(buildManagedMetadataFromMaybeClassElementMetadata.name, () => {
  let kindFixture:
    | ClassElementMetadataKind.multipleInjection
    | ClassElementMetadataKind.singleInjection;
  let serviceIdentifierFixture: ServiceIdentifier | LazyServiceIdentifier;

  beforeAll(() => {
    kindFixture = ClassElementMetadataKind.multipleInjection;
    serviceIdentifierFixture = "service-id";
  });

  describe("when called", () => {
    let buildClassMetadataMock: jest.Mock<
      (metadata: MaybeClassElementMetadata | undefined) => ClassElementMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      buildClassMetadataMock = jest.fn();

      (
        buildManagedMetadataFromMaybeClassElementMetadata as jest.Mock<
          typeof buildManagedMetadataFromMaybeClassElementMetadata
        >
      ).mockReturnValueOnce(buildClassMetadataMock);

      result = buildManagedMetadataFromMaybeClassElementMetadata(
        kindFixture,
        serviceIdentifierFixture
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should return expected function", () => {
      expect(result).toBe(buildClassMetadataMock);
    });
  });
});
