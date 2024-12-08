import { beforeAll, describe, expect, it } from "@jest/globals";

import { Binding } from "../../../src/binding/types/Binding";
import { bindingScopeValues } from "../../../src/binding/types/BindingScope";
import { bindingTypeValues } from "../../../src/binding/types/BindingType";
import { stringifyBinding } from "../../../src/binding/utils/stringifyBinding";

describe(stringifyBinding.name, () => {
  describe.each<[string, Binding<unknown>, string]>([
    [
      "with instance type",
      {
        cache: { isRight: false, value: undefined },
        id: 0,
        implementationType: class Foo {},
        isSatisfiedBy: () => true,
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: "service-id",
        type: bindingTypeValues.Instance,
      },
      `[ type: "${bindingTypeValues.Instance}", serviceIdentifier: "service-id", scope: "${bindingScopeValues.Singleton}", implementationType: "Foo" ]`,
    ],
    [
      "with service type",
      {
        id: 1,
        isSatisfiedBy: () => true,
        moduleId: undefined,
        serviceIdentifier: "service-id",
        targetServiceIdentifier: "target-service-id",
        type: bindingTypeValues.ServiceRedirection,
      },
      `[ type: "${bindingTypeValues.ServiceRedirection}", serviceIdentifier: "service-id", redirection: "target-service-id" ]`,
    ],
    [
      "with constant value type",
      {
        cache: { isRight: true, value: undefined },
        id: 0,
        isSatisfiedBy: () => true,
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: "service-id",
        type: bindingTypeValues.ConstantValue,
      },
      `[ type: "${bindingTypeValues.ConstantValue}", serviceIdentifier: "service-id", scope: "${bindingScopeValues.Singleton}" ]`,
    ],
  ])(
    "having a binding %s",
    (_: string, binding: Binding<unknown>, expected: string) => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = stringifyBinding(binding);
        });

        it("should return expected result", () => {
          expect(result).toBe(expected);
        });
      });
    }
  );
});
