import { beforeAll, describe, expect, it } from "@jest/globals";

import { InstanceBinding } from "../../../src/binding/types/InstanceBinding";
import { InstanceBindingNode } from "../../../src/planning/types/InstanceBindingNode";
import { getInstanceNodeBinding } from "../../../src/resolution/utils/getInstanceNodeBinding";

describe(getInstanceNodeBinding.name, () => {
  let nodeFixture: InstanceBindingNode<InstanceBinding<unknown>>;

  beforeAll(() => {
    nodeFixture = {
      binding: Symbol() as unknown as InstanceBinding<unknown>,
    } as Partial<
      InstanceBindingNode<InstanceBinding<unknown>>
    > as InstanceBindingNode<InstanceBinding<unknown>>;
  });

  describe("when called", () => {
    let result: unknown;

    beforeAll(() => {
      result = getInstanceNodeBinding(nodeFixture);
    });

    it("should return expected value", () => {
      expect(result).toBe(nodeFixture.binding);
    });
  });
});
