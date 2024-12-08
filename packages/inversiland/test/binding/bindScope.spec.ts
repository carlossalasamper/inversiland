import { Container } from "@inversiland/inversify";

import { Inversiland } from "../../src";
import bindScope from "../../src/binding/bindScope";

class ClassA {}

describe("bindScope", () => {
  const container = new Container();

  beforeEach(() => {
    Inversiland.reset();
    container?.unbindAll();
  });

  it("Should call binding.inTransientScope() when scope is Transient.", () => {
    const binding = container.bind(ClassA).toSelf();
    const inTransientScope = jest.spyOn(binding, "inTransientScope");

    bindScope(binding, "Transient");

    expect(inTransientScope).toHaveBeenCalled();
  });

  it("Should call binding.inRequestScope() when scope is Request.", () => {
    const binding = container.bind(ClassA).toSelf();
    const inRequestScope = jest.spyOn(binding, "inRequestScope");

    bindScope(binding, "Request");

    expect(inRequestScope).toHaveBeenCalled();
  });

  it("Should call binding.inSingletonScope() when scope is Singleton.", () => {
    const binding = container.bind(ClassA).toSelf();
    const inSingletonScope = jest.spyOn(binding, "inSingletonScope");

    bindScope(binding, "Singleton");

    expect(inSingletonScope).toHaveBeenCalled();
  });
});
