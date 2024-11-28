import {
  DynamicModule,
  getModuleContainer,
  InversifySugar,
  module,
} from "../../src";
import bindImportsToModule from "../../src/importing/bindImportsToModule";

describe("bindImportsToModule", () => {
  afterEach(async () => {
    await InversifySugar.reset();
  });

  it("Should bind a NewableModule to a module.", () => {
    @module({
      providers: [
        {
          provide: "test",
          useValue: "test",
        },
      ],
      exports: ["test"],
    })
    class Module {}

    @module({})
    class RootModule {}

    bindImportsToModule(RootModule, [Module]);

    const container = getModuleContainer(RootModule);

    expect(container.isImported("test")).toBeTruthy();
  });

  it("Should bind a DynamicModule to a module.", () => {
    @module({})
    class RootModule {}

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

    bindImportsToModule(RootModule, [dynamicModule]);

    const container = getModuleContainer(RootModule);

    expect(container.isImported("test")).toBeTruthy();
  });

  it("Should reexport providers when a module with exports deep is imported.", () => {
    @module({
      providers: [
        {
          provide: "test",
          useValue: "test",
        },
      ],
      exports: ["test"],
    })
    class ModuleA {}

    @module({
      imports: [ModuleA],
      exports: [
        {
          provide: "test",
          deep: true,
        },
      ],
    })
    class ModuleB {}

    @module({})
    class RootModule {}

    bindImportsToModule(RootModule, [ModuleB]);

    const container = getModuleContainer(RootModule);

    expect(container.isImported("test")).toBeTruthy();
  });

  it("Should bind a DynamicModule to a module with a deep export.", () => {
    @module({})
    class RootModule {}

    const dynamicModule: DynamicModule = {
      module: RootModule,
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
      exports: [
        {
          provide: "test",
          deep: true,
        },
      ],
    })
    class Module {}

    bindImportsToModule(RootModule, [Module]);

    const container = getModuleContainer(RootModule);

    expect(container.isImported("test")).toBeTruthy();
  });
});
