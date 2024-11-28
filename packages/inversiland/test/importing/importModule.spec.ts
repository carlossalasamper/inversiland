import { inject, injectable,InversifySugar, module } from "../../src";
import importModule from "../../src/importing/importModule";
import messagesMap from "../../src/messages/messagesMap";
import getModuleContainer from "../../src/modules/getModuleContainer";

describe("importModule", () => {
  beforeEach(async () => {
    await InversifySugar.reset();
  });

  it("Should import a module that is importing another module.", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    const testModuleContainer = getModuleContainer(TestModule);

    expect(testModuleContainer.get(TestService)).toBeInstanceOf(TestService);
  });

  it("Should import a module with providers.", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
    })
    class RootModule {}

    importModule(RootModule, true);

    expect(getModuleContainer(RootModule).isBound(TestService)).toBe(true);
  });

  it("Should import a module where a provider depends on another provider.", () => {
    @injectable()
    class TestService {}

    @injectable()
    class TestService2 {
      constructor(
        @inject(TestService) public readonly testService: TestService
      ) {}
    }
    @module({
      providers: [TestService, TestService2],
    })
    class ProvidersModule {}

    @module({
      imports: [ProvidersModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    expect(getModuleContainer(ProvidersModule).isBound(TestService2)).toBe(
      true
    );
  });

  it("Should import a module with exports and access exported provider.", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class RootModule {}

    importModule(RootModule);

    expect(getModuleContainer(RootModule).isBound(TestService)).toBe(true);
  });

  it("Should print a warning when importing a class that is not a module.", () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    class NotAModule {}

    @module({
      imports: [NotAModule],
    })
    class ImportsModule {}

    importModule(ImportsModule, true);

    expect(consoleWarnSpy).toBeCalledWith(
      messagesMap.notAModuleImported(NotAModule.name)
    );
  });

  it("Should bind the root module providers to the global container.", () => {
    @module({})
    class TestModule {}

    @injectable()
    class GlobalService {}

    @module({
      imports: [TestModule],
      providers: [GlobalService],
    })
    class RootModule {}

    importModule(RootModule, true);

    expect(InversifySugar.globalContainer.isBound(GlobalService)).toBe(true);
  });

  it("Should bind global providers to the global container.", () => {
    @injectable()
    class GlobalService {}

    @module({
      providers: [{ useClass: GlobalService, isGlobal: true }],
    })
    class GlobalModule {}

    @module({
      imports: [GlobalModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    expect(InversifySugar.globalContainer.isBound(GlobalService)).toBe(true);
  });

  it("Should resolve dependencies of global providers.", () => {
    @injectable()
    class AService {}

    @injectable()
    class BService {
      constructor(@inject(AService) public readonly aService: AService) {}
    }

    @injectable()
    class GlobalService {
      constructor(
        @inject(AService) public readonly aService: AService,
        @inject(BService) public readonly bService: BService
      ) {}
    }

    @module({
      providers: [
        AService,
        BService,
        {
          useClass: GlobalService,
          isGlobal: true,
        },
      ],
    })
    class GlobalModule {}

    @module({
      imports: [GlobalModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    const globalService = InversifySugar.globalContainer.get(GlobalService);

    expect(globalService).toBeInstanceOf(GlobalService);
    expect(globalService.aService).toBeInstanceOf(AService);
    expect(globalService.bService).toBeInstanceOf(BService);
  });

  it("Should resolve dependencies of exported providers.", () => {
    @injectable()
    class AService {}

    @injectable()
    class TestService {
      constructor(@inject(AService) public readonly aService: AService) {}
    }

    @module({
      providers: [AService, TestService],
      exports: [TestService],
    })
    class ExportedServiceModule {}

    @module({
      imports: [ExportedServiceModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    const container = getModuleContainer(RootModule);

    expect(container.get(TestService).aService).toBeInstanceOf(AService);
  });

  it("Should resolve dependencies of DetailedExportedProvider multiple.", () => {
    const ProviderToken = Symbol("ProviderToken");

    @injectable()
    class AService {}

    @injectable()
    class BService {}

    @module({
      providers: [
        {
          provide: ProviderToken,
          useClass: AService,
        },
        {
          provide: ProviderToken,
          useClass: BService,
        },
      ],
      exports: [
        {
          provide: ProviderToken,
        },
      ],
    })
    class MultiExportedProviderModule {}

    @module({
      imports: [MultiExportedProviderModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    const container = getModuleContainer(RootModule);
    const resolvedProviders = container.getAllImported(ProviderToken);

    expect(resolvedProviders).toHaveLength(2);
  });

  it("Shouldn't resolve not exported providers of a imported module.", () => {
    @injectable()
    class AService {}

    @injectable()
    class BService {}

    @injectable()
    class TestService {
      constructor(
        @inject(AService) public readonly aService: AService,
        @inject(BService) public readonly bService: BService
      ) {}
    }

    @module({
      providers: [TestService, AService, BService],
      exports: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    const container = getModuleContainer(RootModule);

    expect(container.isImported(AService)).toBe(false);
    expect(container.isImported(BService)).toBe(false);
  });

  it("Exported providers of a module should be bound to every module that imports it.", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class ExportedServiceModule {}

    @module({
      imports: [ExportedServiceModule],
    })
    class AModule {}

    @module({
      imports: [ExportedServiceModule],
    })
    class BModule {}

    @module({
      imports: [AModule, BModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    expect(getModuleContainer(AModule).isImported(TestService)).toBe(true);
    expect(getModuleContainer(BModule).isImported(TestService)).toBe(true);
  });
});
