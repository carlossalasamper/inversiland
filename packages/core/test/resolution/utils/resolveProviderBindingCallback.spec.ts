import { beforeAll, describe, expect, it, jest } from "@jest/globals";

import { bindingScopeValues } from "../../../src/binding/types/BindingScope";
import { bindingTypeValues } from "../../../src/binding/types/BindingType";
import { Provider } from "../../../src/binding/types/Provider";
import { ProviderBinding } from "../../../src/binding/types/ProviderBinding";
import { ResolutionParams } from "../../../src/resolution/types/ResolutionParams";
import { resolveProviderBindingCallback } from "../../../src/resolution/utils/resolveProviderBindingCallback";

describe(resolveProviderBindingCallback.name, () => {
  let resolutionParamsFixture: ResolutionParams;

  let providerBindingMock: jest.Mocked<ProviderBinding<unknown>>;

  beforeAll(() => {
    resolutionParamsFixture = {
      context: Symbol() as unknown,
    } as Partial<ResolutionParams> as ResolutionParams;

    providerBindingMock = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: 1,
      isSatisfiedBy: jest.fn(),
      moduleId: undefined,
      onActivation: undefined,
      onDeactivation: undefined,
      provider: jest.fn(),
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: "service-id",
      type: bindingTypeValues.Provider,
    };
  });

  describe("when called", () => {
    let providerFixture: Provider<unknown>;

    let result: unknown;

    beforeAll(() => {
      providerFixture = async () => undefined;

      providerBindingMock.provider.mockReturnValueOnce(providerFixture);

      result = resolveProviderBindingCallback(
        resolutionParamsFixture,
        providerBindingMock
      );
    });

    it("should call binding.provider()", () => {
      expect(providerBindingMock.provider).toHaveBeenCalledTimes(1);
      expect(providerBindingMock.provider).toHaveBeenCalledWith(
        resolutionParamsFixture.context
      );
    });

    it("should return expected result", () => {
      expect(result).toBe(providerFixture);
    });
  });
});
