import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock(
  "../../../src/planning/utils/checkPlanServiceRedirectionBindingNodeSingleInjectionBindings"
);
jest.mock("../../../src/planning/utils/isPlanServiceRedirectionBindingNode");
jest.mock(
  "../../../src/planning/utils/throwErrorWhenUnexpectedBindingsAmountFound"
);

import { PlanBindingNode } from "../../../src/planning/types/PlanBindingNode";
import { PlanServiceNode } from "../../../src/planning/types/PlanServiceNode";
import { PlanServiceNodeParent } from "../../../src/planning/types/PlanServiceNodeParent";
import { checkPlanServiceRedirectionBindingNodeSingleInjectionBindings } from "../../../src/planning/utils/checkPlanServiceRedirectionBindingNodeSingleInjectionBindings";
import { checkServiceNodeSingleInjectionBindings } from "../../../src/planning/utils/checkServiceNodeSingleInjectionBindings";
import { isPlanServiceRedirectionBindingNode } from "../../../src/planning/utils/isPlanServiceRedirectionBindingNode";
import { throwErrorWhenUnexpectedBindingsAmountFound } from "../../../src/planning/utils/throwErrorWhenUnexpectedBindingsAmountFound";

describe(checkServiceNodeSingleInjectionBindings.name, () => {
  describe("having a PlanServiceNode with no bindings", () => {
    let nodeFixture: PlanServiceNode;
    let isOptionalFixture: boolean;

    beforeAll(() => {
      nodeFixture = {
        bindings: [],
        parent: Symbol() as unknown as PlanServiceNodeParent,
        serviceIdentifier: "service-id",
      };
      isOptionalFixture = false;
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = checkServiceNodeSingleInjectionBindings(
          nodeFixture,
          isOptionalFixture
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call throwErrorWhenUnexpectedBindingsAmountFound()", () => {
        expect(
          throwErrorWhenUnexpectedBindingsAmountFound
        ).toHaveBeenCalledTimes(1);
        expect(
          throwErrorWhenUnexpectedBindingsAmountFound
        ).toHaveBeenCalledWith(
          nodeFixture.bindings,
          isOptionalFixture,
          nodeFixture
        );
      });

      it("should return undefined", () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe("having a PlanServiceNode with single binding", () => {
    let nodeFixtureBinding: PlanBindingNode;
    let nodeFixture: PlanServiceNode;
    let isOptionalFixture: boolean;

    beforeAll(() => {
      nodeFixtureBinding = Symbol() as unknown as PlanBindingNode;
      nodeFixture = {
        bindings: [nodeFixtureBinding],
        parent: Symbol() as unknown as PlanServiceNodeParent,
        serviceIdentifier: "service-id",
      };
      isOptionalFixture = false;
    });

    describe("when called, and isPlanServiceRedirectionBindingNode() returns false", () => {
      let result: unknown;

      beforeAll(() => {
        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        result = checkServiceNodeSingleInjectionBindings(
          nodeFixture,
          isOptionalFixture
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should not call throwErrorWhenUnexpectedBindingsAmountFound()", () => {
        expect(
          throwErrorWhenUnexpectedBindingsAmountFound
        ).not.toHaveBeenCalled();
      });

      it("should return undefined", () => {
        expect(result).toBeUndefined();
      });
    });

    describe("when called, and isPlanServiceRedirectionBindingNode() returns true", () => {
      let result: unknown;

      beforeAll(() => {
        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(true);

        result = checkServiceNodeSingleInjectionBindings(
          nodeFixture,
          isOptionalFixture
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call checkPlanServiceRedirectionBindingNodeSingleInjectionBindings()", () => {
        expect(
          checkPlanServiceRedirectionBindingNodeSingleInjectionBindings
        ).toHaveBeenCalledTimes(1);
        expect(
          checkPlanServiceRedirectionBindingNodeSingleInjectionBindings
        ).toHaveBeenCalledWith(nodeFixtureBinding, isOptionalFixture);
      });

      it("should not call throwErrorWhenUnexpectedBindingsAmountFound()", () => {
        expect(
          throwErrorWhenUnexpectedBindingsAmountFound
        ).not.toHaveBeenCalled();
      });

      it("should return undefined", () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
