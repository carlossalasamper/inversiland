import getAllMetadata from "../src/getAllMetadata";

describe("getAllMetadata", () => {
  it("Should return all metadata.", () => {
    class ClassA {}
    const metadataKeys = ["a", "b"];

    Reflect.defineMetadata("a", "a", ClassA.prototype);
    Reflect.defineMetadata("b", "b", ClassA.prototype);

    const metadata = getAllMetadata<{
      a: string;
      b: string;
    }>(metadataKeys, ClassA.prototype);
    const defaultModuleMetadata: typeof metadata = {
      a: "a",
      b: "b",
    };

    expect(metadata).toMatchObject(defaultModuleMetadata);
  });
});
