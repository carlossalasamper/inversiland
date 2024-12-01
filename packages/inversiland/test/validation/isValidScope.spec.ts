import { SCOPE_KEYS } from "../../src/constants";
import isValidScope from "../../src/validation/isValidScope";

describe("isValidScope", () => {
  it("Should return true if value is included in scope options array.", () => {
    for (const scope of SCOPE_KEYS) {
      expect(isValidScope(scope)).toBe(true);
    }
  });

  it("Should return false if value is not included in scope options array.", () => {
    expect(isValidScope("")).toBe(false);
    expect(isValidScope("transient")).toBe(false);
    expect(isValidScope("request")).toBe(false);
    expect(isValidScope("singleton")).toBe(false);
  });
});
