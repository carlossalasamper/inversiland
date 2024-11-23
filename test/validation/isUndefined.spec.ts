/* eslint-disable @typescript-eslint/no-empty-function */
import isUndefined from "../../src/validation/isUndefined";

describe("isUndefined", () => {
  it("Should return true if value is undefined.", () => {
    expect(isUndefined(undefined)).toBe(true);
  });

  it("Should return false if value is not undefined.", () => {
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined("")).toBe(false);
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined(false)).toBe(false);
    expect(isUndefined({})).toBe(false);
    expect(isUndefined([])).toBe(false);
    expect(isUndefined(() => {})).toBe(false);
  });
});
