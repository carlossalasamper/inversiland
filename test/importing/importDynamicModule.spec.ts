import {
  InversifySugar,
  getModuleContainer,
  inject,
  injectable,
  module,
} from "../../src";
import { DynamicModule } from "../../src/types/Module";
import importDynamicModule from "../../src/importing/importDynamicModule";
import importModule from "../../src/importing/importModule";

describe("importDynamicModule", () => {
  beforeEach(async () => {
    await InversifySugar.reset();
  });

  it("Should import an empty dynamic module.", () => {
    @module({})
    class Module {}

    const dynamicModule: DynamicModule = {
      module: Module,
    };

    expect(() => importDynamicModule(dynamicModule)).not.toThrow();
  });

  it("Should import a dynamic module with imports.", () => {
    const CatNameToken = Symbol("CatName");

    @injectable()
    class Logger {
      log(message: string) {
        console.log(message);
      }
    }

    @module({
      providers: [Logger],
      exports: [Logger],
    })
    class CommonModule {}

    @module({})
    class CatsModule {
      static forRoot(moreCatNames: string[]): DynamicModule {
        return {
          module: CatsModule,
          imports: [CommonModule],
          providers: [
            ...moreCatNames.map((catName) => ({
              provide: CatNameToken,
              useValue: catName,
            })),
          ],
        };
      }
    }

    importDynamicModule(
      CatsModule.forRoot(["Toulouse", "Tomas O'Malley", "Duchess"])
    );

    expect(getModuleContainer(CatsModule).isBound(Logger));
  });

  it("Should import a dynamic module with providers.", () => {
    const CatNameToken = Symbol("CatName");

    @module({})
    class CatsModule {
      static forRoot(catNames: string[]): DynamicModule {
        return {
          module: CatsModule,
          providers: [
            ...catNames.map((catName) => ({
              provide: CatNameToken,
              useValue: catName,
            })),
          ],
        };
      }
    }

    importDynamicModule(
      CatsModule.forRoot(["Toulouse", "Tomas O'Malley", "Duchess"])
    );

    expect(getModuleContainer(CatsModule).getAll(CatNameToken)).toHaveLength(3);
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

  it("Should resolve dependencies of global providers.", () => {
    @injectable()
    class AService {}

    @injectable()
    class BService {
      constructor(@inject(AService) public readonly aService: AService) {}
    }

    @injectable()
    class GlobalService {
      constructor(
        @inject(AService) public readonly aService: AService,
        @inject(BService) public readonly bService: BService
      ) {}
    }

    @module({})
    class GlobalModule {}

    const dynamicModule: DynamicModule = {
      module: GlobalModule,
      providers: [
        AService,
        BService,
        {
          useClass: GlobalService,
          isGlobal: true,
        },
      ],
    };

    importDynamicModule(dynamicModule);

    const globalService = InversifySugar.globalContainer.get(GlobalService);

    expect(globalService).toBeInstanceOf(GlobalService);
    expect(globalService.aService).toBeInstanceOf(AService);
    expect(globalService.bService).toBeInstanceOf(BService);
  });
});
