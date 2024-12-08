import { stringifyServiceIdentifier } from "../../src";

describe("stringifyServiceIdentifier", () => {
  it("Should stringify a string service identifier with the correct format.", () => {
    const stringServiceIdentifier = "service-id";
    const result = stringifyServiceIdentifier(stringServiceIdentifier);

    expect(result).toBe(stringServiceIdentifier.toString());
  });

  it("Should stringify a symbol service identifier with the correct format.", () => {
    const symbolServiceIdentifier = Symbol("service-id");
    const result = stringifyServiceIdentifier(symbolServiceIdentifier);

    expect(result).toBe(symbolServiceIdentifier.toString());
  });

  it("Should stringify a function service identifier with the correct format.", () => {
    const functionServiceIdentifier = function serviceId() {
      return;
    };
    const result = stringifyServiceIdentifier(functionServiceIdentifier);

    expect(result).toBe(functionServiceIdentifier.name);
  });

  it("Should throw an error when the service identifier is not a string, symbol or function.", () => {
    const invalidServiceIdentifier = 123 as unknown as string;

    expect(() => stringifyServiceIdentifier(invalidServiceIdentifier)).toThrow(
      `Unexpected number service id type`
    );
  });
});
