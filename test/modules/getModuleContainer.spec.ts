import { injectable } from "@carlossalasamper/inversify";
import { ModuleContainer, getModuleContainer, module } from "../../src";
import importModule from "../../src/importing/importModule";

@injectable()
class TestService {}

describe("getModuleContainer", () => {
  it("Should return a ModuleContainer.", () => {
    @module({
      providers: [TestService],
    })
    class TestModule {}

    importModule(TestModule);

    expect(getModuleContainer(TestModule)).toBeInstanceOf(ModuleContainer);
  });
});
