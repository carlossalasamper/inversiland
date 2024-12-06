import { PlanBindingNode } from "../types/PlanBindingNode";
import { PlanServiceNode } from "../types/PlanServiceNode";
import { checkPlanServiceRedirectionBindingNodeSingleInjectionBindings } from "./checkPlanServiceRedirectionBindingNodeSingleInjectionBindings";
import { isPlanServiceRedirectionBindingNode } from "./isPlanServiceRedirectionBindingNode";
import { throwErrorWhenUnexpectedBindingsAmountFound } from "./throwErrorWhenUnexpectedBindingsAmountFound";

const SINGLE_INJECTION_BINDINGS = 1;

export function checkServiceNodeSingleInjectionBindings(
  serviceNode: PlanServiceNode,
  isOptional: boolean
): void {
  if (Array.isArray(serviceNode.bindings)) {
    if (serviceNode.bindings.length === SINGLE_INJECTION_BINDINGS) {
      const [planBindingNode]: [PlanBindingNode] = serviceNode.bindings as [
        PlanBindingNode
      ];

      if (isPlanServiceRedirectionBindingNode(planBindingNode)) {
        checkPlanServiceRedirectionBindingNodeSingleInjectionBindings(
          planBindingNode,
          isOptional
        );
      }

      return;
    }
  }

  throwErrorWhenUnexpectedBindingsAmountFound(
    serviceNode.bindings,
    isOptional,
    serviceNode
  );
}
