import getMetadata from "../src/getMetadata";

describe("getMetadata", () => {
  it("Should return undefined when called and no metadata is defined.", () => {
    const result = getMetadata(Symbol("key"), class {});

    expect(result).toBeUndefined();
  });

  it("Should return metadata when called and metadata is defined.", () => {
    const metadataKey = Symbol("key");
    const metadataValue = "value";
    const target = class {};

    Reflect.defineMetadata(metadataKey, metadataValue, target);

    expect(getMetadata(metadataKey, target)).toBe(metadataValue);
  });
});
