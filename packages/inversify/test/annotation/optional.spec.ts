import { Container, inject, injectable, optional } from "../../src";

describe("@optional", () => {
  it("Should allow to flag dependencies as optional", () => {
    @injectable()
    class Katana {
      public name: string;
      constructor() {
        this.name = "Katana";
      }
    }

    @injectable()
    class Shuriken {
      public name: string;
      constructor() {
        this.name = "Shuriken";
      }
    }

    @injectable()
    class Ninja {
      public name: string;
      public katana: Katana;
      public shuriken: Shuriken;
      constructor(
        @inject("Katana") katana: Katana,
        @inject("Shuriken") @optional() shuriken: Shuriken
      ) {
        this.name = "Ninja";
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const container: Container = new Container();

    container.bind<Katana>("Katana").to(Katana);
    container.bind<Ninja>("Ninja").to(Ninja);

    let ninja: Ninja = container.get("Ninja");
    expect(ninja.name).toBe("Ninja");
    expect(ninja.katana.name).toBe("Katana");
    expect(ninja.shuriken).toBeUndefined();

    container.bind<Shuriken>("Shuriken").to(Shuriken);

    ninja = container.get("Ninja");
    expect(ninja.name).toBe("Ninja");
    expect(ninja.katana.name).toBe("Katana");
    expect(ninja.shuriken.name).toBe("Shuriken");
  });

  it("Should allow to set a default value for dependencies flagged as optional", () => {
    @injectable()
    class Katana {
      public name: string;
      constructor() {
        this.name = "Katana";
      }
    }

    @injectable()
    class Shuriken {
      public name: string;
      constructor() {
        this.name = "Shuriken";
      }
    }

    @injectable()
    class Ninja {
      public name: string;
      public katana: Katana;
      public shuriken: Shuriken;
      constructor(
        @inject("Katana") katana: Katana,
        @inject("Shuriken")
        @optional()
        shuriken: Shuriken = { name: "DefaultShuriken" }
      ) {
        this.name = "Ninja";
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const container: Container = new Container();

    container.bind<Katana>("Katana").to(Katana);
    container.bind<Ninja>("Ninja").to(Ninja);

    let ninja: Ninja = container.get("Ninja");
    expect(ninja.name).toBe("Ninja");
    expect(ninja.katana.name).toBe("Katana");
    expect(ninja.shuriken.name).toBe("DefaultShuriken");

    container.bind<Shuriken>("Shuriken").to(Shuriken);

    ninja = container.get<Ninja>("Ninja");
    expect(ninja.name).toBe("Ninja");
    expect(ninja.katana.name).toBe("Katana");
    expect(ninja.shuriken.name).toBe("Shuriken");
  });

  it("Should allow to set a default value for class property dependencies flagged as optional", () => {
    @injectable()
    class Katana {
      public name: string;
      constructor() {
        this.name = "Katana";
      }
    }

    @injectable()
    class Shuriken {
      public name: string;
      constructor() {
        this.name = "Shuriken";
      }
    }

    @injectable()
    class Ninja {
      @inject("Katana") public katana?: Katana;
      @inject("Shuriken") @optional() public shuriken: Shuriken = {
        name: "DefaultShuriken",
      };
      public name = "Ninja";
    }

    const container: Container = new Container();

    container.bind<Katana>("Katana").to(Katana);
    container.bind<Ninja>("Ninja").to(Ninja);

    let ninja: Ninja = container.get("Ninja");

    expect(ninja.name).toBe("Ninja");
    expect(ninja.katana?.name).toBe("Katana");
    expect(ninja.shuriken.name).toBe("DefaultShuriken");

    container.bind<Shuriken>("Shuriken").to(Shuriken);

    ninja = container.get("Ninja");
    expect(ninja.name).toBe("Ninja");
    expect(ninja.katana?.name).toBe("Katana");
    expect(ninja.shuriken.name).toBe("Shuriken");
  });
});
