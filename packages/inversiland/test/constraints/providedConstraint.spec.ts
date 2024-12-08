import { Container, createMockRequest } from "@inversiland/inversify";

import { PROVIDED_TAG } from "../../src/constants";
import providedConstraint from "../../src/constraints/providedConstraint";

describe("providedConstraint", () => {
  it("Should return true when the request is tagged as imported.", () => {
    const container = new Container();
    const request = createMockRequest(container, "test", PROVIDED_TAG, true);
    const result = providedConstraint(request);

    expect(result).toBe(true);
  });

  it("Should return true when the request has no custom tags.", () => {
    const container = new Container();
    const request = createMockRequest(container, "test", undefined, undefined);
    const result = providedConstraint(request);

    expect(result).toBe(true);
  });

  it("Should return false when the request has custom tags different to PROVIDED_TAG.", () => {
    const container = new Container();
    const request = createMockRequest(container, "test", "another tag", true);
    const result = providedConstraint(request);

    expect(result).toBe(false);
  });

  it("Should return false when the request is null.", () => {
    const result = providedConstraint(null);

    expect(result).toBe(false);
  });

  it("Should return false when request.target.getCustomTags returns null and its not tagged with PROVIDED_TAG..", () => {
    const container = new Container();
    const request = createMockRequest(container, "test", undefined, undefined);
    request.target.getCustomTags = () => null;

    const result = providedConstraint(request);

    expect(result).toBe(false);
  });
});
