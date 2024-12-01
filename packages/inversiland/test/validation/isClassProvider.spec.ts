import { ClassProvider } from "../../src/types/Provider";
import isClassProvider from "../../src/validation/isClassProvider";

describe("isClassProvider", () => {
  it("Should return true if the object is a ClassProvider.", () => {
    const classProviders: ClassProvider[] = [
      {
        provide: "provide",
        useClass: class {},
      },
      {
        provide: Symbol(),
        useClass: class {},
      },
      {
        useClass: class {},
      },
    ];

    for (const classProvider of classProviders) {
      expect(isClassProvider(classProvider)).toBe(true);
    }
  });

  it("Should return false if the object is not a ClassProvider.", () => {
    const notClassProviders: unknown[] = [
      {
        provide: "provide",
        useValue: "useValue",
      },
      {
        provide: "provide",
        useFactory: () => () => undefined,
      },
      undefined,
      null,
      0,
      "",
      true,
    ];

    for (const notClassProvider of notClassProviders) {
      expect(isClassProvider(notClassProvider)).toBe(false);
    }
  });
});
