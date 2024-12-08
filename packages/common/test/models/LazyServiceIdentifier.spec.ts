import { LazyServiceIdentifier } from "../../src";

describe("LazyServiceIdentifier", () => {
  it(".is having a non object should return false.", () => {
    const symbolServiceIdentifier = Symbol();

    expect(LazyServiceIdentifier.is(symbolServiceIdentifier)).toBe(false);
  });

  it(".is having a null object should return false.", () => {
    const nullServiceIdentifier = null;

    expect(LazyServiceIdentifier.is(nullServiceIdentifier)).toBe(false);
  });

  it(".is having an object with isLazyServiceIdentifierSymbol property should return true.", () => {
    const lazeServiceIdentifier = new LazyServiceIdentifier(() => "service-id");

    expect(LazyServiceIdentifier.is(lazeServiceIdentifier)).toBe(true);
  });

  it(".is having an object without islazyServiceIdentifierSymbol property", () => {
    const invalidLazyServiceIdentifierObject = {
      foo: "bar",
    };

    expect(LazyServiceIdentifier.is(invalidLazyServiceIdentifierObject)).toBe(
      false
    );
  });

  it(".unwrap should call buildServiceId().", () => {
    const serviceIdentifier = "service-id";
    const buildServiceIdMock = jest.fn(() => serviceIdentifier);
    const lazyServiceIdentifier = new LazyServiceIdentifier(buildServiceIdMock);
    const result = lazyServiceIdentifier.unwrap();

    expect(buildServiceIdMock).toHaveBeenCalledTimes(1);
    expect(buildServiceIdMock).toHaveBeenCalledWith();
    expect(result).toBe(serviceIdentifier);
  });
});
