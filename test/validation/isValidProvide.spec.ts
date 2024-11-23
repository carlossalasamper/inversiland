/* eslint-disable @typescript-eslint/no-empty-function */
import isValidProvide from "../../src/validation/isValidProvide";

describe("isValidProvide", () => {
  it("Should return true if value is a string.", () => {
    expect(isValidProvide("")).toBe(true);
    expect(isValidProvide("test")).toBe(true);
  });

  it("Should return true if value is a symbol.", () => {
    expect(isValidProvide(Symbol())).toBe(true);
  });

  it("Should return false if value is not a string or symbol.", () => {
    expect(isValidProvide(undefined)).toBe(false);
    expect(isValidProvide(null)).toBe(false);
    expect(isValidProvide(0)).toBe(false);
    expect(isValidProvide(false)).toBe(false);
    expect(isValidProvide({})).toBe(false);
    expect(isValidProvide([])).toBe(false);
    expect(isValidProvide(() => {})).toBe(false);
  });
});
