/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncFactoryProvider } from "../../src/types/Provider";
import isAsyncFactoryProvider from "../../src/validation/isAsyncFactoryProvider";

describe("isAsyncFactoryProvider", () => {
  it("Should return true if the object is a AsyncFactoryProvider.", () => {
    const asyncFactoryProviders: AsyncFactoryProvider[] = [
      {
        provide: "provide",
        useAsyncFactory: () => async () => undefined,
      },
      {
        provide: Symbol(),
        useAsyncFactory: () => async () => undefined,
      },
    ];

    for (const provider of asyncFactoryProviders) {
      expect(isAsyncFactoryProvider(provider)).toBe(true);
    }
  });

  it("Should return false if the object is not a AsyncFactoryProvider.", () => {
    const notAsyncFactoryProviders: any[] = [
      {
        provide: "provide",
        useValue: "useValue",
      },
      {
        provide: "provide",
        useClass: class {},
      },
      {
        provide: "provide",
        useFactory: () => undefined,
      },
      undefined,
      null,
      0,
      "",
      true,
    ];

    for (const provider of notAsyncFactoryProviders) {
      expect(isAsyncFactoryProvider(provider)).toBe(false);
    }
  });
});
