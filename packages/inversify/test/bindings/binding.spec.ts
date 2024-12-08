import { Binding } from "../../src/bindings/binding";
import {
  BindingScopeEnum,
  BindingTypeEnum,
} from "../../src/constants/literal_types";
import * as Stubs from "../utils/stubs";

describe("Binding", () => {
  it("Should set its own properties correctly", () => {
    const fooIdentifier = "FooInterface";
    const fooBinding: Binding<Stubs.FooInterface> =
      new Binding<Stubs.FooInterface>(
        fooIdentifier,
        BindingScopeEnum.Transient
      );

    expect(fooBinding.serviceIdentifier).toEqual(fooIdentifier);
    expect(fooBinding.implementationType).toBeNull();
    expect(fooBinding.state).toBeInstanceOf(Object);
    expect(fooBinding.state.cache).toBeNull();
    expect(fooBinding.state.activated).toBe(false);
    expect(fooBinding.dynamicValue).toBeNull();
    expect(fooBinding.factory).toBeNull();
    expect(fooBinding.provider).toBeNull();
    expect(fooBinding.onActivation).toBeNull();
    expect(fooBinding.onDeactivation).toBeNull();
    expect(fooBinding.container).toBeNull();
    expect(fooBinding.type).toBe(BindingTypeEnum.Invalid);
    expect(fooBinding.scope).toBe(BindingScopeEnum.Transient);
    expect(typeof fooBinding.id).toBe("number");
  });
});
