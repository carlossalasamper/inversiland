import { Right } from "@inversiland/common";
import { beforeAll, describe, expect, it, jest } from "@jest/globals";

import { bindingScopeValues } from "../../../src/binding/types/BindingScope";
import {
  BindingType,
  bindingTypeValues,
} from "../../../src/binding/types/BindingType";
import { ScopedBinding } from "../../../src/binding/types/ScopedBinding";
import { ResolutionParams } from "../../../src/resolution/types/ResolutionParams";
import { resolveSingletonScopedBinding } from "../../../src/resolution/utils/resolveSingletonScopedBinding";

describe(resolveSingletonScopedBinding.name, () => {
  describe("having a binding with cache.isRight equals to true", () => {
    let resolutionParamsFixture: ResolutionParams;
    let bindingFixture: ScopedBinding<
      BindingType,
      typeof bindingScopeValues.Singleton,
      unknown
    >;

    let resolveMock: jest.Mock<
      (
        params: ResolutionParams,
        binding: ScopedBinding<
          BindingType,
          typeof bindingScopeValues.Singleton,
          unknown
        >
      ) => unknown
    >;

    beforeAll(() => {
      resolutionParamsFixture = Symbol() as unknown as ResolutionParams;
      bindingFixture = {
        cache: {
          isRight: true,
          value: Symbol(),
        },
        id: 1,
        isSatisfiedBy: () => true,
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: "service-id",
        type: bindingTypeValues.ConstantValue,
      };

      resolveMock = jest.fn();
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveSingletonScopedBinding(resolveMock)(
          resolutionParamsFixture,
          bindingFixture
        );
      });

      it("should return cached value", () => {
        expect(result).toBe((bindingFixture.cache as Right<unknown>).value);
      });
    });
  });

  describe("having a binding with cache.isRight equals to false", () => {
    let resolutionParamsFixture: ResolutionParams;
    let bindingFixture: ScopedBinding<
      BindingType,
      typeof bindingScopeValues.Singleton,
      unknown
    >;

    let resolveMock: jest.Mock<
      (
        params: ResolutionParams,
        binding: ScopedBinding<
          BindingType,
          typeof bindingScopeValues.Singleton,
          unknown
        >
      ) => unknown
    >;

    beforeAll(() => {
      resolutionParamsFixture = Symbol() as unknown as ResolutionParams;
      bindingFixture = {
        cache: {
          isRight: false,
          value: undefined,
        },
        id: 1,
        isSatisfiedBy: () => true,
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: "service-id",
        type: bindingTypeValues.ConstantValue,
      };

      resolveMock = jest.fn();
    });

    describe("when called", () => {
      let resolveResult: unknown;

      let result: unknown;

      beforeAll(() => {
        resolveResult = Symbol();

        resolveMock.mockReturnValueOnce(resolveResult);

        result = resolveSingletonScopedBinding(resolveMock)(
          resolutionParamsFixture,
          bindingFixture
        );
      });

      it("should call resolve()", () => {
        expect(resolveMock).toHaveBeenCalledTimes(1);
        expect(resolveMock).toHaveBeenCalledWith(
          resolutionParamsFixture,
          bindingFixture
        );
      });

      it("should cache value", () => {
        const expectedCache: Right<unknown> = {
          isRight: true,
          value: resolveResult,
        };

        expect(bindingFixture.cache).toStrictEqual(expectedCache);
      });

      it("should return cached value", () => {
        expect(result).toBe(resolveResult);
      });
    });
  });
});
