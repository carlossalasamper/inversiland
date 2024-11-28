import { Newable, InversifySugar, module } from "../../src";
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

describe("InversifySugar", () => {
  beforeAll(async () => {
    await InversifySugar.reset();
  });

  beforeEach(async () => {
    await InversifySugar.reset();
  });

  it("InversifySugar.run should be called once.", () => {
    InversifySugar.run(AppModule);
    expect(() => InversifySugar.run(AppModule)).toThrow(
      messagesMap.alreadyRunning
    );
  });

  it("InversifySugar.onModuleBound should be called once per bound module.", () => {
    const onModuleBound = jest.fn();
    const inversifySugarOnModuleBound = jest.spyOn(
      InversifySugar,
      "onModuleBound"
    );

    InversifySugar.options.debug = true;
    InversifySugar.setOnModuleBound(onModuleBound);
    InversifySugar.run(AppModule);

    expect(inversifySugarOnModuleBound).toHaveBeenCalledTimes(
      importedModules.length
    );
    expect(onModuleBound).toHaveBeenCalledTimes(importedModules.length);
  });

  it("Should print a message for each imported module.", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    InversifySugar.options.debug = true;
    InversifySugar.run(AppModule);

    for (const importedModule of importedModules) {
      const metadata = getModuleMetadata(importedModule);

      expect(consoleLogMock).toHaveBeenCalledWith(
        messagesMap.moduleBound(
          importedModule.name,
          metadata.container.innerContainer.id
        )
      );
    }
  });

  it("Should print a message when global providers are bound.", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    InversifySugar.options.debug = true;
    InversifySugar.run(AppModule);

    expect(consoleLogMock).toHaveBeenCalledWith(
      messagesMap.globalProvidersBound(InversifySugar.globalContainer.id)
    );
  });

  it("Should reset InversifySugar even if its not running.", () => {
    InversifySugar.reset();
    expect(() => InversifySugar.run(AppModule)).not.toThrow();
  });
});
