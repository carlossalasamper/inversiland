import { DynamicModule } from "../../src";
import getDynamicModuleName from "../../src/messages/getDynamicModuleName";

describe("getDynamicModuleName", () => {
  it("Should return the name of a DynamicModule with the correct format.", () => {
    const dynamicModule: DynamicModule = {
      module: class TestModule {},
      providers: [],
      exports: [],
    };

    const actual = getDynamicModuleName(dynamicModule);
    const expected = "DynamicModule(TestModule)";

    expect(actual).toEqual(expected);
  });
});
