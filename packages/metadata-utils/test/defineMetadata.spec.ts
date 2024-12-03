import defineMetadata from "../src/defineMetadata";

describe("defineMetadata", () => {
  it("Should define a metadata key of a object.", () => {
    class ClassA {}

    defineMetadata("a", "a", ClassA.prototype);

    const metadata = Reflect.getMetadata("a", ClassA.prototype);

    expect(metadata).toBe("a");
  });
});
