import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("../../../src/metadata/utils/getters/getLegacyMetadata");
jest.mock("../../../src/legacyTarget/utils/getTargetId");

import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";

import { LegacyTargetImpl } from "../../../src/legacyTarget/models/LegacyTargetImpl";
import { LegacyTargetType } from "../../../src/legacyTarget/types/LegacyTargetType";
import { getTargetId } from "../../../src/legacyTarget/utils/getTargetId";
import { ClassElementMetadataKind } from "../../../src/metadata/types/ClassElementMetadataKind";
import { LegacyMetadata } from "../../../src/metadata/types/LegacyMetadata";
import { ManagedClassElementMetadata } from "../../../src/metadata/types/ManagedClassElementMetadata";
import { MetadataName } from "../../../src/metadata/types/MetadataName";
import { MetadataTag } from "../../../src/metadata/types/MetadataTag";
import { getLegacyMetadata } from "../../../src/metadata/utils/getters/getLegacyMetadata";
import { NAMED_TAG } from "../../../src/metadata/utils/metadataKeys";
import { LegacyQueryableStringImpl } from "../../../src/string/models/LegacyQueryableStringImpl";

describe(LegacyTargetImpl.name, () => {
  let idFixture: number;

  let identifierFixture: string | symbol;

  let customTagKeyFixture: MetadataTag;
  let customTagValueFixture: unknown;

  let legacyMetadataListFixture: LegacyMetadata[];

  let managedClassElementMetadataFixture: ManagedClassElementMetadata;

  let legacyTargetTypeFixture: LegacyTargetType;

  let legacyTargetImpl: LegacyTargetImpl;

  beforeAll(() => {
    idFixture = 12;

    identifierFixture = "identifier-fixture";

    customTagKeyFixture = "custom-tag-key-fixture";
    customTagValueFixture = "custom-tag-value-fixture";

    legacyMetadataListFixture = [
      {
        key: customTagKeyFixture,
        value: customTagValueFixture,
      },
    ];

    managedClassElementMetadataFixture = {
      kind: ClassElementMetadataKind.multipleInjection,
      name: "name-fixture",
      optional: true,
      tags: new Map([[customTagKeyFixture, customTagValueFixture]]),
      targetName: "target-name-fixture",
      value: "service-id-fixture",
    };

    legacyTargetTypeFixture = "ClassProperty";

    (getTargetId as jest.Mock<typeof getTargetId>).mockReturnValue(idFixture);

    (getLegacyMetadata as jest.Mock<typeof getLegacyMetadata>).mockReturnValue(
      legacyMetadataListFixture
    );

    legacyTargetImpl = new LegacyTargetImpl(
      identifierFixture,
      managedClassElementMetadataFixture,
      legacyTargetTypeFixture
    );
  });

  describe(".id", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyTargetImpl.id;
      });

      it("should return target id", () => {
        expect(result).toBe(idFixture);
      });
    });
  });

  describe(".identifier", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyTargetImpl.identifier;
      });

      it("should return target identifier", () => {
        expect(result).toBe(identifierFixture);
      });
    });
  });

  describe(".metadata", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyTargetImpl.metadata;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call getLegacyMetadata", () => {
        expect(getLegacyMetadata).toHaveBeenCalledTimes(1);
        expect(getLegacyMetadata).toHaveBeenCalledWith(
          managedClassElementMetadataFixture
        );
      });

      it("should return target metadata", () => {
        expect(result).toBe(legacyMetadataListFixture);
      });
    });
  });

  describe(".name", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyTargetImpl.name;
      });

      it("should return target name", () => {
        expect(result).toStrictEqual(
          new LegacyQueryableStringImpl(identifierFixture as string)
        );
      });
    });
  });

  describe(".type", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyTargetImpl.type;
      });

      it("should return target type", () => {
        expect(result).toBe(legacyTargetTypeFixture);
      });
    });
  });

  describe(".serviceIdentifier", () => {
    describe("having a LegacyTargetImpl with class element metadata with serviceIdentifier", () => {
      let serviceIdentifierFixture: ServiceIdentifier;
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        serviceIdentifierFixture = "service-id-fixture";
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: "name-fixture",
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: serviceIdentifierFixture,
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.serviceIdentifier;
        });

        it("should return service identifier", () => {
          expect(result).toBe(serviceIdentifierFixture);
        });
      });
    });

    describe("having a LegacyTargetImpl with class element metadata with lazy service identifier", () => {
      let serviceIdentifierFixture: ServiceIdentifier;
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        serviceIdentifierFixture = "service-id-fixture";
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: new LazyServiceIdentifier(() => serviceIdentifierFixture),
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.serviceIdentifier;
        });

        it("should return null", () => {
          expect(result).toBe(serviceIdentifierFixture);
        });
      });
    });
  });

  describe(".getCustomTags", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyTargetImpl.getCustomTags();
      });

      it("should return target custom tags", () => {
        const expectedCustomTags: LegacyMetadata[] = [
          {
            key: customTagKeyFixture,
            value: customTagValueFixture,
          },
        ];

        expect(result).toStrictEqual(expectedCustomTags);
      });
    });
  });

  describe(".getNamedTag", () => {
    describe("having a LegacyTargetImpl with class element metadata with name", () => {
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: "name-fixture",
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.getNamedTag();
        });

        it("should return metadata name", () => {
          const expectedLegacyMetadata: LegacyMetadata = {
            key: NAMED_TAG,
            value: managedClassElementMetadataFixture.name,
          };

          expect(result).toStrictEqual(expectedLegacyMetadata);
        });
      });
    });

    describe("having a LegacyTargetImpl with class element metadata with no name", () => {
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.getNamedTag();
        });

        it("should return null", () => {
          expect(result).toBeNull();
        });
      });
    });
  });

  describe(".hasTag", () => {
    describe("having an existing tag", () => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.hasTag(customTagKeyFixture);
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });

    describe("having a non existing tag", () => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.hasTag(Symbol());
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });
  });

  describe(".isArray", () => {
    describe("having a LegacyTargetImpl with class element metadata with multiple injection", () => {
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.isArray();
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });

    describe("having a LegacyTargetImpl with class element metadata with single injection", () => {
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.singleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.isArray();
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });
  });

  describe(".isNamed", () => {
    describe("having a LegacyTargetImpl with class element metadata with name", () => {
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: "name-fixture",
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.isNamed();
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });

    describe("having a LegacyTargetImpl with class element metadata with no name", () => {
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.isNamed();
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });
  });

  describe(".isOptional", () => {
    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = legacyTargetImpl.isOptional();
      });

      it("should return metadata optional property", () => {
        expect(result).toStrictEqual(
          managedClassElementMetadataFixture.optional
        );
      });
    });
  });

  describe(".isTaged", () => {
    describe("having a LegacyTargetImpl with class element metadata with tags", () => {
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: "name-fixture",
            optional: false,
            tags: new Map([[customTagKeyFixture, customTagValueFixture]]),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.isTagged();
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });

    describe("having a LegacyTargetImpl with class element metadata with no tags", () => {
      let legacyTargetImpl: LegacyTargetImpl;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.isTagged();
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });
  });

  describe(".matchesArray", () => {
    describe("having a LegacyTargetImpl with class element metadata with multiple injection and matching service identifier", () => {
      let legacyTargetImpl: LegacyTargetImpl;
      let serviceIdentifierFixture: ServiceIdentifier;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );

        serviceIdentifierFixture = "service-id-fixture";
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.matchesArray(serviceIdentifierFixture);
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });

    describe("having a LegacyTargetImpl with class element metadata with multiple injection and a not matching service identifier", () => {
      let legacyTargetImpl: LegacyTargetImpl;
      let serviceIdentifierFixture: ServiceIdentifier;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );

        serviceIdentifierFixture = "not-matching-service-id-fixture";
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.matchesArray(serviceIdentifierFixture);
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });

    describe("having a LegacyTargetImpl with class element metadata with single injection", () => {
      let legacyTargetImpl: LegacyTargetImpl;
      let serviceIdentifierFixture: ServiceIdentifier;

      beforeAll(() => {
        const identifierFixture: string | symbol = "identifier-fixture";

        const managedClassElementMetadataFixture: ManagedClassElementMetadata =
          {
            kind: ClassElementMetadataKind.singleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: "service-id-fixture",
          };

        const legacyTargetTypeFixture: LegacyTargetType = "ClassProperty";

        legacyTargetImpl = new LegacyTargetImpl(
          identifierFixture,
          managedClassElementMetadataFixture,
          legacyTargetTypeFixture
        );

        serviceIdentifierFixture = "service-id-fixture";
      });

      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.matchesArray(serviceIdentifierFixture);
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });
  });

  describe(".matchesNamedTag", () => {
    describe("having a matching name", () => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.matchesNamedTag(
            managedClassElementMetadataFixture.name as MetadataName
          );
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });

    describe("having a non matching name", () => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.matchesNamedTag(Symbol());
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });
  });

  describe(".matchesTag", () => {
    describe("having a matching key and a matching value", () => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.matchesTag(customTagKeyFixture)(
            customTagValueFixture
          );
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });
    });

    describe("having a non matching key and a matching value", () => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.matchesTag(Symbol())(customTagValueFixture);
        });

        it("should return true", () => {
          expect(result).toBe(false);
        });
      });
    });

    describe("having a matching key and a non matching value", () => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.matchesTag(customTagKeyFixture)(Symbol());
        });

        it("should return true", () => {
          expect(result).toBe(false);
        });
      });
    });

    describe("having a non matching key and a non matching value", () => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = legacyTargetImpl.matchesTag(Symbol())(Symbol());
        });

        it("should return true", () => {
          expect(result).toBe(false);
        });
      });
    });
  });
});
