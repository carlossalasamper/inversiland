import {
  DetailedExportedProvider,
  TokenExportedProvider,
} from "../../src/types/ExportedProvider";
import isTokenExportedProvider from "../../src/validation/isTokenExportedProvider";

describe("isTokenExportedProvider", () => {
  it("Should return true if the data is a TokenExportedProvider.", () => {
    const providers: TokenExportedProvider[] = [
      "TEST",
      Symbol("TEST"),
      class {},
    ];

    for (const provider of providers) {
      expect(isTokenExportedProvider(provider)).toBe(true);
    }
  });

  it("Should return false if the data is not a TokenExportedProvider.", () => {
    const data: DetailedExportedProvider = {
      provide: "TEST",
    };

    expect(isTokenExportedProvider(data)).toBe(false);
    expect(isTokenExportedProvider(undefined)).toBe(false);
    expect(isTokenExportedProvider(null)).toBe(false);
    expect(isTokenExportedProvider(0)).toBe(false);
    expect(isTokenExportedProvider(false)).toBe(false);
    expect(isTokenExportedProvider({})).toBe(false);
  });
});
