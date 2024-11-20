import { injectable } from "inversify";
import { DetailedExportedProvider } from "../../../src/types/ExportedProvider";
import createExportedProviderRef from "../../../src/utils/importing/createExportedProviderRef";
import { bindProviderToModule } from "../../../src/utils/binding/bindProviderToModule";
import { getModuleContainer, module } from "../../../src";
import importModule from "../../../src/utils/importing/importModule";

describe("createExportedProviderRef", () => {
  it("Should create a simple DetailedExportedProvider ref.", () => {
    @injectable()
    class TestClass {}

    @module({})
    class TestModule {}

    bindProviderToModule(TestClass, TestModule);

    const exportedProvider: DetailedExportedProvider = {
      provide: TestClass,
    };

    const exportedProviderRefs = createExportedProviderRef(
      TestModule,
      exportedProvider
    );

    expect(exportedProviderRefs.length).toBe(1);
    expect(exportedProviderRefs[0].provide).toBe(TestClass);
    expect(exportedProviderRefs[0].multiple).toBe(false);
    expect(exportedProviderRefs[0].getValue()).toBeInstanceOf(TestClass);
  });

  it("Exported providers of a imported module should be bound to the current container when deep = true.", () => {
    const ProviderToken = Symbol("ProviderToken");

    @injectable()
    class AService {
      public readonly name = "AService";
    }

    @injectable()
    class BService {
      public readonly name = "BService";
    }

    @module({
      providers: [
        {
          provide: ProviderToken,
          useClass: AService,
        },
      ],
      exports: [ProviderToken],
    })
    class AModule {}

    @module({
      imports: [AModule],
      providers: [
        {
          provide: ProviderToken,
          useClass: BService,
        },
      ],
      exports: [
        {
          provide: ProviderToken,
          deep: true,
        },
      ],
    })
    class BModule {}

    @module({
      providers: [
        {
          provide: ProviderToken,
          useValue: "VALUE",
        },
      ],
      exports: [ProviderToken],
    })
    class CModule {}

    @module({
      imports: [BModule, CModule],
    })
    class RootModule {}

    importModule(RootModule, false);

    const container = getModuleContainer(RootModule);
    const exportedServices = container.getImported(ProviderToken);

    expect(exportedServices).toHaveLength(3);
  });
});
