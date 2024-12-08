import * as sinon from "sinon";

import { taggedConstraint } from "../../src";
import { interfaces } from "../../src";
import { inject } from "../../src/annotation/inject";
import { injectable } from "../../src/annotation/injectable";
import { postConstruct } from "../../src/annotation/post_construct";
import * as ERROR_MSGS from "../../src/constants/error_msgs";
import { BindingScopeEnum } from "../../src/constants/literal_types";
import { Container } from "../../src/container/container";
import { ContainerModule } from "../../src/container/container_module";
import { ModuleActivationStore } from "../../src/container/module_activation_store";
import { getBindingDictionary } from "../../src/planning/planner";
import { getServiceIdentifierAsString } from "../../src/utils/serialization";

type Dictionary = Map<
  interfaces.ServiceIdentifier,
  interfaces.Binding<unknown>[]
>;

describe("Container", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Should be able to use modules as configuration", () => {
    @injectable()
    class Katana {}

    @injectable()
    class Shuriken {}

    @injectable()
    class Ninja {}

    const warriors: ContainerModule = new ContainerModule(
      (bind: interfaces.Bind) => {
        bind<Ninja>("Ninja").to(Ninja);
      }
    );

    const weapons: ContainerModule = new ContainerModule(
      (bind: interfaces.Bind) => {
        bind<Katana>("Katana").to(Katana);
        bind<Shuriken>("Shuriken").to(Shuriken);
      }
    );

    const container: Container = new Container();
    container.load(warriors, weapons);

    let map: Dictionary = getBindingDictionary(container).getMap();
    expect(map.has("Ninja")).toBe(true);
    expect(map.has("Katana")).toBe(true);
    expect(map.has("Shuriken")).toBe(true);

    expect(map.size).toBe(3);

    const tryGetNinja: () => void = () => {
      container.get("Ninja");
    };
    const tryGetKatana: () => void = () => {
      container.get("Katana");
    };
    const tryGetShuruken: () => void = () => {
      container.get("Shuriken");
    };

    container.unload(warriors);
    map = getBindingDictionary(container).getMap();

    expect(map.size).toBe(2);
    expect(tryGetNinja).toThrow(ERROR_MSGS.NOT_REGISTERED(container.id));
    expect(tryGetKatana).not.toThrow();
    expect(tryGetShuruken).not.toThrow();

    container.unload(weapons);
    map = getBindingDictionary(container).getMap();
    expect(map.size).toBe(0);
    expect(tryGetNinja).toThrow(ERROR_MSGS.NOT_REGISTERED(container.id));
    expect(tryGetKatana).toThrow(ERROR_MSGS.NOT_REGISTERED(container.id));
    expect(tryGetShuruken).toThrow(ERROR_MSGS.NOT_REGISTERED(container.id));
  });

  it("Should be able to store bindings", () => {
    @injectable()
    class Ninja {}
    const ninjaId = "Ninja";

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);

    const map: Dictionary = getBindingDictionary(container).getMap();
    expect(map.size).toBe(1);
    expect(map.has(ninjaId)).toBe(true);
  });

  it("Should have an unique identifier", () => {
    const container1: Container = new Container();
    const container2: Container = new Container();
    expect(typeof container1.id).toBe("number");
    expect(typeof container2.id).toBe("number");
    expect(container1.id).not.toBe(container2.id);
  });

  it("Should unbind a binding when requested", () => {
    @injectable()
    class Ninja {}
    const ninjaId = "Ninja";

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);

    const map: Dictionary = getBindingDictionary(container).getMap();
    expect(map.has(ninjaId)).toBe(true);

    container.unbind(ninjaId);
    expect(map.has(ninjaId)).toBe(false);
    expect(map.size).toBe(0);
  });

  it("Should throw when cannot unbind", () => {
    const serviceIdentifier = "Ninja";
    const container: Container = new Container();
    const throwFunction: () => void = () => {
      container.unbind(serviceIdentifier);
    };
    expect(throwFunction).toThrow(
      `${ERROR_MSGS.CANNOT_UNBIND} ${getServiceIdentifierAsString(
        serviceIdentifier
      )}`
    );
  });

  it("Should throw when cannot unbind (async)", async () => {
    const serviceIdentifier = "Ninja";
    const container: Container = new Container();

    try {
      await container.unbindAsync(serviceIdentifier);
    } catch (err: unknown) {
      expect((err as Error).message).toBe(
        `${ERROR_MSGS.CANNOT_UNBIND} ${getServiceIdentifierAsString(
          serviceIdentifier
        )}`
      );
    }
  });

  it("Should unbind a binding when requested", () => {
    @injectable()
    class Ninja {}

    @injectable()
    class Samurai {}

    const ninjaId = "Ninja";
    const samuraiId = "Samurai";

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Samurai>(samuraiId).to(Samurai);

    let map: Dictionary = getBindingDictionary(container).getMap();

    expect(map.size).toBe(2);
    expect(map.has(ninjaId)).toBe(true);
    expect(map.has(samuraiId)).toBe(true);

    container.unbind(ninjaId);
    map = getBindingDictionary(container).getMap();
    expect(map.size).toBe(1);
  });

  it("Should be able unbound all dependencies", () => {
    @injectable()
    class Ninja {}

    @injectable()
    class Samurai {}

    const ninjaId = "Ninja";
    const samuraiId = "Samurai";

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Samurai>(samuraiId).to(Samurai);

    let map: Dictionary = getBindingDictionary(container).getMap();

    expect(map.size).toBe(2);
    expect(map.has(ninjaId)).toBe(true);
    expect(map.has(samuraiId)).toBe(true);

    container.unbindAll();
    map = getBindingDictionary(container).getMap();
    expect(map.size).toBe(0);
  });

  it("Should NOT be able to get unregistered services", () => {
    @injectable()
    class Ninja {}
    const ninjaId = "Ninja";

    const container: Container = new Container();
    const throwFunction: () => void = () => {
      container.get<Ninja>(ninjaId);
    };

    expect(throwFunction).toThrow(
      `${ERROR_MSGS.NOT_REGISTERED(container.id)} ${ninjaId}`
    );
  });

  it("Should NOT be able to get ambiguous match", () => {
    type Warrior = unknown;

    @injectable()
    class Ninja {}

    @injectable()
    class Samurai {}

    const warriorId = "Warrior";

    const container: Container = new Container();
    container.bind<Warrior>(warriorId).to(Ninja);
    container.bind<Warrior>(warriorId).to(Samurai);

    const dictionary: Dictionary = getBindingDictionary(container).getMap();

    expect(dictionary.size).toBe(1);
    dictionary.forEach(
      (
        value: interfaces.Binding<unknown>[],
        key: interfaces.ServiceIdentifier
      ) => {
        expect(key).toBe(warriorId);

        expect(value.length).toBe(2);
      }
    );

    const throwFunction: () => void = () => {
      container.get<Warrior>(warriorId);
    };
    expect(throwFunction).toThrow(
      `${ERROR_MSGS.AMBIGUOUS_MATCH(container.id)} ${warriorId}`
    );
  });

  it("Should NOT be able to getAll of an unregistered services", () => {
    @injectable()
    class Ninja {}
    const ninjaId = "Ninja";

    const container: Container = new Container();
    const throwFunction: () => void = () => {
      container.getAll<Ninja>(ninjaId);
    };

    expect(throwFunction).toThrow(
      `${ERROR_MSGS.NOT_REGISTERED(container.id)} ${ninjaId}`
    );
  });

  it("Should be able to get a string literal identifier as a string", () => {
    const katana = "Katana";
    const katanaStr: string = getServiceIdentifierAsString(katana);
    expect(katanaStr).toBe("Katana");
  });

  it("Should be able to get a symbol identifier as a string", () => {
    const katanaSymbol: symbol = Symbol.for("Katana");
    const katanaStr: string = getServiceIdentifierAsString(katanaSymbol);
    expect(katanaStr).toBe("Symbol(Katana)");
  });

  it("Should be able to get a class identifier as a string", () => {
    class Katana {}

    const katanaStr: string = getServiceIdentifierAsString(Katana);
    expect(katanaStr).toBe("Katana");
  });

  it("Should be able to snapshot and restore container", () => {
    @injectable()
    class Ninja {}

    @injectable()
    class Samurai {}

    const container: Container = new Container();
    container.bind(Ninja).to(Ninja);
    container.bind(Samurai).to(Samurai);

    expect(container.get(Samurai)).toBeInstanceOf(Samurai);
    expect(container.get(Ninja)).toBeInstanceOf(Ninja);

    container.snapshot(); // snapshot container = v1

    container.unbind(Ninja);
    expect(container.get(Samurai)).toBeInstanceOf(Samurai);
    expect(() => container.get(Ninja)).toThrow();

    container.snapshot(); // snapshot container = v2
    expect(() => container.get(Ninja)).toThrow();

    container.bind(Ninja).to(Ninja);
    expect(container.get(Samurai)).toBeInstanceOf(Samurai);
    expect(container.get(Ninja)).toBeInstanceOf(Ninja);

    container.restore(); // restore container to v2
    expect(container.get(Samurai)).toBeInstanceOf(Samurai);
    expect(() => container.get(Ninja)).toThrow();

    container.restore(); // restore container to v1
    expect(container.get(Samurai)).toBeInstanceOf(Samurai);
    expect(container.get(Ninja)).toBeInstanceOf(Ninja);

    expect(() => {
      container.restore();
    }).toThrow(ERROR_MSGS.NO_MORE_SNAPSHOTS_AVAILABLE);
  });

  it("Should maintain the activation state of a singleton when doing a snapshot of a container", () => {
    let timesCalled = 0;

    @injectable()
    class Ninja {
      @postConstruct()
      public postConstruct() {
        timesCalled++;
      }
    }

    const container: Container = new Container();

    container.bind<Ninja>(Ninja).to(Ninja).inSingletonScope();

    container.get<Ninja>(Ninja);
    container.snapshot();
    container.restore();
    container.get<Ninja>(Ninja);

    expect(timesCalled).toBe(1);
  });

  it("Should save and restore the container activations and deactivations when snapshot and restore", () => {
    const sid = "sid";
    const container: Container = new Container();
    container.bind<string>(sid).toConstantValue("Value");

    let activated = false;
    let deactivated = false;

    container.snapshot();

    container.onActivation<string>(sid, (_c: interfaces.Context, i: string) => {
      activated = true;
      return i;
    });
    container.onDeactivation(sid, (_i: unknown) => {
      deactivated = true;
    });

    container.restore();

    container.get(sid);
    container.unbind(sid);

    expect(activated).toBe(false);
    expect(deactivated).toBe(false);
  });

  it("Should save and restore the module activation store when snapshot and restore", () => {
    const container: Container = new Container();
    const clonedActivationStore: ModuleActivationStore =
      new ModuleActivationStore();

    const originalActivationStore: {
      clone(): ModuleActivationStore;
    } = {
      clone() {
        return clonedActivationStore;
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyContainer: any = container;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    anyContainer._moduleActivationStore = originalActivationStore;
    container.snapshot();
    const snapshot: interfaces.ContainerSnapshot =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      anyContainer._snapshots[0] as interfaces.ContainerSnapshot;
    expect(snapshot.moduleActivationStore === clonedActivationStore).toBe(true);
    container.restore();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      anyContainer._moduleActivationStore === clonedActivationStore
    ).toBe(true);
  });

  it("Should be able to check is there are bindings available for a given identifier", () => {
    const warriorId = "Warrior";
    const warriorSymbol: symbol = Symbol.for("Warrior");

    @injectable()
    class Ninja {}

    const container: Container = new Container();
    container.bind(Ninja).to(Ninja);
    container.bind(warriorId).to(Ninja);
    container.bind(warriorSymbol).to(Ninja);

    expect(container.isBound(Ninja)).toBe(true);
    expect(container.isBound(warriorId)).toBe(true);
    expect(container.isBound(warriorSymbol)).toBe(true);

    const katanaId = "Katana";
    const katanaSymbol: symbol = Symbol.for("Katana");

    @injectable()
    class Katana {}

    expect(container.isBound(Katana)).toBe(false);
    expect(container.isBound(katanaId)).toBe(false);
    expect(container.isBound(katanaSymbol)).toBe(false);
  });

  it("Should be able to check is there are bindings available for a given identifier only in current container", () => {
    @injectable()
    class Ninja {}

    const containerParent: Container = new Container();
    const containerChild: Container = new Container();

    containerChild.parent = containerParent;

    containerParent.bind(Ninja).to(Ninja);

    expect(containerParent.isBound(Ninja)).toBe(true);
    expect(containerParent.isCurrentBound(Ninja)).toBe(true);
    expect(containerChild.isBound(Ninja)).toBe(true);
    expect(containerChild.isCurrentBound(Ninja)).toBe(false);
  });

  it("Should be able to get services from parent container", () => {
    const weaponIdentifier = "Weapon";

    @injectable()
    class Katana {}

    const container: Container = new Container();
    container.bind(weaponIdentifier).to(Katana);

    const childContainer: Container = new Container();
    childContainer.parent = container;

    const secondChildContainer: Container = new Container();
    secondChildContainer.parent = childContainer;

    expect(secondChildContainer.get(weaponIdentifier)).toBeInstanceOf(Katana);
  });

  it("Should be able to check if services are bound from parent container", () => {
    const weaponIdentifier = "Weapon";

    @injectable()
    class Katana {}

    const container: Container = new Container();
    container.bind(weaponIdentifier).to(Katana);

    const childContainer: Container = new Container();
    childContainer.parent = container;

    const secondChildContainer: Container = new Container();
    secondChildContainer.parent = childContainer;

    expect(secondChildContainer.isBound(weaponIdentifier)).toBe(true);
  });

  it("Should prioritize requested container to resolve a service identifier", () => {
    const weaponIdentifier = "Weapon";

    @injectable()
    class Katana {}

    @injectable()
    class DivineRapier {}

    const container: Container = new Container();
    container.bind(weaponIdentifier).to(Katana);

    const childContainer: Container = new Container();
    childContainer.parent = container;

    const secondChildContainer: Container = new Container();
    secondChildContainer.parent = childContainer;
    secondChildContainer.bind(weaponIdentifier).to(DivineRapier);

    expect(secondChildContainer.get(weaponIdentifier)).toBeInstanceOf(
      DivineRapier
    );
  });

  it("Should be able to resolve named multi-injection", () => {
    interface Intl {
      hello?: string;
      goodbye?: string;
    }

    const container: Container = new Container();
    container
      .bind<Intl>("Intl")
      .toConstantValue({ hello: "bonjour" })
      .whenTargetNamed("fr");
    container
      .bind<Intl>("Intl")
      .toConstantValue({ goodbye: "au revoir" })
      .whenTargetNamed("fr");
    container
      .bind<Intl>("Intl")
      .toConstantValue({ hello: "hola" })
      .whenTargetNamed("es");
    container
      .bind<Intl>("Intl")
      .toConstantValue({ goodbye: "adios" })
      .whenTargetNamed("es");

    const fr: Intl[] = container.getAllNamed<Intl>("Intl", "fr");

    expect(fr.length).toBe(2);
    expect(fr[0]?.hello).toBe("bonjour");
    expect(fr[1]?.goodbye).toBe("au revoir");

    const es: Intl[] = container.getAllNamed<Intl>("Intl", "es");

    expect(es.length).toBe(2);
    expect(es[0]?.hello).toBe("hola");
    expect(es[1]?.goodbye).toBe("adios");
  });

  it("Should be able to resolve tagged multi-injection", () => {
    interface Intl {
      hello?: string;
      goodbye?: string;
    }

    const container: Container = new Container();
    container
      .bind<Intl>("Intl")
      .toConstantValue({ hello: "bonjour" })
      .whenTargetTagged("lang", "fr");
    container
      .bind<Intl>("Intl")
      .toConstantValue({ goodbye: "au revoir" })
      .whenTargetTagged("lang", "fr");
    container
      .bind<Intl>("Intl")
      .toConstantValue({ hello: "hola" })
      .whenTargetTagged("lang", "es");
    container
      .bind<Intl>("Intl")
      .toConstantValue({ goodbye: "adios" })
      .whenTargetTagged("lang", "es");

    const fr: Intl[] = container.getAllTagged<Intl>("Intl", "lang", "fr");

    expect(fr.length).toBe(2);
    expect(fr[0]?.hello).toBe("bonjour");
    expect(fr[1]?.goodbye).toBe("au revoir");

    const es: Intl[] = container.getAllTagged<Intl>("Intl", "lang", "es");

    expect(es.length).toBe(2);
    expect(es[0]?.hello).toBe("hola");
    expect(es[1]?.goodbye).toBe("adios");
  });

  it("Should be able configure the default scope at a global level", () => {
    interface Warrior {
      health: number;
      takeHit(damage: number): void;
    }

    @injectable()
    class Ninja implements Warrior {
      public health: number;
      constructor() {
        this.health = 100;
      }
      public takeHit(damage: number) {
        this.health = this.health - damage;
      }
    }

    // eslint-disable-next-line @typescript-eslint/typedef
    const TYPES = {
      Warrior: "Warrior",
    };

    const container1: Container = new Container();
    container1.bind<Warrior>(TYPES.Warrior).to(Ninja);

    const transientNinja1: Warrior = container1.get<Warrior>(TYPES.Warrior);

    expect(transientNinja1.health).toBe(100);

    transientNinja1.takeHit(10);

    expect(transientNinja1.health).toBe(90);

    const transientNinja2: Warrior = container1.get<Warrior>(TYPES.Warrior);

    expect(transientNinja2.health).toBe(100);

    transientNinja2.takeHit(10);

    expect(transientNinja2.health).toBe(90);

    const container2: Container = new Container({
      defaultScope: BindingScopeEnum.Singleton,
    });
    container2.bind<Warrior>(TYPES.Warrior).to(Ninja);

    const singletonNinja1: Warrior = container2.get<Warrior>(TYPES.Warrior);

    expect(singletonNinja1.health).toBe(100);

    singletonNinja1.takeHit(10);

    expect(singletonNinja1.health).toBe(90);

    const singletonNinja2: Warrior = container2.get<Warrior>(TYPES.Warrior);

    expect(singletonNinja2.health).toBe(90);

    singletonNinja2.takeHit(10);

    expect(singletonNinja2.health).toBe(80);
  });

  it("Should default binding scope to Transient if no default scope on options", () => {
    const container: Container = new Container();
    container.options.defaultScope = undefined;
    const expectedScope: interfaces.BindingScope = "Transient";
    expect(
      (
        container.bind("SID") as unknown as {
          _binding: { scope: interfaces.BindingScope };
        }
      )._binding.scope
    ).toBe(expectedScope);
  });
  it("Should be able to configure automatic binding for @injectable() decorated classes", () => {
    @injectable()
    class Katana {}

    @injectable()
    class Shuriken {}

    @injectable()
    class Ninja {
      constructor(public weapon: Katana) {}
    }

    class Samurai {}

    const container1: Container = new Container({ autoBindInjectable: true });
    const katana1: Katana = container1.get(Katana);
    const ninja1: Ninja = container1.get(Ninja);
    expect(katana1).toBeInstanceOf(Katana);
    expect(katana1).not.toBe(container1.get(Katana));
    expect(ninja1).toBeInstanceOf(Ninja);
    expect(ninja1).not.toBe(container1.get(Ninja));
    expect(ninja1.weapon).toBeInstanceOf(Katana);
    expect(ninja1.weapon).not.toBe(container1.get(Ninja).weapon);
    expect(ninja1.weapon).not.toBe(katana1);

    const container2: Container = new Container({
      autoBindInjectable: true,
      defaultScope: BindingScopeEnum.Singleton,
    });
    const katana2: Katana = container2.get(Katana);
    const ninja2: Ninja = container2.get(Ninja);

    expect(katana2).toBeInstanceOf(Katana);
    expect(katana2).toBe(container2.get(Katana));
    expect(ninja2).toBeInstanceOf(Ninja);
    expect(ninja2).toBe(container2.get(Ninja));
    expect(ninja2.weapon).toBeInstanceOf(Katana);
    expect(ninja2.weapon).toBe(container2.get(Ninja).weapon);
    expect(ninja2.weapon).toBe(katana2);

    const container3: Container = new Container({ autoBindInjectable: true });
    container3.bind(Katana).toSelf().inSingletonScope();
    const katana3: Katana = container3.get(Katana);
    const ninja3: Ninja = container3.get(Ninja);

    expect(katana3).toBeInstanceOf(Katana);
    expect(katana3).toBe(container3.get(Katana));
    expect(ninja3).toBeInstanceOf(Ninja);
    expect(ninja3).not.toBe(container3.get(Ninja));
    expect(ninja3.weapon).toBeInstanceOf(Katana);
    expect(ninja3.weapon).toBe(container3.get(Ninja).weapon);
    expect(ninja3.weapon).toBe(katana3);

    const container4: Container = new Container({ autoBindInjectable: true });
    container4.bind(Katana).to(Shuriken);

    const katana4: Katana = container4.get(Katana);
    const ninja4: Ninja = container4.get(Ninja);

    expect(katana4).toBeInstanceOf(Shuriken);
    expect(katana4).not.toBe(container4.get(Katana));
    expect(ninja4).toBeInstanceOf(Ninja);
    expect(ninja4).not.toBe(container4.get(Ninja));
    expect(ninja4.weapon).toBeInstanceOf(Shuriken);
    expect(ninja4.weapon).not.toBe(container4.get(Ninja).weapon);
    expect(ninja4.weapon).not.toBe(katana4);

    const container5: Container = new Container({ autoBindInjectable: true });

    const samurai: Samurai = container5.get(Samurai);

    expect(samurai).toBeInstanceOf(Samurai);
  });

  it("Should be throw an exception if incorrect options is provided", () => {
    const invalidOptions1: () => number = () => 0;
    const wrong1: () => Container = () =>
      new Container(invalidOptions1 as unknown as interfaces.ContainerOptions);
    expect(wrong1).toThrow(ERROR_MSGS.CONTAINER_OPTIONS_MUST_BE_AN_OBJECT);

    const invalidOptions2: interfaces.ContainerOptions = {
      autoBindInjectable: "wrongValue" as unknown as boolean,
    };

    const wrong2: () => Container = () =>
      new Container(invalidOptions2 as unknown as interfaces.ContainerOptions);

    expect(wrong2).toThrow(
      ERROR_MSGS.CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE
    );

    const invalidOptions3: interfaces.ContainerOptions = {
      defaultScope: "wrongValue" as unknown as interfaces.BindingScope,
    };

    const wrong3: () => Container = () =>
      new Container(invalidOptions3 as unknown as interfaces.ContainerOptions);
    expect(wrong3).toThrow(ERROR_MSGS.CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE);
  });

  it("Should be able to merge two containers", () => {
    @injectable()
    class Ninja {
      public name = "Ninja";
    }

    @injectable()
    class Shuriken {
      public name = "Shuriken";
    }

    // eslint-disable-next-line @typescript-eslint/typedef
    const CHINA_EXPANSION_TYPES = {
      Ninja: "Ninja",
      Shuriken: "Shuriken",
    };

    const chinaExpansionContainer: Container = new Container();
    chinaExpansionContainer.bind<Ninja>(CHINA_EXPANSION_TYPES.Ninja).to(Ninja);
    chinaExpansionContainer
      .bind<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken)
      .to(Shuriken);

    @injectable()
    class Samurai {
      public name = "Samurai";
    }

    @injectable()
    class Katana {
      public name = "Katana";
    }

    // eslint-disable-next-line @typescript-eslint/typedef
    const JAPAN_EXPANSION_TYPES = {
      Katana: "Katana",
      Samurai: "Samurai",
    };

    const japanExpansionContainer: Container = new Container();
    japanExpansionContainer
      .bind<Samurai>(JAPAN_EXPANSION_TYPES.Samurai)
      .to(Samurai);
    japanExpansionContainer
      .bind<Katana>(JAPAN_EXPANSION_TYPES.Katana)
      .to(Katana);

    const gameContainer: interfaces.Container = Container.merge(
      chinaExpansionContainer,
      japanExpansionContainer
    );

    expect(gameContainer.get<Ninja>(CHINA_EXPANSION_TYPES.Ninja).name).toBe(
      "Ninja"
    );
    expect(
      gameContainer.get<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken).name
    ).toBe("Shuriken");
    expect(gameContainer.get<Samurai>(JAPAN_EXPANSION_TYPES.Samurai).name).toBe(
      "Samurai"
    );
    expect(gameContainer.get<Katana>(JAPAN_EXPANSION_TYPES.Katana).name).toBe(
      "Katana"
    );
  });

  it("Should be able to merge multiple containers", () => {
    @injectable()
    class Ninja {
      public name = "Ninja";
    }

    @injectable()
    class Shuriken {
      public name = "Shuriken";
    }

    // eslint-disable-next-line @typescript-eslint/typedef
    const CHINA_EXPANSION_TYPES = {
      Ninja: "Ninja",
      Shuriken: "Shuriken",
    };

    const chinaExpansionContainer: Container = new Container();
    chinaExpansionContainer.bind<Ninja>(CHINA_EXPANSION_TYPES.Ninja).to(Ninja);
    chinaExpansionContainer
      .bind<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken)
      .to(Shuriken);

    @injectable()
    class Samurai {
      public name = "Samurai";
    }

    @injectable()
    class Katana {
      public name = "Katana";
    }

    // eslint-disable-next-line @typescript-eslint/typedef
    const JAPAN_EXPANSION_TYPES = {
      Katana: "Katana",
      Samurai: "Samurai",
    };

    const japanExpansionContainer: Container = new Container();
    japanExpansionContainer
      .bind<Samurai>(JAPAN_EXPANSION_TYPES.Samurai)
      .to(Samurai);
    japanExpansionContainer
      .bind<Katana>(JAPAN_EXPANSION_TYPES.Katana)
      .to(Katana);

    @injectable()
    class Sheriff {
      public name = "Sheriff";
    }

    @injectable()
    class Revolver {
      public name = "Revolver";
    }

    const USA_EXPANSION_TYPES = {
      Revolver: "Revolver",
      Sheriff: "Sheriff",
    };

    const usaExpansionContainer: Container = new Container();
    usaExpansionContainer
      .bind<Sheriff>(USA_EXPANSION_TYPES.Sheriff)
      .to(Sheriff);
    usaExpansionContainer
      .bind<Revolver>(USA_EXPANSION_TYPES.Revolver)
      .to(Revolver);

    const gameContainer: interfaces.Container = Container.merge(
      chinaExpansionContainer,
      japanExpansionContainer,
      usaExpansionContainer
    );
    expect(gameContainer.get<Ninja>(CHINA_EXPANSION_TYPES.Ninja).name).toBe(
      "Ninja"
    );
    expect(
      gameContainer.get<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken).name
    ).toBe("Shuriken");
    expect(gameContainer.get<Samurai>(JAPAN_EXPANSION_TYPES.Samurai).name).toBe(
      "Samurai"
    );
    expect(gameContainer.get<Katana>(JAPAN_EXPANSION_TYPES.Katana).name).toBe(
      "Katana"
    );
    expect(gameContainer.get<Sheriff>(USA_EXPANSION_TYPES.Sheriff).name).toBe(
      "Sheriff"
    );
    expect(gameContainer.get<Revolver>(USA_EXPANSION_TYPES.Revolver).name).toBe(
      "Revolver"
    );
  });

  it("Should be able create a child containers", () => {
    const parent: Container = new Container();
    const child: Container = parent.createChild();
    if (child.parent === null) {
      throw new Error("Parent should not be null");
    }
    expect(child.parent.id).toBe(parent.id);
  });

  it("Should inherit parent container options", () => {
    @injectable()
    class Warrior {}

    const parent: Container = new Container({
      defaultScope: BindingScopeEnum.Singleton,
    });

    const child: Container = parent.createChild();
    child.bind(Warrior).toSelf();

    const singletonWarrior1: Warrior = child.get(Warrior);
    const singletonWarrior2: Warrior = child.get(Warrior);
    expect(singletonWarrior1).toBe(singletonWarrior2);
  });

  it("Should be able to override options to child containers", () => {
    @injectable()
    class Warrior {}

    const parent: Container = new Container({
      defaultScope: BindingScopeEnum.Request,
    });

    const child: Container = parent.createChild({
      defaultScope: BindingScopeEnum.Singleton,
    });
    child.bind(Warrior).toSelf();

    const singletonWarrior1: Warrior = child.get(Warrior);
    const singletonWarrior2: Warrior = child.get(Warrior);
    expect(singletonWarrior1).toBe(singletonWarrior2);
  });

  it("Should be able check if a named binding is bound", () => {
    const zero = "Zero";
    const invalidDivisor = "InvalidDivisor";
    const validDivisor = "ValidDivisor";
    const container: Container = new Container();

    expect(container.isBound(zero)).toBe(false);
    container.bind<number>(zero).toConstantValue(0);
    expect(container.isBound(zero)).toBe(true);

    container.unbindAll();
    expect(container.isBound(zero)).toBe(false);
    container
      .bind<number>(zero)
      .toConstantValue(0)
      .whenTargetNamed(invalidDivisor);
    expect(container.isBoundNamed(zero, invalidDivisor)).toBe(true);
    expect(container.isBoundNamed(zero, validDivisor)).toBe(false);

    container
      .bind<number>(zero)
      .toConstantValue(1)
      .whenTargetNamed(validDivisor);
    expect(container.isBoundNamed(zero, invalidDivisor)).toBe(true);
    expect(container.isBoundNamed(zero, validDivisor)).toBe(true);
  });

  it("Should be able to check if a named binding is bound from parent container", () => {
    const zero = "Zero";
    const invalidDivisor = "InvalidDivisor";
    const validDivisor = "ValidDivisor";
    const container: Container = new Container();
    const childContainer: Container = container.createChild();
    const secondChildContainer: Container = childContainer.createChild();

    container
      .bind<number>(zero)
      .toConstantValue(0)
      .whenTargetNamed(invalidDivisor);
    expect(secondChildContainer.isBoundNamed(zero, invalidDivisor)).toBe(true);
    expect(secondChildContainer.isBoundNamed(zero, validDivisor)).toBe(false);

    container
      .bind<number>(zero)
      .toConstantValue(1)
      .whenTargetNamed(validDivisor);
    expect(secondChildContainer.isBoundNamed(zero, invalidDivisor)).toBe(true);
    expect(secondChildContainer.isBoundNamed(zero, validDivisor)).toBe(true);
  });

  it("Should be able to get a tagged binding", () => {
    const zero = "Zero";
    const isValidDivisor = "IsValidDivisor";
    const container: Container = new Container();

    container
      .bind<number>(zero)
      .toConstantValue(0)
      .whenTargetTagged(isValidDivisor, false);
    expect(container.getTagged(zero, isValidDivisor, false)).toBe(0);

    container
      .bind<number>(zero)
      .toConstantValue(1)
      .whenTargetTagged(isValidDivisor, true);
    expect(container.getTagged(zero, isValidDivisor, false)).toBe(0);
    expect(container.getTagged(zero, isValidDivisor, true)).toBe(1);
  });

  it("Should be able to get a tagged binding from parent container", () => {
    const zero = "Zero";
    const isValidDivisor = "IsValidDivisor";
    const container: Container = new Container();
    const childContainer: Container = container.createChild();
    const secondChildContainer: Container = childContainer.createChild();

    container
      .bind<number>(zero)
      .toConstantValue(0)
      .whenTargetTagged(isValidDivisor, false);
    container
      .bind<number>(zero)
      .toConstantValue(1)
      .whenTargetTagged(isValidDivisor, true);
    expect(secondChildContainer.getTagged(zero, isValidDivisor, false)).toBe(0);
    expect(secondChildContainer.getTagged(zero, isValidDivisor, true)).toBe(1);
  });

  it("Should be able check if a tagged binding is bound", () => {
    const zero = "Zero";
    const isValidDivisor = "IsValidDivisor";
    const container: Container = new Container();

    expect(container.isBound(zero)).toBe(false);
    container.bind<number>(zero).toConstantValue(0);
    expect(container.isBound(zero)).toBe(true);

    container.unbindAll();
    expect(container.isBound(zero)).toBe(false);
    container
      .bind<number>(zero)
      .toConstantValue(0)
      .whenTargetTagged(isValidDivisor, false);
    expect(container.isBoundTagged(zero, isValidDivisor, false)).toBe(true);
    expect(container.isBoundTagged(zero, isValidDivisor, true)).toBe(false);

    container
      .bind<number>(zero)
      .toConstantValue(1)
      .whenTargetTagged(isValidDivisor, true);
    expect(container.isBoundTagged(zero, isValidDivisor, false)).toBe(true);
    expect(container.isBoundTagged(zero, isValidDivisor, true)).toBe(true);
  });

  it("Should be able to check if a tagged binding is bound from parent container", () => {
    const zero = "Zero";
    const isValidDivisor = "IsValidDivisor";
    const container: Container = new Container();
    const childContainer: Container = container.createChild();
    const secondChildContainer: Container = childContainer.createChild();

    container
      .bind<number>(zero)
      .toConstantValue(0)
      .whenTargetTagged(isValidDivisor, false);
    expect(
      secondChildContainer.isBoundTagged(zero, isValidDivisor, false)
    ).toBe(true);
    expect(secondChildContainer.isBoundTagged(zero, isValidDivisor, true)).toBe(
      false
    );

    container
      .bind<number>(zero)
      .toConstantValue(1)
      .whenTargetTagged(isValidDivisor, true);
    expect(
      secondChildContainer.isBoundTagged(zero, isValidDivisor, false)
    ).toBe(true);
    expect(secondChildContainer.isBoundTagged(zero, isValidDivisor, true)).toBe(
      true
    );
  });

  it("Should be able to override a binding using rebind", () => {
    // eslint-disable-next-line @typescript-eslint/typedef
    const TYPES = {
      someType: "someType",
    };

    const container: Container = new Container();
    container.bind<number>(TYPES.someType).toConstantValue(1);

    container.bind<number>(TYPES.someType).toConstantValue(2);

    const values1: unknown[] = container.getAll(TYPES.someType);
    expect(values1[0]).toBe(1);

    expect(values1[1]).toBe(2);

    container.rebind<number>(TYPES.someType).toConstantValue(3);
    const values2: unknown[] = container.getAll(TYPES.someType);

    expect(values2[0]).toBe(3);
    expect(values2[1]).toBeUndefined();
  });

  it("Should be able to override a binding using rebindAsync", async () => {
    // eslint-disable-next-line @typescript-eslint/typedef
    const TYPES = {
      someType: "someType",
    };

    const container: Container = new Container();
    container.bind<number>(TYPES.someType).toConstantValue(1);

    container.bind<number>(TYPES.someType).toConstantValue(2);
    container.onDeactivation(TYPES.someType, async () => Promise.resolve());

    const values1: unknown[] = container.getAll(TYPES.someType);
    expect(values1[0]).toBe(1);

    expect(values1[1]).toBe(2);

    (await container.rebindAsync<number>(TYPES.someType)).toConstantValue(3);
    const values2: unknown[] = container.getAll(TYPES.someType);

    expect(values2[0]).toBe(3);
    expect(values2[1]).toBeUndefined();
  });

  it("Should be able to resolve named multi-injection (async)", async () => {
    interface Intl {
      hello?: string;
      goodbye?: string;
    }

    const container: Container = new Container();
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ hello: "bonjour" }))
      .whenTargetNamed("fr");
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ goodbye: "au revoir" }))
      .whenTargetNamed("fr");
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ hello: "hola" }))
      .whenTargetNamed("es");
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ goodbye: "adios" }))
      .whenTargetNamed("es");

    const fr: Intl[] = await container.getAllNamedAsync<Intl>("Intl", "fr");

    expect(fr.length).toBe(2);
    expect(fr[0]?.hello).toBe("bonjour");
    expect(fr[1]?.goodbye).toBe("au revoir");

    const es: Intl[] = await container.getAllNamedAsync<Intl>("Intl", "es");

    expect(es.length).toBe(2);
    expect(es[0]?.hello).toBe("hola");
    expect(es[1]?.goodbye).toBe("adios");
  });

  it("Should be able to resolve named (async)", async () => {
    interface Intl {
      hello?: string;
      goodbye?: string;
    }

    const container: Container = new Container();
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ hello: "bonjour" }))
      .whenTargetNamed("fr");
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ hello: "hola" }))
      .whenTargetNamed("es");

    const fr: Intl = await container.getNamedAsync<Intl>("Intl", "fr");
    expect(fr.hello).toBe("bonjour");

    const es: Intl = await container.getNamedAsync<Intl>("Intl", "es");
    expect(es.hello).toBe("hola");
  });

  it("Should be able to resolve tagged multi-injection (async)", async () => {
    interface Intl {
      hello?: string;
      goodbye?: string;
    }

    const container: Container = new Container();
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ hello: "bonjour" }))
      .whenTargetTagged("lang", "fr");
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ goodbye: "au revoir" }))
      .whenTargetTagged("lang", "fr");
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ hello: "hola" }))
      .whenTargetTagged("lang", "es");
    container
      .bind<Intl>("Intl")
      .toDynamicValue(async () => Promise.resolve({ goodbye: "adios" }))
      .whenTargetTagged("lang", "es");

    const fr: Intl[] = await container.getAllTaggedAsync<Intl>(
      "Intl",
      "lang",
      "fr"
    );

    expect(fr.length).toBe(2);
    expect(fr[0]?.hello).toBe("bonjour");
    expect(fr[1]?.goodbye).toBe("au revoir");

    const es: Intl[] = await container.getAllTaggedAsync<Intl>(
      "Intl",
      "lang",
      "es"
    );

    expect(es.length).toBe(2);
    expect(es[0]?.hello).toBe("hola");
    expect(es[1]?.goodbye).toBe("adios");
  });

  it("Should be able to get a tagged binding (async)", async () => {
    const zero = "Zero";
    const isValidDivisor = "IsValidDivisor";
    const container: Container = new Container();

    container
      .bind<number>(zero)
      .toDynamicValue(async () => Promise.resolve(0))
      .whenTargetTagged(isValidDivisor, false);
    expect(await container.getTaggedAsync(zero, isValidDivisor, false)).toBe(0);

    container
      .bind<number>(zero)
      .toDynamicValue(async () => Promise.resolve(1))
      .whenTargetTagged(isValidDivisor, true);
    expect(await container.getTaggedAsync(zero, isValidDivisor, false)).toBe(0);
    expect(await container.getTaggedAsync(zero, isValidDivisor, true)).toBe(1);
  });

  it("should be able to get all the services binded (async)", async () => {
    const serviceIdentifier = "service-identifier";

    const container: Container = new Container();

    const firstValueBinded = "value-one";
    const secondValueBinded = "value-two";
    const thirdValueBinded = "value-three";

    container.bind(serviceIdentifier).toConstantValue(firstValueBinded);
    container.bind(serviceIdentifier).toConstantValue(secondValueBinded);
    container
      .bind(serviceIdentifier)
      .toDynamicValue(async (_: interfaces.Context) =>
        Promise.resolve(thirdValueBinded)
      );
    const services: string[] = await container.getAllAsync<string>(
      serviceIdentifier
    );

    expect(services).toEqual([
      firstValueBinded,
      secondValueBinded,
      thirdValueBinded,
    ]);
  });

  it("should throw an error if skipBaseClassChecks is not a boolean", () => {
    expect(
      () =>
        new Container({
          skipBaseClassChecks:
            "Jolene, Jolene, Jolene, Jolene" as unknown as boolean,
        })
    ).toThrow(ERROR_MSGS.CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK);
  });

  it("Should be able to inject when symbol property key ", () => {
    const weaponProperty: unique symbol = Symbol();
    type Weapon = unknown;
    @injectable()
    class Shuriken {}
    @injectable()
    class Ninja {
      @inject("Weapon")
      public [weaponProperty]!: Weapon;
    }
    const container: Container = new Container();
    container.bind("Weapon").to(Shuriken);
    const myNinja: Ninja = container.resolve(Ninja);
    const weapon: Weapon = myNinja[weaponProperty];
    expect(weapon).toBeInstanceOf(Shuriken);
  });

  it("Should be possible to constrain to a symbol description", () => {
    const throwableWeapon: unique symbol = Symbol("throwable");
    type Weapon = unknown;
    @injectable()
    class Shuriken {}
    @injectable()
    class Ninja {
      @inject("Weapon")
      public [throwableWeapon]!: Weapon;
    }
    const container: Container = new Container();
    container
      .bind("Weapon")
      .to(Shuriken)
      .when((request: interfaces.Request) => {
        return request.target.name.equals("throwable");
      });
    const myNinja: Ninja = container.resolve(Ninja);
    const weapon: Weapon = myNinja[throwableWeapon];
    expect(weapon).toBeInstanceOf(Shuriken);
  });

  it("container resolve should come from the same container", () => {
    @injectable()
    class CompositionRoot {}
    class DerivedContainer extends Container {
      public planningForCompositionRoot(): void {
        //
      }
    }
    const middleware: interfaces.Middleware =
      (next: interfaces.Next) => (nextArgs: interfaces.NextArgs) => {
        const contextInterceptor: (
          contexts: interfaces.Context
        ) => interfaces.Context = nextArgs.contextInterceptor;
        nextArgs.contextInterceptor = (context: interfaces.Context) => {
          if (context.plan.rootRequest.serviceIdentifier === CompositionRoot) {
            (
              context.container as DerivedContainer
            ).planningForCompositionRoot();
          }
          return contextInterceptor(context);
        };
        return next(nextArgs);
      };

    const myContainer: DerivedContainer = new DerivedContainer();
    myContainer.applyMiddleware(middleware);
    myContainer.resolve(CompositionRoot);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(() => myContainer.resolve(CompositionRoot)).not.toThrow;
  });

  it("Should be able to copy a subset of bindings from a container to another.", () => {
    const container: Container = new Container();
    const container2: Container = new Container();
    const weaponServiceIdentifier = Symbol("Weapon");
    const armorServiceIdentifier = Symbol("Armor");

    @injectable()
    class Shuriken {}

    @injectable()
    class Katana {}

    @injectable()
    class Helmet {}

    container2.bind(weaponServiceIdentifier).to(Shuriken);
    container.bind(weaponServiceIdentifier).to(Katana);
    container.bind(armorServiceIdentifier).to(Helmet);

    container.copyBindings(container2, [
      weaponServiceIdentifier,
      armorServiceIdentifier,
    ]);

    expect(container.getAll(weaponServiceIdentifier).length).toBe(2);
    expect(container.get(armorServiceIdentifier)).toBeInstanceOf(Helmet);
  });

  it("Should be able to copy a subset of bindings from a container to another filtering by metadata.", () => {
    const container: Container = new Container();
    const container2: Container = new Container();
    const shurikenTag = Symbol("shuriken");
    const katanaTag = Symbol("katana");

    @injectable()
    class Shuriken {}

    @injectable()
    class Katana {}

    container2.bind(Shuriken).toSelf().whenTargetTagged(shurikenTag, true);
    container2.bind(Katana).toSelf().whenTargetTagged(katanaTag, true);

    container.copyBindings(container2, [Shuriken, Katana], {
      key: shurikenTag,
      value: true,
    });

    expect(container.getTagged(Shuriken, shurikenTag, true)).toBeInstanceOf(
      Shuriken
    );
    expect(() => container.getTagged(Katana, katanaTag, true)).toThrow();
  });

  it("Should be able to copy a subset of bindings from a container to another and change their constraint.", () => {
    const container: Container = new Container();
    const container2: Container = new Container();
    const weaponServiceIdentifier = Symbol("Weapon");
    const armorServiceIdentifier = Symbol("Armor");
    const ninjaEquipmentTag = Symbol("NinjaEquipment");

    @injectable()
    class Shuriken {}

    @injectable()
    class Katana {}

    @injectable()
    class Helmet {}

    container2.bind(weaponServiceIdentifier).to(Shuriken);
    container2.bind(weaponServiceIdentifier).to(Katana);
    container2.bind(armorServiceIdentifier).to(Helmet);

    container.copyBindings(
      container2,
      [weaponServiceIdentifier, armorServiceIdentifier],
      undefined,
      taggedConstraint(ninjaEquipmentTag)(true)
    );

    expect(
      container.getAllTagged(weaponServiceIdentifier, ninjaEquipmentTag, true)
        .length
    ).toBe(2);
    expect(
      container.getTagged(armorServiceIdentifier, ninjaEquipmentTag, true)
    ).toBeInstanceOf(Helmet);
  });

  it("Should share singleton instances a binding and its copied binding.", () => {
    let counter = 0;
    const container: Container = new Container();
    const container2: Container = new Container();
    const tag = Symbol("tag");

    @injectable()
    class Shuriken {
      id: number;

      constructor() {
        this.id = counter++;
      }
    }

    container2.bind(Shuriken).toSelf().inSingletonScope();

    container.copyBindings(
      container2,
      [Shuriken],
      undefined,
      taggedConstraint(tag)(true)
    );

    const shuriken1: Shuriken = container.getTagged(Shuriken, tag, true);
    const shuriken2: Shuriken = container2.get(Shuriken);
    expect(shuriken1).toBe(shuriken2);
    expect(shuriken1.id).toBe(shuriken2.id);
  });

  it("Should be able to check is there are tagged bindings available for a given identifier only in current container", () => {
    @injectable()
    class Ninja {}

    const villageTag = Symbol("village");
    const leafVillage = "Leaf Village";
    const containerParent: Container = new Container();
    const containerChild: Container = new Container();

    containerChild.parent = containerParent;

    containerParent
      .bind(Ninja)
      .to(Ninja)
      .whenTargetTagged(villageTag, leafVillage);

    expect(containerParent.isBoundTagged(Ninja, villageTag, leafVillage)).toBe(
      true
    );
    expect(
      containerParent.isCurrentBoundTagged(Ninja, villageTag, leafVillage)
    ).toBe(true);
    expect(containerChild.isBoundTagged(Ninja, villageTag, leafVillage)).toBe(
      true
    );
    expect(
      containerChild.isCurrentBoundTagged(Ninja, villageTag, leafVillage)
    ).toBe(false);
  });

  it("Should be able to check is there are named bindings available for a given identifier only in current container", () => {
    @injectable()
    class Ninja {}

    const ninjaName = "Naruto";
    const containerParent: Container = new Container();
    const containerChild: Container = new Container();

    containerChild.parent = containerParent;

    containerParent.bind(Ninja).to(Ninja).whenTargetNamed(ninjaName);

    expect(containerParent.isBoundNamed(Ninja, ninjaName)).toBe(true);
    expect(containerParent.isCurrentBoundNamed(Ninja, ninjaName)).toBe(true);
    expect(containerChild.isBoundNamed(Ninja, ninjaName)).toBe(true);
    expect(containerChild.isCurrentBoundNamed(Ninja, ninjaName)).toBe(false);
  });

  it("Should bind a service to a container and resolve its dependencies in another container.", () => {
    const container1: Container = new Container();
    const container2: Container = new Container();

    @injectable()
    class Dependency {}

    @injectable()
    class Service {
      constructor(@inject(Dependency) public dependency: Dependency) {}
    }

    container1.bind(Dependency).to(Dependency);
    container2.bind(Service, container1).to(Service);

    const service: Service = container2.resolve(Service);
    expect(service.dependency).toBeInstanceOf(Dependency);
  });
});
