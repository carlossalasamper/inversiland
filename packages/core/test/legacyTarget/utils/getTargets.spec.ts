import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("../../../src/legacyTarget/utils/getTargetsFromMetadataProviders");

import { LegacyTarget } from "../../../src/legacyTarget/types/LegacyTarget";
import { getTargets } from "../../../src/legacyTarget/utils/getTargets";
import { getTargetsFromMetadataProviders } from "../../../src/legacyTarget/utils/getTargetsFromMetadataProviders";
import { LegacyMetadataReader } from "../../../src/metadata/types/LegacyMetadataReader";
import { getClassMetadata } from "../../../src/metadata/utils/getters/getClassMetadata";
import { getClassMetadataProperties } from "../../../src/metadata/utils/getters/getClassMetadataProperties";

describe(getTargets.name, () => {
  describe("having no metadata reader", () => {
    describe("when called", () => {
      let targetsFixture: LegacyTarget[];

      let result: unknown;

      beforeAll(() => {
        targetsFixture = [];

        (
          getTargetsFromMetadataProviders as jest.Mock<
            typeof getTargetsFromMetadataProviders
          >
        ).mockReturnValueOnce(() => targetsFixture);

        result = getTargets()(class {});
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call getTargets()", () => {
        expect(getTargetsFromMetadataProviders).toHaveBeenCalledTimes(1);
        expect(getTargetsFromMetadataProviders).toHaveBeenCalledWith(
          getClassMetadata,
          getClassMetadataProperties
        );
      });

      it("should return LegacyTarget[]", () => {
        expect(result).toBe(targetsFixture);
      });
    });
  });

  describe("having metadata reader", () => {
    let metadataReaderFixture: LegacyMetadataReader;

    beforeAll(() => {
      metadataReaderFixture = Symbol() as unknown as LegacyMetadataReader;
    });

    describe("when called", () => {
      let targetsFixture: LegacyTarget[];

      let result: unknown;

      beforeAll(() => {
        targetsFixture = [];

        (
          getTargetsFromMetadataProviders as jest.Mock<
            typeof getTargetsFromMetadataProviders
          >
        ).mockReturnValueOnce(() => targetsFixture);

        result = getTargets(metadataReaderFixture)(class {});
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call getTargets()", () => {
        expect(getTargetsFromMetadataProviders).toHaveBeenCalledTimes(1);
        expect(getTargetsFromMetadataProviders).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function)
        );
      });

      it("should return LegacyTarget[]", () => {
        expect(result).toBe(targetsFixture);
      });
    });
  });
});
