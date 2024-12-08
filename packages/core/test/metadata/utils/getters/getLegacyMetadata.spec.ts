import { beforeAll, describe, expect, it } from "@jest/globals";

import { ClassElementMetadataKind } from "../../../../src/metadata/types/ClassElementMetadataKind";
import { LegacyMetadata } from "../../../../src/metadata/types/LegacyMetadata";
import { ManagedClassElementMetadata } from "../../../../src/metadata/types/ManagedClassElementMetadata";
import { MetadataTag } from "../../../../src/metadata/types/MetadataTag";
import { UnmanagedClassElementMetadata } from "../../../../src/metadata/types/UnmanagedClassElementMetadata";
import { getLegacyMetadata } from "../../../../src/metadata/utils/getters/getLegacyMetadata";
import {
  INJECT_TAG,
  MULTI_INJECT_TAG,
  NAME_TAG,
  NAMED_TAG,
  OPTIONAL_TAG,
  UNMANAGED_TAG,
} from "../../../../src/metadata/utils/metadataKeys";

describe(getLegacyMetadata.name, () => {
  describe("having unmanaged class element metadata", () => {
    let unmanagedClassElementMetadataFixture: UnmanagedClassElementMetadata;

    beforeAll(() => {
      unmanagedClassElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = getLegacyMetadata(unmanagedClassElementMetadataFixture);
      });

      it("should return expected legacy metadata", () => {
        const expectedLegacyMetadataList: LegacyMetadata[] = [
          {
            key: UNMANAGED_TAG,
            value: true,
          },
        ];

        expect(result).toHaveLength(expectedLegacyMetadataList.length);
        expect(result).toStrictEqual(
          expect.arrayContaining(expectedLegacyMetadataList)
        );
      });
    });
  });

  describe("having optional managed class element metadata with name, tags and target name", () => {
    let customTagKeyFixture: MetadataTag;
    let customTagValueFixture: unknown;

    let managedClassElementMetadataFixture: ManagedClassElementMetadata;

    beforeAll(() => {
      customTagKeyFixture = "custom-tag-key-fixture";
      customTagValueFixture = "custom-tag-value-fixture";

      managedClassElementMetadataFixture = {
        kind: ClassElementMetadataKind.multipleInjection,
        name: "name-fixture",
        optional: true,
        tags: new Map([[customTagKeyFixture, customTagValueFixture]]),
        targetName: "target-name-fixture",
        value: "service-id-fixture",
      };
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = getLegacyMetadata(managedClassElementMetadataFixture);
      });

      it("should return expected legacy metadata", () => {
        const expectedLegacyMetadataList: LegacyMetadata[] = [
          {
            key: MULTI_INJECT_TAG,
            value: managedClassElementMetadataFixture.value,
          },
          {
            key: NAMED_TAG,
            value: managedClassElementMetadataFixture.name,
          },
          {
            key: OPTIONAL_TAG,
            value: true,
          },
          {
            key: customTagKeyFixture,
            value: customTagValueFixture,
          },
          {
            key: NAME_TAG,
            value: managedClassElementMetadataFixture.targetName,
          },
        ];

        expect(result).toHaveLength(expectedLegacyMetadataList.length);
        expect(result).toStrictEqual(
          expect.arrayContaining(expectedLegacyMetadataList)
        );
      });
    });
  });

  describe("having single injection class element metadata with no name, tags nor target name", () => {
    let managedClassElementMetadataFixture: ManagedClassElementMetadata;

    beforeAll(() => {
      managedClassElementMetadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: "service-id-fixture",
      };
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = getLegacyMetadata(managedClassElementMetadataFixture);
      });

      it("should return expected legacy metadata", () => {
        const expectedLegacyMetadataList: LegacyMetadata[] = [
          {
            key: INJECT_TAG,
            value: managedClassElementMetadataFixture.value,
          },
        ];

        expect(result).toHaveLength(expectedLegacyMetadataList.length);
        expect(result).toStrictEqual(
          expect.arrayContaining(expectedLegacyMetadataList)
        );
      });
    });
  });

  describe("having multiple injection class element metadata with no name, tags nor target name", () => {
    let managedClassElementMetadataFixture: ManagedClassElementMetadata;

    beforeAll(() => {
      managedClassElementMetadataFixture = {
        kind: ClassElementMetadataKind.multipleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: "service-id-fixture",
      };
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = getLegacyMetadata(managedClassElementMetadataFixture);
      });

      it("should return expected legacy metadata", () => {
        const expectedLegacyMetadataList: LegacyMetadata[] = [
          {
            key: MULTI_INJECT_TAG,
            value: managedClassElementMetadataFixture.value,
          },
        ];

        expect(result).toHaveLength(expectedLegacyMetadataList.length);
        expect(result).toStrictEqual(
          expect.arrayContaining(expectedLegacyMetadataList)
        );
      });
    });
  });
});
