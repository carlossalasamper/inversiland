import { injectable } from "inversify";
import processImports from "../../../src/utils/importing/processImports";
import { getModuleContainer, module } from "../../../src";
import ExportedProviderRef from "../../../src/types/ExportedProviderRef";
import { DynamicModule } from "../../../src/types/Module";

describe("processImports", () => {
  it("Should group refs with the same provider.", () => {
    const TestServiceToken = Symbol("TestService");

    @injectable()
    class TestService {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [
        {
          provide: TestServiceToken,
          multiple: true,
        },
      ],
    })
    class AModule {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [TestServiceToken],
    })
    class BModule {}

    @module({
      imports: [AModule, BModule],
    })
    class RootModule {}

    const reducedRefs: ExportedProviderRef[] = [
      {
        provide: TestServiceToken,
        multiple: true,
        getValue: jest.fn(),
      },
    ];

    const result = processImports(RootModule, [AModule, BModule]);

    expect(result).toHaveLength(1);
    expect(result[0].provide).toEqual(reducedRefs[0].provide);
    expect(result[0].getValue()).toHaveLength(3);
  });

  it("Should group imported providers when provide is a class", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class AModule {}

    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class BModule {}

    @module({})
    class RootModule {}

    const imports = [AModule, BModule];
    const reducedRefs: ExportedProviderRef[] = [
      {
        provide: TestService,
        multiple: true,
        getValue: jest.fn(),
      },
    ];
    const result = processImports(RootModule, imports);

    expect(result).toHaveLength(1);
    expect(result[0].provide).toEqual(reducedRefs[0].provide);
    expect(result[0].getValue()).toHaveLength(2);
  });

  it("Should group imported providers when provide is a string", () => {
    const TestServiceToken = "TestService";

    @injectable()
    class TestService {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [TestServiceToken],
    })
    class AModule {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [TestServiceToken],
    })
    class BModule {}

    @module({})
    class RootModule {}

    const imports = [AModule, BModule];
    const reducedRefs: ExportedProviderRef[] = [
      {
        provide: TestServiceToken,
        multiple: true,
        getValue: jest.fn(),
      },
    ];
    const result = processImports(RootModule, imports);

    expect(result).toHaveLength(1);
    expect(result[0].provide).toEqual(reducedRefs[0].provide);
    expect(result[0].getValue()).toHaveLength(2);
  });

  it("Should group and flat value of many MultipleExportedProvider", () => {
    const TestServiceToken = Symbol("TestService");

    @injectable()
    class TestService {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [
        {
          provide: TestServiceToken,
          multiple: true,
        },
      ],
    })
    class AModule {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [
        {
          provide: TestServiceToken,
          multiple: true,
        },
      ],
    })
    class BModule {}

    @module({
      providers: [
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
        {
          provide: TestServiceToken,
          useClass: TestService,
        },
      ],
      exports: [
        {
          provide: TestServiceToken,
          multiple: true,
        },
      ],
    })
    class CModule {}

    @module({})
    class RootModule {}

    const imports = [AModule, BModule, CModule];
    const reducedRefs: ExportedProviderRef[] = [
      {
        provide: TestServiceToken,
        multiple: true,
        getValue: jest.fn(),
      },
    ];
    const result = processImports(RootModule, imports);

    expect(result).toHaveLength(1);
    expect(result[0].provide).toEqual(reducedRefs[0].provide);
    expect(result[0].getValue()).toHaveLength(6);
  });

  it("Should import a dynamic module", () => {
    @module({})
    class Module {}

    @module({})
    class RootModule {}

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

    const exportedProviderRefs = processImports(RootModule, [dynamicModule]);

    expect(getModuleContainer(RootModule).isImported("test")).toBe(true);
    expect(exportedProviderRefs).toHaveLength(1);
    expect(exportedProviderRefs[0].provide).toBe("test");
    expect(exportedProviderRefs[0].getValue()).toBe("test");
  });
});
