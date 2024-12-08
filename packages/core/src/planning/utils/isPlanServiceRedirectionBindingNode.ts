import { BindingNodeParent } from "../types/BindingNodeParent";
import { PlanBindingNode } from "../types/PlanBindingNode";
import { PlanServiceRedirectionBindingNode } from "../types/PlanServiceRedirectionBindingNode";

export function isPlanServiceRedirectionBindingNode(
  node: PlanBindingNode | BindingNodeParent
): node is PlanServiceRedirectionBindingNode {
  return (
    (node as Partial<PlanServiceRedirectionBindingNode>).redirections !==
    undefined
  );
}
