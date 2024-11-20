import { Newable, InversifySugar, module } from "../../src";
import messagesMap from "../../src/utils/messages/messagesMap";
import inversifySugarOptions from "../../src/utils/inversifySugarOptions";

@module({})
class ModuleA {}
@module({})
class ModuleB {}

const appModuleImports: Newable[] = [ModuleA, ModuleB];

@module({
  imports: appModuleImports,
})
class AppModule {}

const importedModules = appModuleImports.concat(AppModule);

describe("InversifySugar", () => {
  const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
  const inversifySugarOnModuleBinded = jest.spyOn(
    InversifySugar,
    "onModuleBinded"
  );
  const onModuleBinded = jest.fn();

  beforeEach(async () => {
    await InversifySugar.reset();
    InversifySugar.setOnModuleBinded(onModuleBinded);
    inversifySugarOptions.debug = true;
  });

  it("InversifySugar.run should be called once.", () => {
    InversifySugar.run(AppModule);
    expect(() => InversifySugar.run(AppModule)).toThrow(
      messagesMap.alreadyRunning
    );
  });

  it("InversifySugar.onModuleBinded should be called once per binded module.", () => {
    expect(inversifySugarOnModuleBinded).toHaveBeenCalledTimes(
      importedModules.length
    );
    expect(onModuleBinded).toHaveBeenCalledTimes(importedModules.length);
  });

  it("Should print a message for each imported module.", () => {
    for (const importedModule of importedModules) {
      expect(consoleLogMock).toHaveBeenCalledWith(
        messagesMap.moduleProvidersBinded(importedModule.name)
      );
    }
  });

  it("Should reset InversifySugar even if its nto running", () => {
    InversifySugar.reset();
    expect(() => InversifySugar.run(AppModule)).not.toThrow();
  });
});
