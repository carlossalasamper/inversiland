import { InversifySugar, getModuleContainer, module } from "../../src";
import { DynamicModule } from "../../src/types/Module";
import importDynamicModule from "../../src/importing/importDynamicModule";
import importModule from "../../src/importing/importModule";

describe("importDynamicModule", () => {
  beforeEach(async () => {
    await InversifySugar.reset();
  });

  it("Should import a dynamic module.", () => {
    @module({})
    class Module {}

    const dynamicModule: DynamicModule = {
      module: Module,
      providers: [
        {
          provide: "test",
          useValue: "test",
        },
      ],
    };

    importDynamicModule(dynamicModule);

    expect(getModuleContainer(Module).isBound("test")).toBe(true);
  });

  it("Should import a dynamic module with exports.", () => {
    @module({})
    class Module {}

    const dynamicModule: DynamicModule = {
      module: Module,
      providers: [
        {
          provide: "test",
          useValue: "test",
        },
      ],
      exports: ["test"],
    };

    @module({
      imports: [dynamicModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    expect(getModuleContainer(RootModule).isBound("test")).toBe(true);
  });

  it("Should import a dynamic module with global providers.", () => {
    @module({})
    class Module {}

    const dynamicModule: DynamicModule = {
      module: Module,
      providers: [
        {
          provide: "test",
          useValue: "test",
          isGlobal: true,
        },
      ],
    };

    importDynamicModule(dynamicModule);

    expect(getModuleContainer(Module).isBound("test")).toBe(true);
    expect(InversifySugar.globalContainer.isBound("test")).toBe(true);
  });
});
