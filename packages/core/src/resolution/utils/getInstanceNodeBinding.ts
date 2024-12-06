import { InstanceBinding } from "../../binding/types/InstanceBinding";
import { InstanceBindingNode } from "../../planning/types/InstanceBindingNode";

export function getInstanceNodeBinding<TActivated>(
  node: InstanceBindingNode<InstanceBinding<TActivated>>
): InstanceBinding<TActivated> {
  return node.binding;
}
