import { beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("../../../../src/decorator/utils/getDecoratorInfo");
jest.mock("../../../../src/decorator/utils/stringifyDecoratorInfo");

import { DecoratorInfo } from "../../../../src/decorator/types/DecoratorInfo";
import { DecoratorInfoKind } from "../../../../src/decorator/types/DecoratorInfoKind";
import { getDecoratorInfo } from "../../../../src/decorator/utils/getDecoratorInfo";
import { stringifyDecoratorInfo } from "../../../../src/decorator/utils/stringifyDecoratorInfo";
import { InversifyCoreError } from "../../../../src/error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../../src/error/types/InversifyCoreErrorKind";
import { handleInjectionError } from "../../../../src/metadata/utils/errors/handleInjectionError";

describe(handleInjectionError.name, () => {
  describe("having an InversifyCoreError of kind injectionDecoratorConflict", () => {
    let targetFixture: object;
    let propertyKeyFixture: string | symbol | undefined;
    let parameterIndexFixture: number | undefined;
    let errorFixture: InversifyCoreError;

    beforeAll(() => {
      targetFixture = class {};
      propertyKeyFixture = undefined;
      parameterIndexFixture = 0;
      errorFixture = new InversifyCoreError(
        InversifyCoreErrorKind.injectionDecoratorConflict,
        "error message fixture"
      );
    });

    describe("when called", () => {
      let decoratorInfoFixture: DecoratorInfo;
      let decoratorInfoStringifiedFixture: string;

      let result: unknown;

      beforeAll(() => {
        decoratorInfoFixture = {
          index: 0,
          kind: DecoratorInfoKind.parameter,
          targetClass: class {},
        };

        decoratorInfoStringifiedFixture = "decorator-info-stringified-fixture";

        (
          getDecoratorInfo as jest.Mock<typeof getDecoratorInfo>
        ).mockReturnValueOnce(decoratorInfoFixture);

        (
          stringifyDecoratorInfo as jest.Mock<typeof stringifyDecoratorInfo>
        ).mockReturnValueOnce(decoratorInfoStringifiedFixture);

        try {
          handleInjectionError(
            targetFixture,
            propertyKeyFixture,
            parameterIndexFixture,
            errorFixture
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      it("should call getDecoratorInfo()", () => {
        expect(getDecoratorInfo).toHaveBeenCalledTimes(1);
        expect(getDecoratorInfo).toHaveBeenCalledWith(
          targetFixture,
          propertyKeyFixture,
          parameterIndexFixture
        );
      });

      it("should call stringifyDecoratorInfo()", () => {
        expect(stringifyDecoratorInfo).toHaveBeenCalledTimes(1);
        expect(stringifyDecoratorInfo).toHaveBeenCalledWith(
          decoratorInfoFixture
        );
      });

      it("should throw an InversifyCoreError", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          cause: errorFixture,
          kind: InversifyCoreErrorKind.injectionDecoratorConflict,
          message: `Unexpected injection error.

Cause:

${errorFixture.message}

Details

${decoratorInfoStringifiedFixture}`,
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });

  describe("having a non InversifyCoreError", () => {
    let targetFixture: object;
    let propertyKeyFixture: string | symbol | undefined;
    let parameterIndexFixture: number | undefined;
    let errorFixture: Error;

    beforeAll(() => {
      targetFixture = class {};
      propertyKeyFixture = undefined;
      parameterIndexFixture = 0;
      errorFixture = new Error("error message fixture");
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        try {
          handleInjectionError(
            targetFixture,
            propertyKeyFixture,
            parameterIndexFixture,
            errorFixture
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      it("should throw an Error", () => {
        expect(result).toBe(errorFixture);
      });
    });
  });
});
