import { module, ModuleContainer } from "../../src";
import { getModuleMetadata } from "../../src/metadata/getModuleMetadata";
import ModuleMetadata from "../../src/types/ModuleMetadata";

@module({})
class EmptyMetadataModule {}

describe("@module", () => {
  it("Should generate correct metadata from empty args.", () => {
    const metadata = getModuleMetadata(EmptyMetadataModule);

    expect(metadata).toMatchObject<Omit<ModuleMetadata, "id" | "container">>({
      isModule: true,
      isBound: false,
      imports: [],
      providers: [],
      globalProviders: [],
      exports: [],
    });

    expect(metadata.container).toBeInstanceOf(ModuleContainer);
  });

  it("Should separate scoped and global providers.", () => {
    @module({
      providers: [
        {
          provide: "scoped",
          useValue: "scoped",
        },
        {
          provide: "global",
          useValue: "global",
          isGlobal: true,
        },
      ],
    })
    class ProvidersModule {}

    const metadata = getModuleMetadata(ProvidersModule);

    expect(metadata.providers).toHaveLength(1);
    expect(metadata.globalProviders).toHaveLength(1);
  });
});
