import { ClassElementMetadataKind, LegacyTargetImpl } from "@inversiland/core";

import { TargetTypeEnum } from "../../src/constants/literal_types";
import { Container } from "../../src/container/container";
import { Context } from "../../src/planning/context";
import { Plan } from "../../src/planning/plan";
import { Request } from "../../src/planning/request";

describe("Context", () => {
  it("Should set its own properties correctly", () => {
    const container: Container = new Container();
    const context1: Context = new Context(container);
    const invalid = null;
    const context2: Context = new Context(invalid as unknown as Container);

    expect(context1.container).not.toBeNull();
    expect(context2.container).toBeNull();
    expect(typeof context1.id).toBe("number");
    expect(typeof context2.id).toBe("number");
    expect(context1.id).not.toBe(context2.id);
  });

  it("Should be linkable to a Plan", () => {
    const container: Container = new Container();
    const context: Context = new Context(container);
    const target: LegacyTargetImpl = new LegacyTargetImpl(
      "",
      {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: "Ninja",
      },
      TargetTypeEnum.Variable
    );

    const ninjaRequest: Request = new Request(
      "Ninja",
      context,
      null,
      [],
      target
    );

    const plan: Plan = new Plan(context, ninjaRequest);
    context.addPlan(plan);

    expect(context.plan.rootRequest.serviceIdentifier).toBe("Ninja");
  });
});
