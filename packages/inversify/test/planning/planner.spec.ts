import * as sinon from "sinon";

import { named } from "../../src";
import { interfaces } from "../../src";
import { inject } from "../../src/annotation/inject";
import { injectable } from "../../src/annotation/injectable";
import { multiInject } from "../../src/annotation/multi_inject";
import { tagged } from "../../src/annotation/tagged";
import { targetName } from "../../src/annotation/target_name";
import * as ERROR_MSGS from "../../src/constants/error_msgs";
import { TargetTypeEnum } from "../../src/constants/literal_types";
import { Container } from "../../src/container/container";
import { MetadataReader } from "../../src/planning/metadata_reader";
import { Plan } from "../../src/planning/plan";
import { plan } from "../../src/planning/planner";

describe("Planner", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Should be able to create a basic plan", () => {
    @injectable()
    class KatanaBlade {}

    @injectable()
    class KatanaHandler {}

    @injectable()
    class Katana {
      public handler: KatanaHandler;
      public blade: KatanaBlade;
      constructor(
        @inject("KatanaHandler") @targetName("handler") handler: KatanaHandler,
        @inject("KatanaBlade") @targetName("blade") blade: KatanaBlade
      ) {
        this.handler = handler;
        this.blade = blade;
      }
    }

    @injectable()
    class Shuriken {}

    @injectable()
    class Ninja {
      public katana: Katana;
      public shuriken: Shuriken;
      constructor(
        @inject("Katana") @targetName("katana") katana: Katana,
        @inject("Shuriken") @targetName("shuriken") shuriken: Shuriken
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const ninjaId = "Ninja";
    const shurikenId = "Shuriken";
    const katanaId = "Katana";
    const katanaHandlerId = "KatanaHandler";
    const katanaBladeId = "KatanaBlade";

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Shuriken>(shurikenId).to(Shuriken);
    container.bind<Katana>(katanaId).to(Katana);
    container.bind<KatanaBlade>(katanaBladeId).to(KatanaBlade);
    container.bind<KatanaHandler>(katanaHandlerId).to(KatanaHandler);

    // Actual
    const actualPlan: Plan = plan(
      new MetadataReader(),
      container,
      false,
      TargetTypeEnum.Variable,
      ninjaId
    ).plan;
    const actualNinjaRequest: interfaces.Request = actualPlan.rootRequest;
    const actualKatanaRequest: interfaces.Request | undefined =
      actualNinjaRequest.childRequests[0];
    const actualKatanaHandlerRequest: interfaces.Request | undefined =
      actualKatanaRequest?.childRequests[0];
    const actualKatanaBladeRequest: interfaces.Request | undefined =
      actualKatanaRequest?.childRequests[1];
    const actualShurikenRequest: interfaces.Request | undefined =
      actualNinjaRequest.childRequests[1];

    expect(actualNinjaRequest.serviceIdentifier).toBe(ninjaId);
    expect(actualNinjaRequest.childRequests.length).toBe(2);

    // Katana
    expect(actualKatanaRequest?.serviceIdentifier).toBe(katanaId);
    expect(actualKatanaRequest?.bindings.length).toBe(1);
    expect(actualKatanaRequest?.target.serviceIdentifier).toBe(katanaId);
    expect(actualKatanaRequest?.childRequests.length).toBe(2);

    // KatanaHandler
    expect(actualKatanaHandlerRequest?.serviceIdentifier).toBe(katanaHandlerId);
    expect(actualKatanaHandlerRequest?.bindings.length).toBe(1);
    expect(actualKatanaHandlerRequest?.target.serviceIdentifier).toBe(
      katanaHandlerId
    );

    // KatanaBlade
    expect(actualKatanaBladeRequest?.serviceIdentifier).toBe(katanaBladeId);
    expect(actualKatanaBladeRequest?.bindings.length).toBe(1);
    expect(actualKatanaBladeRequest?.target.serviceIdentifier).toBe(
      katanaBladeId
    );

    // Shuriken
    expect(actualShurikenRequest?.serviceIdentifier).toBe(shurikenId);
    expect(actualShurikenRequest?.bindings.length).toBe(1);
    expect(actualShurikenRequest?.target.serviceIdentifier).toBe(shurikenId);
  });

  it("Should throw when circular dependencies found", () => {
    @injectable()
    class D {
      public a: unknown;
      constructor(@inject("A") a: unknown) {
        this.a = a;
      }
    }

    @injectable()
    class C {
      public d: unknown;
      constructor(@inject("D") d: unknown) {
        this.d = d;
      }
    }

    @injectable()
    class B {}

    @injectable()
    class A {
      public b: unknown;
      public c: unknown;
      constructor(@inject("B") b: unknown, @inject("C") c: unknown) {
        this.b = b;
        this.c = c;
      }
    }

    const aId = "A";
    const bId = "B";
    const cId = "C";
    const dId = "D";

    const container: Container = new Container();
    container.bind(aId).to(A);
    container.bind(bId).to(B);
    container.bind(cId).to(C);
    container.bind(dId).to(D);

    const throwErrorFunction: () => void = () => {
      container.get(aId);
    };

    expect(throwErrorFunction).toThrow(
      `${ERROR_MSGS.CIRCULAR_DEPENDENCY} A --> C --> D --> A`
    );
  });

  it("Should only plan sub-dependencies when binding type is BindingType.Instance", () => {
    @injectable()
    class KatanaBlade {}

    @injectable()
    class KatanaHandler {}

    @injectable()
    class Katana {
      public handler: KatanaHandler;
      public blade: KatanaBlade;
      constructor(
        @inject("KatanaHandler") @targetName("handler") handler: KatanaHandler,
        @inject("KatanaBlade") @targetName("blade") blade: KatanaBlade
      ) {
        this.handler = handler;
        this.blade = blade;
      }
    }

    @injectable()
    class Shuriken {}

    @injectable()
    class Ninja {
      public katanaFactory: interfaces.Factory<Katana>;
      public shuriken: Shuriken;
      constructor(
        @inject("Factory<Katana>")
        @targetName("katanaFactory")
        katanaFactory: interfaces.Factory<Katana>,
        @inject("Shuriken") @targetName("shuriken") shuriken: Shuriken
      ) {
        this.katanaFactory = katanaFactory;
        this.shuriken = shuriken;
      }
    }

    const ninjaId = "Ninja";
    const shurikenId = "Shuriken";
    const katanaId = "Katana";
    const katanaHandlerId = "KatanaHandler";
    const katanaBladeId = "KatanaBlade";
    const katanaFactoryId = "Factory<Katana>";

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Shuriken>(shurikenId).to(Shuriken);
    container.bind<Katana>(katanaBladeId).to(Katana);
    container.bind<KatanaBlade>(katanaBladeId).to(KatanaBlade);
    container.bind<KatanaHandler>(katanaHandlerId).to(KatanaHandler);
    container
      .bind<interfaces.Factory<Katana>>(katanaFactoryId)
      .toFactory<Katana>(
        (context: interfaces.Context) => () =>
          context.container.get<Katana>(katanaId)
      );

    const actualPlan: Plan = plan(
      new MetadataReader(),
      container,
      false,
      TargetTypeEnum.Variable,
      ninjaId
    ).plan;

    expect(actualPlan.rootRequest.serviceIdentifier).toBe(ninjaId);
    expect(actualPlan.rootRequest.childRequests[0]?.serviceIdentifier).toBe(
      katanaFactoryId
    );
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests.length).toBe(
      0
    ); // IMPORTANT!
    expect(actualPlan.rootRequest.childRequests[1]?.serviceIdentifier).toBe(
      shurikenId
    );
    expect(actualPlan.rootRequest.childRequests[1]?.childRequests.length).toBe(
      0
    );
    expect(actualPlan.rootRequest.childRequests[2]).toBeUndefined();
  });

  it("Should generate plans with multi-injections", () => {
    @injectable()
    class Katana {}

    @injectable()
    class Shuriken {}

    @injectable()
    class Ninja implements Ninja {
      public katana: unknown;
      public shuriken: unknown;
      constructor(
        @multiInject("Weapon")
        @targetName("weapons")
        weapons: [unknown, unknown]
      ) {
        [this.katana, this.shuriken] = weapons;
      }
    }

    const ninjaId = "Ninja";
    const weaponId = "Weapon";

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind(weaponId).to(Shuriken);
    container.bind(weaponId).to(Katana);

    const actualPlan: Plan = plan(
      new MetadataReader(),
      container,
      false,
      TargetTypeEnum.Variable,
      ninjaId
    ).plan;

    // root request has no target
    expect(actualPlan.rootRequest.serviceIdentifier).toBe(ninjaId);
    expect(actualPlan.rootRequest.target.serviceIdentifier).toBe(ninjaId);
    expect(actualPlan.rootRequest.target.isArray()).toBe(false);

    // root request should only have one child request with target weapons/Weapon[]
    expect(actualPlan.rootRequest.childRequests[0]?.serviceIdentifier).toBe(
      "Weapon"
    );
    expect(actualPlan.rootRequest.childRequests[1]).toBeUndefined();
    expect(actualPlan.rootRequest.childRequests[0]?.target.name.value()).toBe(
      "weapons"
    );
    expect(
      actualPlan.rootRequest.childRequests[0]?.target.serviceIdentifier
    ).toBe("Weapon");
    expect(actualPlan.rootRequest.childRequests[0]?.target.isArray()).toBe(
      true
    );

    // child request should have two child requests with targets weapons/Weapon[] but bindings Katana and Shuriken
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests.length).toBe(
      2
    );

    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[0]
        ?.serviceIdentifier
    ).toBe(weaponId);
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.target.name.value()
    ).toBe("weapons");
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.target
        .serviceIdentifier
    ).toBe("Weapon");
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.target.isArray()
    ).toBe(true);
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[0]
        ?.serviceIdentifier
    ).toBe("Weapon");
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.bindings[0]
        ?.serviceIdentifier
    ).toBe("Weapon");

    const shurikenImplementationType: NewableFunction = actualPlan.rootRequest
      .childRequests[0]?.childRequests[0]?.bindings[0]
      ?.implementationType as NewableFunction;

    expect(shurikenImplementationType.name).toBe("Shuriken");

    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[1]
        ?.serviceIdentifier
    ).toBe(weaponId);
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.target.name.value()
    ).toBe("weapons");
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.target
        .serviceIdentifier
    ).toBe("Weapon");
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.target.isArray()
    ).toBe(true);
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[1]
        ?.serviceIdentifier
    ).toBe("Weapon");
    expect(
      actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.bindings[0]
        ?.serviceIdentifier
    ).toBe("Weapon");
    const katanaImplementationType: NewableFunction = actualPlan.rootRequest
      .childRequests[0]?.childRequests[1]?.bindings[0]
      ?.implementationType as NewableFunction;

    expect(katanaImplementationType.name).toBe("Katana");
  });

  it("Should throw when no matching bindings are found", () => {
    @injectable()
    class Katana {}

    @injectable()
    class Shuriken {}

    @injectable()
    class Ninja {
      public katana: Katana;
      public shuriken: Shuriken;
      constructor(
        @inject("Katana") @targetName("katana") katana: Katana,
        @inject("Shuriken") @targetName("shuriken") shuriken: Shuriken
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const ninjaId = "Ninja";
    const shurikenId = "Shuriken";

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Shuriken>(shurikenId).to(Shuriken);

    const throwFunction: () => void = () => {
      plan(
        new MetadataReader(),
        container,
        false,
        TargetTypeEnum.Variable,
        ninjaId
      );
    };

    expect(throwFunction).toThrow(
      `${ERROR_MSGS.NOT_REGISTERED(container.id)} Katana`
    );
  });

  it("Should throw when an ambiguous match is found", () => {
    @injectable()
    class Katana {}

    @injectable()
    class SharpKatana {}

    class Shuriken {}

    @injectable()
    class Ninja {
      public katana: Katana;
      public shuriken: Shuriken;
      constructor(
        @inject("Katana") katana: Katana,
        @inject("Shuriken") shuriken: Shuriken
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const ninjaId = "Ninja";
    const katanaId = "Katana";
    const shurikenId = "Shuriken";

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Katana>(katanaId).to(Katana);
    container.bind<Katana>(katanaId).to(SharpKatana);
    container.bind<Shuriken>(shurikenId).to(Shuriken);

    const throwFunction: () => void = () => {
      plan(
        new MetadataReader(),
        container,
        false,
        TargetTypeEnum.Variable,
        ninjaId
      );
    };

    expect(throwFunction).toThrow(
      `${ERROR_MSGS.AMBIGUOUS_MATCH(container.id)} Katana`
    );
  });

  it("Should apply constrains when an ambiguous match is found", () => {
    @injectable()
    class Katana {}

    @injectable()
    class Shuriken {}

    const ninjaId = "Ninja";
    const weaponId = "Weapon";

    @injectable()
    class Ninja implements Ninja {
      public katana: unknown;
      public shuriken: unknown;
      constructor(
        @inject(weaponId)
        @targetName("katana")
        @tagged("canThrow", false)
        katana: unknown,
        @inject(weaponId)
        @targetName("shuriken")
        @tagged("canThrow", true)
        shuriken: unknown
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const container: Container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind(weaponId).to(Katana).whenTargetTagged("canThrow", false);
    container.bind(weaponId).to(Shuriken).whenTargetTagged("canThrow", true);

    const actualPlan: Plan = plan(
      new MetadataReader(),
      container,
      false,
      TargetTypeEnum.Variable,
      ninjaId
    ).plan;

    // root request has no target
    expect(actualPlan.rootRequest.serviceIdentifier).toBe(ninjaId);
    expect(actualPlan.rootRequest.target.serviceIdentifier).toBe(ninjaId);
    expect(actualPlan.rootRequest.target.isArray()).toBe(false);

    // root request should have 2 child requests
    expect(actualPlan.rootRequest.childRequests[0]?.serviceIdentifier).toBe(
      weaponId
    );
    expect(actualPlan.rootRequest.childRequests[0]?.target.name.value()).toBe(
      "katana"
    );
    expect(
      actualPlan.rootRequest.childRequests[0]?.target.serviceIdentifier
    ).toBe(weaponId);

    expect(actualPlan.rootRequest.childRequests[1]?.serviceIdentifier).toBe(
      weaponId
    );
    expect(actualPlan.rootRequest.childRequests[1]?.target.name.value()).toBe(
      "shuriken"
    );
    expect(
      actualPlan.rootRequest.childRequests[1]?.target.serviceIdentifier
    ).toBe(weaponId);

    expect(actualPlan.rootRequest.childRequests[2]).toBeUndefined();
  });

  it("Should not throw when a class has a missing @injectable annotation", () => {
    class Katana {}

    const container: Container = new Container();
    container.bind("Weapon").to(Katana);

    const throwFunction: () => void = () => {
      plan(
        new MetadataReader(),
        container,
        false,
        TargetTypeEnum.Variable,
        "Weapon"
      );
    };

    expect(throwFunction).not.toThrow();
  });

  it("Should throw when apply a metadata decorator without @inject or @multiInject", () => {
    @injectable()
    class Ninja {
      @named("name")
      public set weapon(_weapon: unknown) {
        // noop
      }
    }

    class Katana {}

    const container: Container = new Container();
    container.bind("Weapon").to(Katana);
    container.bind(Ninja).toSelf();

    const throwFunction: () => void = () => {
      plan(
        new MetadataReader(),
        container,
        false,
        TargetTypeEnum.Variable,
        Ninja
      );
    };

    expect(throwFunction).toThrow(
      'Expected a single @inject, @multiInject or @unmanaged decorator at type "Ninja" at property "weapon"'
    );
  });

  it("Should ignore checking base classes for @injectable when skipBaseClassChecks is set on the container", () => {
    class Test {}

    @injectable()
    class Test2 extends Test {}

    const container: Container = new Container({ skipBaseClassChecks: true });
    container.bind(Test2).toSelf();
    container.get(Test2);
  });

  it("Should ignore checking base classes for @injectable on resolve when skipBaseClassChecks is set", () => {
    class Test {}

    @injectable()
    class Test2 extends Test {}

    const container: Container = new Container({ skipBaseClassChecks: true });
    container.resolve(Test2);
  });

  it("Should throw when an class has a missing @inject annotation", () => {
    interface Sword {
      damage: number;
    }

    @injectable()
    class Katana implements Sword {
      public readonly damage: number = 20;
    }

    @injectable()
    class Ninja {
      public katana: Katana;

      constructor(katana: Sword) {
        this.katana = katana;
      }
    }

    const container: Container = new Container();
    container.bind("Warrior").to(Ninja);
    container.bind<Sword>("Sword").to(Katana);

    const throwFunction: () => void = () => {
      plan(
        new MetadataReader(),
        container,
        false,
        TargetTypeEnum.Variable,
        "Warrior"
      );
    };

    expect(throwFunction).toThrow(
      "No matching bindings found for serviceIdentifier: Object"
    );
  });

  it("Should throw when a function has a missing @inject annotation", () => {
    interface Sword {
      damage: number;
    }

    @injectable()
    class Katana implements Sword {
      public readonly damage: number = 20;
    }

    @injectable()
    class Ninja {
      public katana: Katana;

      constructor(katanaFactory: () => Katana) {
        this.katana = katanaFactory();
      }
    }

    const container: Container = new Container();
    container.bind<Ninja>("Ninja").to(Ninja);
    container.bind<Katana>("Katana").to(Katana);
    container.bind<Katana>("Factory<Katana>").to(Katana);

    const throwFunction: () => void = () => {
      plan(
        new MetadataReader(),
        container,
        false,
        TargetTypeEnum.Variable,
        "Ninja"
      );
    };

    expect(throwFunction).toThrow(
      `No matching bindings found for serviceIdentifier: Function
Trying to resolve bindings for "Ninja"`
    );
  });
});
