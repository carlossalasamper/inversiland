import { Newable, InversifySugar, module } from "../../src";
import messagesMap from "../../src/messages/messagesMap";

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

  it("InversifySugar.onModuleBinded should be called once per binded module.", () => {
    const onModuleBinded = jest.fn();
    const inversifySugarOnModuleBinded = jest.spyOn(
      InversifySugar,
      "onModuleBinded"
    );

    InversifySugar.options.debug = true;
    InversifySugar.setOnModuleBinded(onModuleBinded);
    InversifySugar.run(AppModule);

    expect(inversifySugarOnModuleBinded).toHaveBeenCalledTimes(
      importedModules.length
    );
    expect(onModuleBinded).toHaveBeenCalledTimes(importedModules.length);
  });

  it("Should print a message for each imported module.", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    InversifySugar.options.debug = true;
    InversifySugar.run(AppModule);

    for (const importedModule of importedModules) {
      expect(consoleLogMock).toHaveBeenCalledWith(
        messagesMap.moduleProvidersBinded(importedModule.name)
      );
    }
  });

  it("Should reset InversifySugar even if its not running.", () => {
    InversifySugar.reset();
    expect(() => InversifySugar.run(AppModule)).not.toThrow();
  });
});
