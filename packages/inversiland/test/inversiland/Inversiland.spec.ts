import { Inversiland, module, Newable } from "../../src";
import messagesMap from "../../src/messages/messagesMap";
import { getModuleMetadata } from "../../src/metadata/getModuleMetadata";

@module({})
class ModuleA {}
@module({})
class ModuleB {}

@module({})
class ModuleC {}

const appModuleImports: Newable[] = [ModuleA, ModuleB, ModuleC];

@module({
  imports: appModuleImports,
})
class AppModule {}

const importedModules = appModuleImports.concat(AppModule);

describe("Inversiland", () => {
  beforeAll(async () => {
    await Inversiland.reset();
  });

  beforeEach(async () => {
    await Inversiland.reset();
  });

  it("Inversiland.run should be called once.", () => {
    Inversiland.run(AppModule);
    expect(() => Inversiland.run(AppModule)).toThrow(
      messagesMap.alreadyRunning
    );
  });

  it("Inversiland.onModuleBound should be called once per bound module.", () => {
    const onModuleBound = jest.fn();
    const inversilandOnModuleBound = jest.spyOn(Inversiland, "onModuleBound");

    Inversiland.setOnModuleBound(onModuleBound);
    Inversiland.run(AppModule);

    expect(inversilandOnModuleBound).toHaveBeenCalledTimes(
      importedModules.length
    );
    expect(onModuleBound).toHaveBeenCalledTimes(importedModules.length);
  });

  it("Should print a message for each imported module when logLevel is 'info'.", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    Inversiland.options.logLevel = "info";
    Inversiland.run(AppModule);

    for (const importedModule of importedModules) {
      const metadata = getModuleMetadata(importedModule);

      expect(consoleLogMock).toHaveBeenCalledWith(
        messagesMap.moduleBound(
          importedModule.name,
          metadata.container.innerContainer.id,
          Inversiland.options.logLevel
        )
      );
    }
  });

  it("Should print a message for each imported module when logLevel is 'debug'.", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    Inversiland.options.logLevel = "debug";
    Inversiland.run(AppModule);

    for (const importedModule of importedModules) {
      const metadata = getModuleMetadata(importedModule);

      expect(consoleLogMock).toHaveBeenCalledWith(
        messagesMap.moduleBound(
          importedModule.name,
          metadata.container.innerContainer.id,
          Inversiland.options.logLevel
        )
      );
    }
  });

  it("Shouldn't print a message for each imported module when logLevel is 'none'.", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    Inversiland.options.logLevel = "none";
    Inversiland.run(AppModule);

    for (const importedModule of importedModules) {
      const metadata = getModuleMetadata(importedModule);

      expect(consoleLogMock).not.toHaveBeenCalledWith(
        messagesMap.moduleBound(
          importedModule.name,
          metadata.container.innerContainer.id,
          Inversiland.options.logLevel
        )
      );
    }
  });

  it("Should print a message when global providers are bound and logLevel is 'info'.", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    Inversiland.options.logLevel = "info";
    Inversiland.run(AppModule);

    expect(consoleLogMock).toHaveBeenCalledWith(
      messagesMap.globalProvidersBound(
        Inversiland.globalContainer.id,
        Inversiland.options.logLevel
      )
    );
  });

  it("Should print a message when global providers are bound and logLevel is 'debug'.", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    Inversiland.options.logLevel = "debug";
    Inversiland.run(AppModule);

    expect(consoleLogMock).toHaveBeenCalledWith(
      messagesMap.globalProvidersBound(
        Inversiland.globalContainer.id,
        Inversiland.options.logLevel
      )
    );
  });

  it("Shouldn't print a message when global providers are bound and logLevel is 'none'.", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    Inversiland.options.logLevel = "none";
    Inversiland.run(AppModule);

    expect(consoleLogMock).not.toHaveBeenCalledWith(
      messagesMap.globalProvidersBound(
        Inversiland.globalContainer.id,
        Inversiland.options.logLevel
      )
    );
  });

  it("Should reset Inversiland even if its not running.", (done) => {
    expect(() =>
      Inversiland.reset().then(() => {
        done();
      })
    ).not.toThrow();
  });
});
