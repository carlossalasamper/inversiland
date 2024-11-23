/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValueProvider } from "../../src/types/Provider";
import isValueProvider from "../../src/validation/isValueProvider";

describe("isValueProvider", () => {
  it("Should return true if value is a ValueProvider.", () => {
    const valueProviders: ValueProvider[] = [
      {
        provide: "test",
        useValue: "test",
      },
      {
        provide: Symbol(),
        useValue: 1000,
      },
    ];

    for (const valueProvider of valueProviders) {
      expect(isValueProvider(valueProvider)).toBe(true);
    }
  });

  it("Should return false if value is not a ValueProvider.", () => {
    const notValueProviders: any[] = [
      undefined,
      null,
      "",
      0,
      false,
      {},
      {
        provide: "test",
        useFactory: () => undefined,
      },
      {
        provide: Symbol(),
        useClass: class {},
      },
    ];

    for (const notValueProvider of notValueProviders) {
      expect(isValueProvider(notValueProvider)).toBe(false);
    }
  });
});
