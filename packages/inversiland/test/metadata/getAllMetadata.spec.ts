import getAllMetadata from "../../src/metadata/getAllMetadata";

describe("getAllMetadata", () => {
  it("Should return all metadata.", () => {
    class ClassA {}
    const metadataKeys = ["a", "b"];

    Reflect.defineMetadata("a", "a", ClassA.prototype);
    Reflect.defineMetadata("b", "b", ClassA.prototype);

    const metadata = getAllMetadata<{
      a: string;
      b: string;
    }>(ClassA.prototype, metadataKeys);
    const defaultModuleMetadata: typeof metadata = {
      a: "a",
      b: "b",
    };

    expect(metadata).toMatchObject(defaultModuleMetadata);
  });
});
