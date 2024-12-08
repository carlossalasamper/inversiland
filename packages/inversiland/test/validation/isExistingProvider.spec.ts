/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExistingProvider } from "../../src/types/Provider";
import isExistingProvider from "../../src/validation/isExistingProvider";

describe("isExistingProvider", () => {
  it("Should return true if the object is a ExistingProvider.", () => {
    class TestService {}

    const providers: ExistingProvider[] = [
      {
        provide: "provide",
        useExisting: "existing",
      },
      {
        provide: Symbol("provide"),
        useExisting: Symbol("existing"),
      },
      {
        provide: TestService,
        useExisting: TestService,
      },
    ];

    for (const provider of providers) {
      expect(isExistingProvider(provider)).toBe(true);
    }
  });

  it("Should return false if the object is not a ExistingProvider.", () => {
    const notExistingProviders: any[] = [
      {
        provide: "provide",
        useValue: "useValue",
      },
      {
        provide: "provide",
        useClass: class {},
      },
      undefined,
      null,
      0,
      "",
      true,
    ];

    for (const notExistingProvider of notExistingProviders) {
      expect(isExistingProvider(notExistingProvider)).toBe(false);
    }
  });
});
