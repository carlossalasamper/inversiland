import { injectable } from "inversify";
import { InversifySugar, getModuleContainer, module } from "../../../src";
import importModule from "../../../src/utils/importing/importModule";
import unbindModule from "../../../src/utils/binding/unbindModule";
import messagesMap from "../../../src/utils/messages/messagesMap";

describe("unbindModule", () => {
  beforeEach(async () => {
    await InversifySugar.reset();
  });

  it("Should unbind a module with imports.", async () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class ImportsModule {}

    importModule(ImportsModule);

    await unbindModule(ImportsModule);

    const testModuleContainer = getModuleContainer(TestModule);

    expect(testModuleContainer.isProvided(TestService)).toBe(false);
  });

  it("Should unbind a module with providers.", async () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
    })
    class ProvidersModule {}

    importModule(ProvidersModule);

    await unbindModule(ProvidersModule);

    expect(getModuleContainer(ProvidersModule).isProvided(TestService)).toBe(
      false
    );
  });

  it("Should unbind a module with exports and not access exported provider.", async () => {
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
    class ExportsModule {}

    importModule(ExportsModule);

    await unbindModule(ExportsModule);

    expect(getModuleContainer(ExportsModule).isImported(TestService)).toBe(
      false
    );
  });

  it("Should print a warning when unbinding a class that is not a module.", async () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    class NotAModule {}

    @module({
      imports: [NotAModule],
    })
    class ImportsModule {}

    await unbindModule(ImportsModule);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      messagesMap.notAModuleUnbinded(NotAModule.name)
    );
  });
});
