import hasMetadata from "../src/hasMetadata";

describe("hasMetadata", () => {
  it("Should return true when called and metadata is defined.", () => {
    const metadataKey = Symbol("key");
    const target = class {};

    Reflect.defineMetadata(metadataKey, "value", target);

    expect(hasMetadata(metadataKey, target)).toBe(true);
  });

  it("Should return true when called and metadata is defined on the target object's prototype.", () => {
    const metadataKey = Symbol("key");
    const parent = class {};
    const target = class extends parent {};

    Reflect.defineMetadata(metadataKey, "value", parent);

    expect(hasMetadata(metadataKey, target)).toBe(true);
  });

  it("Should return false when called and no metadata is defined.", () => {
    const result = hasMetadata(Symbol("key"), class {});

    expect(result).toBe(false);
  });
});
