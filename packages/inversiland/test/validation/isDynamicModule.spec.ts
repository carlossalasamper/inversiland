import { DynamicModule } from "../../src/types/Module";
import isDynamicModule from "../../src/validation/isDynamicModule";

describe("isDynamicModule", () => {
  it("Should return true if the object is a DynamicModule.", () => {
    const dynamicModule: DynamicModule = {
      module: class {},
      providers: [],
    };

    expect(isDynamicModule(dynamicModule)).toBe(true);
  });

  it("Should return false if the object is not a DynamicModule.", () => {
    const notDynamicModules: unknown[] = [
      class {},
      undefined,
      null,
      0,
      "",
      false,
      {},
    ];

    notDynamicModules.forEach((data) => {
      expect(isDynamicModule(data)).toBe(false);
    });
  });
});
