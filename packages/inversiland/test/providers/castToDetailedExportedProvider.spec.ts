import {
  DetailedExportedProvider,
  TokenExportedProvider,
} from "../../src/types/ExportedProvider";
import castToDetailedExportedProvider from "../../src/providers/castToDetailedExportedProvider";

describe("castToDetailedExportedProvider", () => {
  it("Should cast a DetailedExportedProvider to a DetailedExportedProvider.", () => {
    const exportedProvider: DetailedExportedProvider = {
      provide: "TestService",
      deep: true,
    };

    const detailedExportedProvider =
      castToDetailedExportedProvider(exportedProvider);

    expect(detailedExportedProvider).toEqual(exportedProvider);
  });

  it("Should cast a TokenExportedProvider to a DetailedExportedProvider.", () => {
    const exportedProvider: TokenExportedProvider = "TestService";

    const detailedExportedProvider =
      castToDetailedExportedProvider(exportedProvider);

    expect(detailedExportedProvider).toEqual({
      provide: exportedProvider,
      deep: false,
    });
  });

  it("Should throw an error when the exported provider is not known.", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportedProvider = {} as any;

    expect(() => castToDetailedExportedProvider(exportedProvider)).toThrow();
  });
});
