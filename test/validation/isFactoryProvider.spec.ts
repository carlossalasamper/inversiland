/* eslint-disable @typescript-eslint/no-explicit-any */
import { FactoryProvider } from "../../src/types/Provider";
import isFactoryProvider from "../../src/validation/isFactoryProvider";

describe("isFactoryProvider", () => {
  it("Should return true if the object is a FactoryProvider.", () => {
    const factoryProviders: FactoryProvider[] = [
      {
        provide: "provide",
        useFactory: () => () => undefined,
      },
      {
        provide: Symbol(),
        useFactory: () => () => undefined,
      },
    ];

    for (const factoryProvider of factoryProviders) {
      expect(isFactoryProvider(factoryProvider)).toBe(true);
    }
  });

  it("Should return false if the object is not a FactoryProvider.", () => {
    const notFactoryProviders: any[] = [
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

    for (const notFactoryProvider of notFactoryProviders) {
      expect(isFactoryProvider(notFactoryProvider)).toBe(false);
    }
  });
});
