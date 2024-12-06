import hasOwnMetadata from "../src/hasOwnMetadata";

describe("hasOwnMetadata", () => {
  it("Should return true when called and metadata is defined on the target object.", () => {
    const metadataKey = Symbol("key");
    const target = class {};

    Reflect.defineMetadata(metadataKey, "value", target);

    expect(hasOwnMetadata(metadataKey, target)).toBe(true);
  });

  it("Should return false when called and metadata is defined on the target object's prototype.", () => {
    const metadataKey = Symbol("key");
    const parent = class {};
    const target = class extends parent {};

    Reflect.defineMetadata(metadataKey, "value", parent);

    expect(hasOwnMetadata(metadataKey, target)).toBe(false);
  });

  it("Should return false when called and no metadata is defined on the target object.", () => {
    const target = class {};
    const result = hasOwnMetadata(Symbol("key"), target);

    expect(result).toBe(false);
  });
});
