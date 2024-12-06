import { ClassElementMetadataKind, LegacyTargetImpl } from "@inversiland/core";

import { TargetTypeEnum } from "../../src/constants/literal_types";
import { Container } from "../../src/container/container";
import { Context } from "../../src/planning/context";
import { Plan } from "../../src/planning/plan";
import { Request } from "../../src/planning/request";

describe("Plan", () => {
  it("Should set its own properties correctly", () => {
    const container: Container = new Container();
    const context: Context = new Context(container);
    const runtimeId = "Something";

    const request: Request = new Request(
      runtimeId,
      context,
      null,
      [],
      new LegacyTargetImpl(
        "",
        {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: runtimeId,
        },
        TargetTypeEnum.Variable
      )
    );

    const plan: Plan = new Plan(context, request);

    expect(plan.parentContext).toEqual(context);
    expect(plan.rootRequest.serviceIdentifier).toEqual(
      request.serviceIdentifier
    );
    expect(plan.rootRequest.parentContext).toEqual(request.parentContext);
    expect(plan.rootRequest.parentRequest).toEqual(request.parentRequest);
    expect(plan.rootRequest.childRequests).toEqual(request.childRequests);
    expect(plan.rootRequest.target).toEqual(request.target);
  });
});
