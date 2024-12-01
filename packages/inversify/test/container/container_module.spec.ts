import * as sinon from "sinon";

import { interfaces } from "../../src";
import { NOT_REGISTERED } from "../../src/constants/error_msgs";
import { Container } from "../../src/container/container";
import {
  AsyncContainerModule,
  ContainerModule,
} from "../../src/container/container_module";

describe("ContainerModule", () => {
  it("Should be able to set the registry of a container module", () => {
    const registry: (bind: interfaces.Bind) => void = (
      _bind: interfaces.Bind
    ) => {
      return;
    };

    const warriors: ContainerModule = new ContainerModule(registry);

    expect(typeof warriors.id).toBe("number");
    expect(warriors.registry).toEqual(registry);
  });

  it("Should be able to remove some bindings from within a container module", () => {
    const container: Container = new Container();
    container.bind<string>("A").toConstantValue("1");
    expect(container.get<string>("A")).toBe("1");

    const warriors: ContainerModule = new ContainerModule(
      (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
        expect(container.get<string>("A")).toBe("1");
        unbind("A");
        expect(() => {
          container.get<string>("A");
        }).toThrow();
        bind<string>("A").toConstantValue("2");
        expect(container.get<string>("A")).toBe("2");
        bind<string>("B").toConstantValue("3");
        expect(container.get<string>("B")).toBe("3");
      }
    );

    container.load(warriors);
    expect(container.get<string>("A")).toBe("2");
    expect(container.get<string>("B")).toBe("3");
  });

  it("Should be able to check for existence of bindings within a container module", () => {
    const container: Container = new Container();
    container.bind<string>("A").toConstantValue("1");
    expect(container.get<string>("A")).toBe("1");

    const warriors: ContainerModule = new ContainerModule(
      (
        _bind: interfaces.Bind,
        unbind: interfaces.Unbind,
        isBound: interfaces.IsBound
      ) => {
        expect(container.get<string>("A")).toBe("1");
        expect(isBound("A")).toBe(true);
        unbind("A");
        expect(isBound("A")).toBe(false);
      }
    );

    container.load(warriors);
  });

  it("Should be able to override a binding using rebind within a container module", () => {
    const TYPES = {
      someType: "someType",
    };

    const container: Container = new Container();

    const module1: ContainerModule = new ContainerModule(
      (bind: interfaces.Bind) => {
        bind<number>(TYPES.someType).toConstantValue(1);

        bind<number>(TYPES.someType).toConstantValue(2);
      }
    );

    const module2: ContainerModule = new ContainerModule(
      (
        _bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        rebind: interfaces.Rebind
      ) => {
        rebind<number>(TYPES.someType).toConstantValue(3);
      }
    );

    container.load(module1);
    const values1: unknown[] = container.getAll(TYPES.someType);
    expect(values1[0]).toBe(1);

    expect(values1[1]).toBe(2);

    container.load(module2);
    const values2: unknown[] = container.getAll(TYPES.someType);

    expect(values2[0]).toBe(3);
    expect(values2[1]).toBeUndefined();
  });

  it("Should be able use await async functions in container modules", async () => {
    const container: Container = new Container();
    const someAsyncFactory: () => Promise<number> = async () =>
      new Promise<number>(
        (res: (value: number | PromiseLike<number>) => void) =>
          setTimeout(() => {
            res(1);
          }, 100)
      );
    const A: unique symbol = Symbol.for("A");
    const B: unique symbol = Symbol.for("B");

    const moduleOne: AsyncContainerModule = new AsyncContainerModule(
      async (bind: interfaces.Bind) => {
        const val: number = await someAsyncFactory();
        bind(A).toConstantValue(val);
      }
    );

    const moduleTwo: AsyncContainerModule = new AsyncContainerModule(
      async (bind: interfaces.Bind) => {
        bind(B).toConstantValue(2);
      }
    );

    await container.loadAsync(moduleOne, moduleTwo);

    const aIsBound: boolean = container.isBound(A);
    expect(aIsBound).toBe(true);
    const a: unknown = container.get(A);
    expect(a).toBe(1);
  });

  it("Should be able to add an activation hook through a container module", () => {
    const container: Container = new Container();
    container.bind<string>("A").toDynamicValue(() => "1");
    expect(container.get<string>("A")).toBe("1");

    const module: ContainerModule = new ContainerModule(
      (
        bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
        _unbindAsync: interfaces.UnbindAsync,
        onActivation: interfaces.Container["onActivation"]
      ) => {
        bind<string>("B")
          .toConstantValue("2")
          .onActivation(() => "C");
        onActivation("A", () => "B");
      }
    );

    container.load(module);

    expect(container.get<string>("A")).toBe("B");
    expect(container.get("B")).toBe("C");
  });

  it("Should be able to add a deactivation hook through a container module", () => {
    const container: Container = new Container();
    container.bind<string>("A").toConstantValue("1");

    let deact = false;
    const warriors: ContainerModule = new ContainerModule(
      (
        _bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
        _unbindAsync: interfaces.UnbindAsync,
        _onActivation: interfaces.Container["onActivation"],
        onDeactivation: interfaces.Container["onDeactivation"]
      ) => {
        onDeactivation("A", () => {
          deact = true;
        });
      }
    );

    container.load(warriors);
    container.get("A");
    container.unbind("A");

    expect(deact).toBe(true);
  });

  it("Should be able to add an async deactivation hook through a container module (async)", async () => {
    const container: Container = new Container();
    container.bind<string>("A").toConstantValue("1");

    let deact = false;

    const warriors: ContainerModule = new ContainerModule(
      (
        _bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
        _unbindAsync: interfaces.UnbindAsync,
        _onActivation: interfaces.Container["onActivation"],
        onDeactivation: interfaces.Container["onDeactivation"]
      ) => {
        onDeactivation("A", async () => {
          deact = true;
        });
      }
    );

    container.load(warriors);
    container.get("A");
    await container.unbindAsync("A");

    expect(deact).toBe(true);
  });

  it("Should be able to add multiple async deactivation hook through a container module (async)", async () => {
    const onActivationHandlerSpy: sinon.SinonSpy<[], Promise<void>> = sinon.spy<
      () => Promise<void>
    >(async () => undefined);

    const serviceIdentifier = "destroyable";
    const container: Container = new Container();

    const containerModule: ContainerModule = new ContainerModule(
      (
        _bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
        _unbindAsync: interfaces.UnbindAsync,
        _onActivation: interfaces.Container["onActivation"],
        onDeactivation: interfaces.Container["onDeactivation"]
      ) => {
        onDeactivation(serviceIdentifier, onActivationHandlerSpy);
        onDeactivation(serviceIdentifier, onActivationHandlerSpy);
      }
    );

    container.bind(serviceIdentifier).toConstantValue(serviceIdentifier);

    container.get(serviceIdentifier);

    container.load(containerModule);

    await container.unbindAllAsync();

    expect(onActivationHandlerSpy.callCount).toBe(2);
  });

  it("Should remove module bindings when unload", () => {
    const sid = "sid";
    const container: Container = new Container();
    container.bind<string>(sid).toConstantValue("Not module");
    const module: ContainerModule = new ContainerModule(
      (bind: interfaces.Bind) => {
        bind<string>(sid).toConstantValue("Module");
      }
    );
    container.load(module);
    let values: unknown[] = container.getAll(sid);
    expect(values).toEqual(["Not module", "Module"]);

    container.unload(module);
    values = container.getAll(sid);
    expect(values).toEqual(["Not module"]);
  });

  it("Should deactivate singletons from module bindings when unload", () => {
    const sid = "sid";
    const container: Container = new Container();
    let moduleBindingDeactivated: string | undefined;
    let containerDeactivated: string | undefined;
    const module: ContainerModule = new ContainerModule(
      (
        bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
        _unbindAsync: interfaces.UnbindAsync,
        _onActivation: interfaces.Container["onActivation"],
        onDeactivation: interfaces.Container["onDeactivation"]
      ) => {
        bind<string>(sid)
          .toConstantValue("Module")
          .onDeactivation((injectable: string) => {
            moduleBindingDeactivated = injectable;
          });
        onDeactivation<string>(sid, (injectable: string) => {
          containerDeactivated = injectable;
        });
      }
    );
    container.load(module);
    container.get(sid);

    container.unload(module);
    expect(moduleBindingDeactivated).toBe("Module");
    expect(containerDeactivated).toBe("Module");
  });

  it("Should remove container handlers from module when unload", () => {
    const sid = "sid";
    const container: Container = new Container();
    let activatedNotModule: string | undefined;
    let deactivatedNotModule: string | undefined;
    container.onActivation<string>(
      sid,
      (_: interfaces.Context, injected: string) => {
        activatedNotModule = injected;
        return injected;
      }
    );
    container.onDeactivation<string>(sid, (injected: string) => {
      deactivatedNotModule = injected;
    });
    container.bind<string>(sid).toConstantValue("Value");
    let activationCount = 0;
    let deactivationCount = 0;
    const module: ContainerModule = new ContainerModule(
      (
        _bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
        _unbindAsync: interfaces.UnbindAsync,
        onActivation: interfaces.Container["onActivation"],
        onDeactivation: interfaces.Container["onDeactivation"]
      ) => {
        onDeactivation<string>(sid, (_: string) => {
          deactivationCount++;
        });
        onActivation<string>(sid, (_: interfaces.Context, injected: string) => {
          activationCount++;
          return injected;
        });
      }
    );
    container.load(module);
    container.unload(module);

    container.get(sid);
    container.unbind(sid);

    expect(activationCount).toBe(0);
    expect(deactivationCount).toBe(0);

    expect(activatedNotModule).toBe("Value");
    expect(deactivatedNotModule).toBe("Value");
  });

  it("Should remove module bindings when unloadAsync", async () => {
    const sid = "sid";
    const container: Container = new Container();
    container.onDeactivation(sid, async (_injected: unknown) =>
      Promise.resolve()
    );
    container.bind<string>(sid).toConstantValue("Not module");
    const module: ContainerModule = new ContainerModule(
      (bind: interfaces.Bind) => {
        bind<string>(sid).toConstantValue("Module");
      }
    );
    container.load(module);
    let values: unknown[] = container.getAll(sid);
    expect(values).toEqual(["Not module", "Module"]);

    await container.unloadAsync(module);
    values = container.getAll(sid);
    expect(values).toEqual(["Not module"]);
  });

  it("Should deactivate singletons from module bindings when unloadAsync", async () => {
    const sid = "sid";
    const container: Container = new Container();
    let moduleBindingDeactivated: string | undefined;
    let containerDeactivated: string | undefined;
    const module: ContainerModule = new ContainerModule(
      (
        bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
        _unbindAsync: interfaces.UnbindAsync,
        _onActivation: interfaces.Container["onActivation"],
        onDeactivation: interfaces.Container["onDeactivation"]
      ) => {
        bind<string>(sid)
          .toConstantValue("Module")
          .onDeactivation((injectable: string) => {
            moduleBindingDeactivated = injectable;
          });
        onDeactivation<string>(sid, async (injectable: string) => {
          containerDeactivated = injectable;
          return Promise.resolve();
        });
      }
    );
    container.load(module);
    container.get(sid);

    await container.unloadAsync(module);
    expect(moduleBindingDeactivated).toBe("Module");
    expect(containerDeactivated).toBe("Module");
  });

  it("Should remove container handlers from module when unloadAsync", async () => {
    const sid = "sid";
    const container: Container = new Container();
    let activatedNotModule: string | undefined;
    let deactivatedNotModule: string | undefined;
    container.onActivation<string>(
      sid,
      (_: interfaces.Context, injected: string) => {
        activatedNotModule = injected;
        return injected;
      }
    );
    container.onDeactivation<string>(sid, (injected: string) => {
      deactivatedNotModule = injected;
    });
    container.bind<string>(sid).toConstantValue("Value");
    let activationCount = 0;
    let deactivationCount = 0;
    const module: ContainerModule = new ContainerModule(
      (
        _bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
        _unbindAsync: interfaces.UnbindAsync,
        onActivation: interfaces.Container["onActivation"],
        onDeactivation: interfaces.Container["onDeactivation"]
      ) => {
        onDeactivation<string>(sid, async (_: string) => {
          deactivationCount++;
          return Promise.resolve();
        });
        onActivation<string>(sid, (_: interfaces.Context, injected: string) => {
          activationCount++;
          return injected;
        });
      }
    );
    container.load(module);
    await container.unloadAsync(module);

    container.get(sid);
    container.unbind(sid);

    expect(activationCount).toBe(0);
    expect(deactivationCount).toBe(0);

    expect(activatedNotModule).toBe("Value");
    expect(deactivatedNotModule).toBe("Value");
  });

  it("should be able to unbindAsync from a module", async () => {
    let unbindAsyncFn: interfaces.UnbindAsync | undefined;
    const container: Container = new Container();
    const module: ContainerModule = new ContainerModule(
      (
        _bind: interfaces.Bind,
        _unbind: interfaces.Unbind,
        _isBound: interfaces.IsBound,
        _rebind: interfaces.Rebind,
        unbindAsync: interfaces.UnbindAsync
      ) => {
        unbindAsyncFn = unbindAsync;
      }
    );
    const sid = "sid";
    container.bind<string>(sid).toConstantValue("Value");
    container.bind<string>(sid).toConstantValue("Value2");
    const deactivated: string[] = [];
    container.onDeactivation<string>(sid, async (injected: string) => {
      deactivated.push(injected);
      return Promise.resolve();
    });

    container.getAll(sid);
    container.load(module);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await unbindAsyncFn!(sid);
    expect(deactivated).toEqual(["Value", "Value2"]);
    // bindings removed
    expect(() => container.getAll(sid)).toThrow(
      `${NOT_REGISTERED(container.id)} sid`
    );
  });
});
