import { InversifySugar, getModuleContainer, module } from "../../../src";
import { DynamicModule } from "../../../src/types/Module";
import importDynamicModule from "../../../src/utils/importing/importDynamicModule";

describe("importDynamicModule", () => {
  it("should import a dynamic module", () => {
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

    const exportedProviderRefs = importDynamicModule(dynamicModule);

    expect(getModuleContainer(Module).isProvided("test")).toBe(true);
    expect(exportedProviderRefs).toHaveLength(1);
    expect(exportedProviderRefs[0].provide).toBe("test");
    expect(exportedProviderRefs[0].getValue()).toBe("test");
  });

  it("should import a dynamic module without exports", () => {
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

    const exportedProviderRefs = importDynamicModule(dynamicModule);

    expect(getModuleContainer(Module).isProvided("test")).toBe(true);
    expect(exportedProviderRefs).toHaveLength(0);
  });

  it("should import a dynamic module with global providers", () => {
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

    expect(getModuleContainer(Module).isProvided("test")).toBe(true);
    expect(InversifySugar.globalContainer.isBound("test")).toBe(true);
  });
});
