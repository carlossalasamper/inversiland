import { getModuleContainer, injectable, Inversiland, module } from "../../src";
import importModule from "../../src/importing/importModule";

describe("ModuleContainer", () => {
  afterEach(async () => {
    await Inversiland.reset();
  });

  it("isBound() should return true if the service is a bound provider.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isBound("test")).toBe(true);
  });

  it("isBound() should return true if the service is a bound imported provider.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
      exports: ["test"],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isBound("test")).toBe(true);
  });

  it("isBound() should return true if the service is a globally bound provider.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test", isGlobal: true }],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isBound("test")).toBe(true);
  });

  it("isBound() should return false if the service is not a bound provider or imported provider.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isBound("test2")).toBe(false);
  });

  it("isCurrentBound() should return true only if the service is bound to the current container", () => {
    @injectable()
    class Shuriken {}

    @injectable()
    class Katana {}

    @module({
      providers: [{ useClass: Shuriken, isGlobal: true }],
    })
    class ShurikenModule {}

    @module({
      imports: [ShurikenModule],
      providers: [Katana],
    })
    class KatanaModule {}

    importModule(KatanaModule);

    const container = getModuleContainer(KatanaModule);

    expect(container.isBound(Shuriken)).toBe(true);
    expect(container.isCurrentBound(Shuriken)).toBe(false);
    expect(container.isCurrentBound(Katana)).toBe(true);
  });

  it("isCurrentProvided() should return true only if the service is provided by the current container.", () => {
    @injectable()
    class Shuriken {}

    @injectable()
    class Katana {}

    @module({
      providers: [{ useClass: Shuriken, isGlobal: true }],
    })
    class ShurikenModule {}

    @module({
      imports: [ShurikenModule],
      providers: [Katana],
    })
    class KatanaModule {}

    importModule(KatanaModule);

    const container = getModuleContainer(KatanaModule);

    expect(container.isProvided(Shuriken)).toBe(true);
    expect(container.isCurrentProvided(Shuriken)).toBe(false);
    expect(container.isCurrentProvided(Katana)).toBe(true);
  });

  it("isCurrentImported() should return true only if the service is imported by the current container.", () => {
    @injectable()
    class Shuriken {}

    @injectable()
    class Katana {}

    @module({
      providers: [Shuriken],
      exports: [Shuriken],
    })
    class ShurikenModule {}

    @module({
      imports: [ShurikenModule],
      providers: [Katana],
    })
    class KatanaModule {}

    importModule(KatanaModule);

    const katanaContainer = getModuleContainer(KatanaModule);

    expect(katanaContainer.isImported(Shuriken)).toBe(true);
    expect(katanaContainer.isCurrentImported(Shuriken)).toBe(true);
    expect(katanaContainer.isCurrentImported(Katana)).toBe(false);
  });

  it("isProvided() should return true if the service is provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isProvided("test")).toBe(true);
  });

  it("isProvided() should return false if the service is not provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isProvided("test2")).toBe(false);
  });

  it("isImported() should return true if the service is imported.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
      exports: ["test"],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isImported("test")).toBe(true);
  });

  it("isImported() should return false if the service is not imported.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
      exports: ["test"],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isImported("test2")).toBe(false);
  });

  it("get() should get a service by service identifier.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.get("test")).toBe("test");
  });

  it("get() should throw an error if the service is not provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(() => container.get("test2")).toThrow();
  });

  it("getAll() should get all services by service identifier.", () => {
    @module({
      providers: [
        {
          provide: "test",
          useValue: "test",
        },
        {
          provide: "test",
          useValue: "test2",
        },
      ],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getAll("test")).toHaveLength(2);
  });

  it("getProvided() should get a provided service by service identifier.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getProvided("test")).toBe("test");
  });

  it("getProvided() should throw an error if the service is not provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(() => container.getProvided("test2")).toThrow();
  });

  it("getAllProvided() should get all provided services by service identifier.", () => {
    @module({
      providers: [
        {
          provide: "test",
          useValue: "test",
        },
        {
          provide: "test",
          useValue: "test2",
        },
        {
          provide: "test2",
          useValue: "test2",
        },
      ],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getAllProvided("test")).toHaveLength(2);
  });

  it("getAllProvided() should throw an error if the service is not provided.", () => {
    @module({})
    class RootModule {}

    importModule(RootModule);

    const container = getModuleContainer(RootModule);

    expect(() => container.getAllProvided("test")).toThrow();
  });

  it("getImported() should get an imported service by service identifier.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
      exports: ["test"],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getImported("test")).toBe("test");
  });

  it("getAllImported() should get all imported services by service identifier.", () => {
    @module({
      providers: [
        {
          provide: "test",
          useValue: "test",
        },
        {
          provide: "test",
          useValue: "test2",
        },
      ],
      exports: ["test"],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getAllImported("test")).toHaveLength(2);
  });

  it("getAllImported() should throw an error if the service is not imported.", () => {
    @module({})
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class AppModule {}

    importModule(AppModule);

    const container = getModuleContainer(AppModule);

    expect(() => container.getAllImported("test")).toThrow();
  });
});
