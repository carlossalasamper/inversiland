import { Container, createMockRequest } from "@carlossalasamper/inversify";
import importedConstraint from "../../src/constraints/importedConstraint";
import { IMPORTED_TAG } from "../../src/constants";

describe("importedConstraint", () => {
  it("Should return true when the request is tagged as imported.", () => {
    const container = new Container();
    const request = createMockRequest(container, "test", IMPORTED_TAG, true);
    const result = importedConstraint(request);

    expect(result).toBe(true);
  });

  it("Should return true when the request has no custom tags.", () => {
    const container = new Container();
    const request = createMockRequest(container, "test", undefined, undefined);
    const result = importedConstraint(request);

    expect(result).toBe(true);
  });

  it("Should return false when the request has custom tags different to IMPORTED_TAG.", () => {
    const container = new Container();
    const request = createMockRequest(container, "test", "another tag", true);
    const result = importedConstraint(request);

    expect(result).toBe(false);
  });

  it("Should return false when the request is null.", () => {
    const result = importedConstraint(null);

    expect(result).toBe(false);
  });

  it("Should return false when request.target.getCustomTags returns null and its not tagged with IMPORTED_TAG..", () => {
    const container = new Container();
    const request = createMockRequest(container, "test", undefined, undefined);
    request.target.getCustomTags = () => null;

    const result = importedConstraint(request);

    expect(result).toBe(false);
  });
});
