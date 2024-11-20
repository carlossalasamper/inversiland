import { inject, injectable } from "inversify";
import { InversifySugar, module } from "../../../src";
import getModuleContainer from "../../../src/utils/modules/getModuleContainer";
import importModule from "../../../src/utils/importing/importModule";
import messagesMap from "../../../src/utils/messages/messagesMap";
import injectProvided from "../../../src/decorators/injectProvided";

@injectable()
class TestService {}

describe("importModule", () => {
  beforeEach(() => {
    InversifySugar.reset();
  });

  it("Should import a module that is importing another module.", () => {
    @module({
      providers: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class ImportsModule {}

    importModule(ImportsModule);

    const testModuleContainer = getModuleContainer(TestModule);

    expect(testModuleContainer.isProvided(TestService)).toBe(true);
  });

  it("Should import a module with providers.", () => {
    @module({
      providers: [TestService],
    })
    class ProvidersModule {}

    importModule(ProvidersModule);

    expect(getModuleContainer(ProvidersModule).isProvided(TestService)).toBe(
      true
    );
  });

  it("Should import a module where a provider depends on another provider.", () => {
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

    expect(getModuleContainer(ProvidersModule).isProvided(TestService2)).toBe(
      true
    );
  });

  it("Should import a module with exports and access exported provider.", () => {
    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class ExportsModule {}

    importModule(ExportsModule);

    expect(getModuleContainer(ExportsModule).isImported(TestService)).toBe(
      true
    );
  });

  it("Should print a warning when importing a class that is not a module.", () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    class NotAModule {}

    @module({
      imports: [NotAModule],
    })
    class ImportsModule {}

    importModule(ImportsModule);

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

  it("Should resolve dependencies of exported providers.", () => {
    @injectable()
    class AService {}

    @injectable()
    class TestService {
      constructor(
        @injectProvided(AService) public readonly aService: AService
      ) {}
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

    expect(container.getImported(TestService).aService).toBeInstanceOf(
      AService
    );
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
          multiple: true,
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
    const resolvedProviders = container.getImported(ProviderToken);

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

  it("Should throw an error when exporting a SingleExportedProvider that is not bound.", () => {
    @injectable()
    class NotBoundService {}

    @module({
      exports: [NotBoundService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class RootModule {}

    expect(() => importModule(RootModule, true)).toThrowError(
      messagesMap.notBoundProviderExported(TestModule.name, NotBoundService)
    );
  });

  it("Should throw an error when exporting a MultiExportedProvider that is not bound.", () => {
    @injectable()
    class NotBoundService {}

    @module({
      exports: [
        {
          provide: NotBoundService,
          multiple: true,
        },
        {
          provide: NotBoundService,
          multiple: true,
        },
      ],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class RootModule {}

    expect(() => importModule(RootModule, true)).toThrowError(
      messagesMap.notBoundProviderExported(TestModule.name, NotBoundService)
    );
  });

  it("Exported providers of a module should be bound to every module that imports it.", () => {
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

  it("Exported providers of a imported module shouldn't be bound to the RootContainer container when deep = false.", () => {
    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class ExportedServiceModule {}

    @module({
      imports: [ExportedServiceModule],
      providers: [TestService],
      exports: [
        {
          provide: TestService,
        },
      ],
    })
    class AModule {}

    @module({
      imports: [AModule],
    })
    class RootModule {}

    importModule(RootModule, false);

    expect(
      getModuleContainer(RootModule).getImported(TestService)
    ).toBeInstanceOf(TestService);
  });
});
