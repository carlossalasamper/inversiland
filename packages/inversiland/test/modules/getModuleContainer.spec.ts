import { injectable } from "@inversiland/inversify";

import { getModuleContainer, module, ModuleContainer } from "../../src";
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
