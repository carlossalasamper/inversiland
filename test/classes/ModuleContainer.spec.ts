import { InversifySugar, getModuleContainer, module } from "../../src";

describe("ModuleContainer", () => {
  beforeEach(() => {
    InversifySugar.reset();
  });

  it("isBound() should return true if the service is a bound provider.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

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

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isBound("test")).toBe(true);
  });

  it("isBound() should return false if the service is not a bound provider or imported provider.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isBound("test2")).toBe(false);
  });

  it("isProvided() should return true if the service is provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isProvided("test")).toBe(true);
  });

  it("isProvided() should return false if the service is not provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

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

    InversifySugar.run(AppModule);

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

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.isImported("test2")).toBe(false);
  });

  it("get() should get a service by service identifier.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.get("test")).toBe("test");
  });

  it("get() should throw an error if the service is not provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

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

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getAll("test")).toHaveLength(2);
  });

  it("getProvided() should get a provided service by service identifier.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getProvided("test")).toBe("test");
  });

  it("getProvided() should throw an error if the service is not provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

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

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getAllProvided("test")).toHaveLength(2);
  });

  it("getAllProvided() should throw an error if the service is not provided.", () => {
    @module({
      providers: [{ provide: "test", useValue: "test" }],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(() => container.getAllProvided("test2")).toThrow();
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

    InversifySugar.run(AppModule);

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

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.getAllImported("test")).toHaveLength(2);
  });
});
