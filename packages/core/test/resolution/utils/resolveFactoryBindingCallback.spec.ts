import { beforeAll, describe, expect, it, jest } from "@jest/globals";

import { bindingScopeValues } from "../../../src/binding/types/BindingScope";
import { bindingTypeValues } from "../../../src/binding/types/BindingType";
import { FactoryBinding } from "../../../src/binding/types/FactoryBinding";
import { ResolutionParams } from "../../../src/resolution/types/ResolutionParams";
import { resolveFactoryBindingCallback } from "../../../src/resolution/utils/resolveFactoryBindingCallback";

describe(resolveFactoryBindingCallback.name, () => {
  let resolutionParamsFixture: ResolutionParams;

  let factoryValueBindingMock: jest.Mocked<FactoryBinding<unknown>>;

  beforeAll(() => {
    resolutionParamsFixture = {
      context: Symbol() as unknown,
    } as Partial<ResolutionParams> as ResolutionParams;

    factoryValueBindingMock = {
      cache: {
        isRight: false,
        value: undefined,
      },
      factory: jest.fn(),
      id: 1,
      isSatisfiedBy: jest.fn(),
      moduleId: undefined,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: "service-id",
      type: bindingTypeValues.Factory,
    };
  });

  describe("when called", () => {
    let factoryFixture: () => unknown;

    let result: unknown;

    beforeAll(() => {
      factoryFixture = () => Symbol();

      factoryValueBindingMock.factory.mockReturnValueOnce(factoryFixture);

      result = resolveFactoryBindingCallback(
        resolutionParamsFixture,
        factoryValueBindingMock
      );
    });

    it("should call factoryValueBinding.factory()", () => {
      expect(factoryValueBindingMock.factory).toHaveBeenCalledTimes(1);
      expect(factoryValueBindingMock.factory).toHaveBeenCalledWith(
        resolutionParamsFixture.context
      );
    });

    it("should return expected result", () => {
      expect(result).toBe(factoryFixture);
    });
  });
});
