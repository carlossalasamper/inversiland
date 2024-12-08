import {
  ServiceIdentifier,
  stringifyServiceIdentifier,
} from "@inversiland/common";

import { stringifyBinding } from "../../binding/utils/stringifyBinding";
import { InversifyCoreError } from "../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../error/types/InversifyCoreErrorKind";
import { BindingNodeParent } from "../types/BindingNodeParent";
import { PlanBindingNode } from "../types/PlanBindingNode";
import { isPlanServiceRedirectionBindingNode } from "./isPlanServiceRedirectionBindingNode";

export function throwErrorWhenUnexpectedBindingsAmountFound(
  bindings: PlanBindingNode[] | PlanBindingNode | undefined,
  isOptional: boolean,
  node: BindingNodeParent
): void {
  let serviceIdentifier: ServiceIdentifier;
  let parentServiceIdentifier: ServiceIdentifier | undefined;

  if (isPlanServiceRedirectionBindingNode(node)) {
    serviceIdentifier = node.binding.targetServiceIdentifier;
    parentServiceIdentifier = node.binding.serviceIdentifier;
  } else {
    serviceIdentifier = node.serviceIdentifier;
    parentServiceIdentifier = node.parent?.binding.serviceIdentifier;
  }

  if (Array.isArray(bindings)) {
    throwErrorWhenMultipleUnexpectedBindingsAmountFound(
      bindings,
      isOptional,
      serviceIdentifier,
      parentServiceIdentifier
    );
  } else {
    throwErrorWhenSingleUnexpectedBindingFound(
      bindings,
      isOptional,
      serviceIdentifier,
      parentServiceIdentifier
    );
  }
}

function throwBindingNotFoundError(
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined
): never {
  const errorMessage = `No bindings found for service: "${stringifyServiceIdentifier(
    serviceIdentifier
  )}".

Trying to resolve bindings for "${stringifyParentServiceIdentifier(
    serviceIdentifier,
    parentServiceIdentifier
  )}".`;

  throw new InversifyCoreError(InversifyCoreErrorKind.planning, errorMessage);
}

function throwErrorWhenMultipleUnexpectedBindingsAmountFound(
  bindings: PlanBindingNode[],
  isOptional: boolean,
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined
): void {
  if (bindings.length === 0) {
    if (!isOptional) {
      throwBindingNotFoundError(serviceIdentifier, parentServiceIdentifier);
    }
  } else {
    const errorMessage = `Ambiguous bindings found for service: "${stringifyServiceIdentifier(
      serviceIdentifier
    )}".

Registered bindings:

${bindings
  .map((binding: PlanBindingNode): string => stringifyBinding(binding.binding))
  .join("\n")}

Trying to resolve bindings for "${stringifyParentServiceIdentifier(
      serviceIdentifier,
      parentServiceIdentifier
    )}".`;

    throw new InversifyCoreError(InversifyCoreErrorKind.planning, errorMessage);
  }
}

function throwErrorWhenSingleUnexpectedBindingFound(
  bindings: PlanBindingNode | undefined,
  isOptional: boolean,
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined
): void {
  if (bindings === undefined && !isOptional) {
    throwBindingNotFoundError(serviceIdentifier, parentServiceIdentifier);
  } else {
    return;
  }
}

function stringifyParentServiceIdentifier(
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined
): string {
  return parentServiceIdentifier === undefined
    ? `${stringifyServiceIdentifier(serviceIdentifier)} (Root service)`
    : stringifyServiceIdentifier(parentServiceIdentifier);
}
