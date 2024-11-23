import {
  DetailedExportedProvider,
  TokenExportedProvider,
} from "../../src/types/ExportedProvider";
import isDetailedExportedProvider from "../../src/validation/isDetailedExportedProvider";

describe("isDetailedExportedProvider", () => {
  it("Should return true if the data is a DetailedExportedProvider.", () => {
    const providers: DetailedExportedProvider[] = [
      {
        provide: "TEST",
      },
      {
        provide: Symbol("TEST"),
      },
      {
        provide: class {},
        deep: true,
      },
    ];

    for (const provider of providers) {
      expect(isDetailedExportedProvider(provider)).toBe(true);
    }
  });

  it("Should return false if the data is not a DetailedExportedProvider.", () => {
    const providers: TokenExportedProvider[] = [
      "TEST",
      Symbol("TEST"),
      class {},
    ];

    for (const provider of providers) {
      expect(isDetailedExportedProvider(provider)).toBe(false);
    }
  });
});
