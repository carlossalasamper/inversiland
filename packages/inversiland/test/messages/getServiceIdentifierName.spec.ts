import getServiceIdentifierName from "../../src/messages/getServiceIdentifierName";

describe("getServiceIdentifierName", () => {
  it("should return class name if serviceIdentifier is a class", () => {
    const serviceIdentifier = class Test {};
    const expected = "class Test {}";
    const result = getServiceIdentifierName(serviceIdentifier);
    expect(result).toEqual(expected);
  });

  it("should return serviceIdentifier.toString() if serviceIdentifier is not a class", () => {
    const serviceIdentifier = "test";
    const expected = "test";
    const result = getServiceIdentifierName(serviceIdentifier);
    expect(result).toEqual(expected);
  });
});
