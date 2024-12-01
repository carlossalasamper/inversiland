import sinon from "sinon";

import { interfaces } from "../../src";
import { injectable } from "../../src/annotation/injectable";
import { Binding } from "../../src/bindings/binding";
import * as ERROR_MSGS from "../../src/constants/error_msgs";
import {
  BindingScopeEnum,
  BindingTypeEnum,
} from "../../src/constants/literal_types";
import { BindingToSyntax } from "../../src/syntax/binding_to_syntax";

describe("BindingToSyntax", () => {
  it("Should set its own properties correctly", () => {
    const ninjaIdentifier = "Ninja";

    const binding: Binding<unknown> = new Binding(
      ninjaIdentifier,
      BindingScopeEnum.Transient
    );

    const bindingToSyntax: BindingToSyntax<unknown> = new BindingToSyntax(
      binding
    );
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _bindingToSyntax: {
      _binding: interfaces.Binding<unknown>;
    } = bindingToSyntax as unknown as {
      _binding: interfaces.Binding<unknown>;
    };

    expect(_bindingToSyntax._binding.serviceIdentifier).toBe(ninjaIdentifier);
  });

  it("Should be able to configure the type of a binding", () => {
    @injectable()
    class Ninja {}
    const ninjaIdentifier = "Ninja";

    const binding: Binding<unknown> = new Binding(
      ninjaIdentifier,
      BindingScopeEnum.Transient
    );

    const bindingToSyntax: BindingToSyntax<unknown> = new BindingToSyntax(
      binding
    );

    expect(binding.type).toBe(BindingTypeEnum.Invalid);

    bindingToSyntax.to(Ninja);
    expect(binding.type).toBe(BindingTypeEnum.Instance);
    expect(binding.implementationType).not.toBeNull();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (bindingToSyntax as any)._binding = binding;
    bindingToSyntax.toConstantValue(new Ninja());
    expect(binding.type).toBe(BindingTypeEnum.ConstantValue);
    expect(binding.state.cache instanceof Ninja).toBe(true);

    bindingToSyntax.toDynamicValue(
      (_context: interfaces.Context) => new Ninja()
    );
    expect(binding.type).toBe(BindingTypeEnum.DynamicValue);
    expect(typeof binding.dynamicValue).toBe("function");

    const dynamicValueFactory: interfaces.DynamicValue<unknown> =
      binding.dynamicValue as interfaces.DynamicValue<unknown>;

    expect(
      dynamicValueFactory(null as unknown as interfaces.Context) instanceof
        Ninja
    ).toBe(true);

    bindingToSyntax.toConstructor<Ninja>(Ninja);
    expect(binding.type).toBe(BindingTypeEnum.Constructor);
    expect(binding.implementationType).not.toBeNull();

    bindingToSyntax.toFactory<Ninja>(
      (_context: interfaces.Context) => () => new Ninja()
    );

    expect(binding.type).toBe(BindingTypeEnum.Factory);
    expect(binding.factory).not.toBeNull();

    const f: () => string = () => "test";
    bindingToSyntax.toFunction(f);
    expect(binding.type).toBe(BindingTypeEnum.Function);
    expect(binding.state.cache === f).toBe(true);

    bindingToSyntax.toAutoFactory<Ninja>(ninjaIdentifier);

    expect(binding.type).toBe(BindingTypeEnum.Factory);
    expect(binding.factory).not.toBeNull();

    bindingToSyntax.toAutoNamedFactory<Ninja>(ninjaIdentifier);

    expect(binding.type).toBe(BindingTypeEnum.Factory);
    expect(binding.factory).not.toBeNull();

    const mockContext: interfaces.Context = {
      container: {
        getNamed: sinon.stub(),
      } as Partial<interfaces.Container> as interfaces.Container,
    } as Partial<interfaces.Context> as interfaces.Context;

    if (binding.factory !== null) {
      binding.factory(mockContext)(ninjaIdentifier);
      sinon.assert.calledOnce(mockContext.container.getNamed as sinon.SinonSpy);
    }

    bindingToSyntax.toProvider<Ninja>(
      (_context: interfaces.Context) => async () =>
        new Promise<Ninja>((resolve: (value: Ninja) => void) => {
          resolve(new Ninja());
        })
    );

    expect(binding.type).toBe(BindingTypeEnum.Provider);
    expect(binding.provider).not.toBeNull();
  });

  it("Should prevent invalid function bindings", () => {
    const ninjaIdentifier = "Ninja";

    const binding: Binding<unknown> = new Binding(
      ninjaIdentifier,
      BindingScopeEnum.Transient
    );
    const bindingToSyntax: BindingToSyntax<unknown> = new BindingToSyntax(
      binding
    );

    const f: () => void = function () {
      bindingToSyntax.toFunction(5);
    };

    expect(f).toThrow(ERROR_MSGS.INVALID_FUNCTION_BINDING);
  });
});
