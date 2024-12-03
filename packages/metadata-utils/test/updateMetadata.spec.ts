import { updateMetadata } from "../src";

describe("updateMetadata", () => {
  it("Should define metadata when it's not defined.", () => {
    const target = {};
    const metadataKey = "key";
    const defaultValue = "default";
    const callback = jest.fn().mockReturnValue("updated");

    updateMetadata(target, metadataKey, defaultValue, callback);

    expect(callback).toHaveBeenCalledWith(defaultValue);
    expect(Reflect.getMetadata(metadataKey, target)).toBe("updated");
  });

  it("Should update metadata when it's already defined.", () => {
    const target = {};
    const metadataKey = "key";
    const defaultValue = "default";
    const firstValue = "first";
    const callback = jest.fn().mockReturnValue("updated");

    Reflect.defineMetadata(metadataKey, firstValue, target);

    updateMetadata(target, metadataKey, defaultValue, callback);

    expect(callback).toHaveBeenCalledWith(firstValue);
    expect(Reflect.getMetadata(metadataKey, target)).toBe("updated");
  });
});
