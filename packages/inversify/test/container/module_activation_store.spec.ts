import { interfaces } from "../../src";
import { ModuleActivationStore } from "../../src/container/module_activation_store";

describe("ModuleActivationStore", () => {
  it("should remove handlers added by the module", () => {
    const moduleActivationStore: ModuleActivationStore =
      new ModuleActivationStore();

    const moduleId1 = 1;
    const moduleId2 = 2;
    const serviceIdentifier1 = "some-service-1";
    const serviceIdentifier2 = "some-service-2";

    const onActivation1: interfaces.BindingActivation<unknown> = (
      _c: interfaces.Context,
      a: unknown
    ) => a;
    const onActivation2: interfaces.BindingActivation<unknown> = (
      _c: interfaces.Context,
      a: unknown
    ) => a;
    const onActivation3: interfaces.BindingActivation<unknown> = (
      _c: interfaces.Context,
      a: unknown
    ) => a;
    const onDeactivation1: interfaces.BindingDeactivation<unknown> = async (
      _d: unknown
    ) => Promise.resolve();
    const onDeactivation2: interfaces.BindingDeactivation<unknown> = async (
      _d: unknown
    ) => Promise.resolve();
    const onDeactivation3: interfaces.BindingDeactivation<unknown> = async (
      _d: unknown
    ) => Promise.resolve();

    moduleActivationStore.addActivation(
      moduleId1,
      serviceIdentifier1,
      onActivation1
    );
    moduleActivationStore.addActivation(
      moduleId1,
      serviceIdentifier1,
      onActivation2
    );
    moduleActivationStore.addActivation(
      moduleId1,
      serviceIdentifier2,
      onActivation3
    );
    moduleActivationStore.addDeactivation(
      moduleId1,
      serviceIdentifier1,
      onDeactivation1
    );
    moduleActivationStore.addDeactivation(
      moduleId1,
      serviceIdentifier1,
      onDeactivation2
    );
    moduleActivationStore.addDeactivation(
      moduleId1,
      serviceIdentifier2,
      onDeactivation3
    );

    const onActivationMod2: interfaces.BindingActivation<unknown> = (
      _c: interfaces.Context,
      a: unknown
    ) => a;
    const onDeactivationMod2: interfaces.BindingDeactivation<unknown> = async (
      _d: unknown
    ) => Promise.resolve();
    moduleActivationStore.addActivation(
      moduleId2,
      serviceIdentifier1,
      onActivationMod2
    );
    moduleActivationStore.addDeactivation(
      moduleId2,
      serviceIdentifier1,
      onDeactivationMod2
    );

    const handlers: interfaces.ModuleActivationHandlers =
      moduleActivationStore.remove(moduleId1);
    expect(handlers.onActivations.getMap()).toEqual(
      new Map([
        [serviceIdentifier1, [onActivation1, onActivation2]],
        [serviceIdentifier2, [onActivation3]],
      ])
    );
    expect(handlers.onDeactivations.getMap()).toEqual(
      new Map([
        [serviceIdentifier1, [onDeactivation1, onDeactivation2]],
        [serviceIdentifier2, [onDeactivation3]],
      ])
    );

    const noHandlers: interfaces.ModuleActivationHandlers =
      moduleActivationStore.remove(moduleId1);
    expect(noHandlers.onActivations.getMap()).toEqual(new Map());
    expect(noHandlers.onDeactivations.getMap()).toEqual(new Map());

    const module2Handlers: interfaces.ModuleActivationHandlers =
      moduleActivationStore.remove(moduleId2);
    expect(module2Handlers.onActivations.getMap()).toEqual(
      new Map([[serviceIdentifier1, [onActivationMod2]]])
    );
    expect(module2Handlers.onDeactivations.getMap()).toEqual(
      new Map([[serviceIdentifier1, [onDeactivationMod2]]])
    );
  });

  it("should be able to clone", () => {
    const moduleActivationStore: ModuleActivationStore =
      new ModuleActivationStore();

    const moduleId1 = 1;
    const moduleId2 = 2;
    const serviceIdentifier1 = "some-service-1";
    const serviceIdentifier2 = "some-service-2";

    const onActivation1: interfaces.BindingActivation<unknown> = (
      _c: interfaces.Context,
      a: unknown
    ) => a;
    const onActivation2: interfaces.BindingActivation<unknown> = (
      _c: interfaces.Context,
      a: unknown
    ) => a;
    const onActivation3: interfaces.BindingActivation<unknown> = (
      _c: interfaces.Context,
      a: unknown
    ) => a;
    const onDeactivation1: interfaces.BindingDeactivation<unknown> = async (
      _d: unknown
    ) => Promise.resolve();
    const onDeactivation2: interfaces.BindingDeactivation<unknown> = async (
      _d: unknown
    ) => Promise.resolve();
    const onDeactivation3: interfaces.BindingDeactivation<unknown> = async (
      _d: unknown
    ) => Promise.resolve();

    moduleActivationStore.addActivation(
      moduleId1,
      serviceIdentifier1,
      onActivation1
    );
    moduleActivationStore.addActivation(
      moduleId1,
      serviceIdentifier1,
      onActivation2
    );
    moduleActivationStore.addActivation(
      moduleId1,
      serviceIdentifier2,
      onActivation3
    );
    moduleActivationStore.addDeactivation(
      moduleId1,
      serviceIdentifier1,
      onDeactivation1
    );
    moduleActivationStore.addDeactivation(
      moduleId1,
      serviceIdentifier1,
      onDeactivation2
    );
    moduleActivationStore.addDeactivation(
      moduleId1,
      serviceIdentifier2,
      onDeactivation3
    );

    const onActivationMod2: interfaces.BindingActivation<unknown> = (
      _c: interfaces.Context,
      a: unknown
    ) => a;
    const onDeactivationMod2: interfaces.BindingDeactivation<unknown> = async (
      _d: unknown
    ) => Promise.resolve();
    moduleActivationStore.addActivation(
      moduleId2,
      serviceIdentifier1,
      onActivationMod2
    );
    moduleActivationStore.addDeactivation(
      moduleId2,
      serviceIdentifier1,
      onDeactivationMod2
    );

    const clone: interfaces.ModuleActivationStore =
      moduleActivationStore.clone();

    // change original
    const onActivation4: interfaces.BindingActivation<unknown> = (
      _c: interfaces.Context,
      a: unknown
    ) => a;
    const onDeactivation4: interfaces.BindingDeactivation<unknown> = async (
      _d: unknown
    ) => Promise.resolve();

    moduleActivationStore.addActivation(
      moduleId1,
      serviceIdentifier1,
      onActivation4
    );
    moduleActivationStore.addDeactivation(
      moduleId1,
      serviceIdentifier1,
      onDeactivation4
    );
    moduleActivationStore.remove(moduleId2);

    const cloneModule1Handlers: interfaces.ModuleActivationHandlers =
      clone.remove(moduleId1);

    expect(cloneModule1Handlers.onActivations.getMap()).toEqual(
      new Map([
        [serviceIdentifier1, [onActivation1, onActivation2]],
        [serviceIdentifier2, [onActivation3]],
      ])
    );

    expect(cloneModule1Handlers.onDeactivations.getMap()).toEqual(
      new Map([
        [serviceIdentifier1, [onDeactivation1, onDeactivation2]],
        [serviceIdentifier2, [onDeactivation3]],
      ])
    );

    const cloneModule2Handlers: interfaces.ModuleActivationHandlers =
      clone.remove(moduleId2);

    expect(cloneModule2Handlers.onActivations.getMap()).toEqual(
      new Map([[serviceIdentifier1, [onActivationMod2]]])
    );

    expect(cloneModule2Handlers.onDeactivations.getMap()).toEqual(
      new Map([[serviceIdentifier1, [onDeactivationMod2]]])
    );
  });
});
