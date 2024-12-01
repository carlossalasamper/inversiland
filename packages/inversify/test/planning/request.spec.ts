import {
  ClassElementMetadataKind,
  LegacyTargetImpl as TargetImpl,
} from "@inversifyjs/core";

import { interfaces } from "../../src";
import { TargetTypeEnum } from "../../src/constants/literal_types";
import { Container } from "../../src/container/container";
import { Context } from "../../src/planning/context";
import { Request } from "../../src/planning/request";

describe("Request", () => {
  // eslint-disable-next-line @typescript-eslint/typedef
  const identifiers = {
    Katana: "Katana",
    KatanaBlade: "KatanaBlade",
    KatanaHandler: "KatanaHandler",
    Ninja: "Ninja",
    Shuriken: "Shuriken",
  };

  it("Should set its own properties correctly", () => {
    const container: Container = new Container();
    const context: Context = new Context(container);

    const request1: Request = new Request(
      identifiers.Ninja,
      context,
      null,
      [],
      new TargetImpl(
        "",
        {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: identifiers.Ninja,
        },
        TargetTypeEnum.Variable
      )
    );

    const request2: Request = new Request(
      identifiers.Ninja,
      context,
      null,
      [],
      new TargetImpl(
        "",
        {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: identifiers.Ninja,
        },
        TargetTypeEnum.Variable
      )
    );

    expect(request1.serviceIdentifier).toBe(identifiers.Ninja);
    expect(Array.isArray(request1.bindings)).toBe(true);
    expect(Array.isArray(request2.bindings)).toBe(true);
    expect(typeof request1.id).toBe("number");
    expect(typeof request2.id).toBe("number");
    expect(request1.id).not.toBe(request2.id);
  });

  it("Should be able to add a child request", () => {
    const container: Container = new Container();
    const context: Context = new Context(container);

    const ninjaRequest: Request = new Request(
      identifiers.Ninja,
      context,
      null,
      [],
      new TargetImpl(
        "Ninja",
        {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: identifiers.Ninja,
        },
        TargetTypeEnum.Variable
      )
    );

    ninjaRequest.addChildRequest(
      identifiers.Katana,
      [],
      new TargetImpl(
        "Katana",
        {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: identifiers.Katana,
        },
        TargetTypeEnum.ConstructorArgument
      )
    );

    const katanaRequest: Request | undefined = ninjaRequest.childRequests[0];

    expect(katanaRequest?.serviceIdentifier).toBe(identifiers.Katana);
    expect(katanaRequest?.target.name.value()).toBe("Katana");
    expect(katanaRequest?.childRequests.length).toBe(0);

    const katanaParentRequest: interfaces.Request =
      katanaRequest?.parentRequest as Request;
    expect(katanaParentRequest.serviceIdentifier).toBe(identifiers.Ninja);
    expect(katanaParentRequest.target.name.value()).toBe("Ninja");
    expect(katanaParentRequest.target.serviceIdentifier).toBe(
      identifiers.Ninja
    );
  });
});
