import clearMetadata from "../src/clearMetadata";

describe("clearMetadata", () => {
  it("Should clear all metadata keys of a object.", () => {
    class ClassA {}

    Reflect.defineMetadata("a", "a", ClassA.prototype);
    Reflect.defineMetadata("b", "b", ClassA.prototype);

    clearMetadata(ClassA.prototype);

    const metadata = Reflect.getMetadataKeys(ClassA.prototype);

    expect(metadata).toMatchObject([]);
  });
});
