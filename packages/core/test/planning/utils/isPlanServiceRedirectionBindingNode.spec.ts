import { beforeAll, describe, expect, it } from "@jest/globals";

import { ServiceRedirectionBinding } from "../../../src/binding/types/ServiceRedirectionBinding";
import { BindingNodeParent } from "../../../src/planning/types/BindingNodeParent";
import { PlanServiceNode } from "../../../src/planning/types/PlanServiceNode";
import { PlanServiceRedirectionBindingNode } from "../../../src/planning/types/PlanServiceRedirectionBindingNode";
import { isPlanServiceRedirectionBindingNode } from "../../../src/planning/utils/isPlanServiceRedirectionBindingNode";

describe(isPlanServiceRedirectionBindingNode.name, () => {
  describe("having a PlanServiceRedirectionBindingNode", () => {
    let planServiceRedirectionBindingNodeFixture: PlanServiceRedirectionBindingNode;

    beforeAll(() => {
      planServiceRedirectionBindingNodeFixture = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        binding: Symbol() as unknown as ServiceRedirectionBinding<any>,
        parent: Symbol() as unknown as BindingNodeParent,
        redirections: [],
      };
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = isPlanServiceRedirectionBindingNode(
          planServiceRedirectionBindingNodeFixture
        );
      });

      it("should return true", () => {
        expect(result).toBe(true);
      });
    });
  });

  describe("having a PlanServiceNode", () => {
    let planServiceNodeFixture: PlanServiceNode;

    beforeAll(() => {
      planServiceNodeFixture = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: "service-id",
      };
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        result = isPlanServiceRedirectionBindingNode(planServiceNodeFixture);
      });

      it("should return false", () => {
        expect(result).toBe(false);
      });
    });
  });
});
