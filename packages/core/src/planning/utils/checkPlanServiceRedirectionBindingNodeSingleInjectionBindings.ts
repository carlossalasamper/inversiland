import { PlanBindingNode } from "../types/PlanBindingNode";
import { PlanServiceRedirectionBindingNode } from "../types/PlanServiceRedirectionBindingNode";
import { isPlanServiceRedirectionBindingNode } from "./isPlanServiceRedirectionBindingNode";
import { throwErrorWhenUnexpectedBindingsAmountFound } from "./throwErrorWhenUnexpectedBindingsAmountFound";

const SINGLE_INJECTION_BINDINGS = 1;

export function checkPlanServiceRedirectionBindingNodeSingleInjectionBindings(
  serviceRedirectionBindingNode: PlanServiceRedirectionBindingNode,
  isOptional: boolean
): void {
  if (
    serviceRedirectionBindingNode.redirections.length ===
    SINGLE_INJECTION_BINDINGS
  ) {
    const [planBindingNode]: [PlanBindingNode] =
      serviceRedirectionBindingNode.redirections as [PlanBindingNode];

    if (isPlanServiceRedirectionBindingNode(planBindingNode)) {
      checkPlanServiceRedirectionBindingNodeSingleInjectionBindings(
        planBindingNode,
        isOptional
      );
    }

    return;
  }

  throwErrorWhenUnexpectedBindingsAmountFound(
    serviceRedirectionBindingNode.redirections,
    isOptional,
    serviceRedirectionBindingNode
  );
}
