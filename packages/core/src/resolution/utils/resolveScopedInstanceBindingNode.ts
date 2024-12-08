import { InstanceBinding } from "../../binding/types/InstanceBinding";
import { InstanceBindingNode } from "../../planning/types/InstanceBindingNode";
import { ResolutionParams } from "../types/ResolutionParams";
import { getInstanceNodeBinding } from "./getInstanceNodeBinding";
import { resolveScoped } from "./resolveScoped";

export const resolveScopedInstanceBindingNode: <TActivated>(
  resolve: (
    params: ResolutionParams,
    node: InstanceBindingNode<InstanceBinding<TActivated>>
  ) => TActivated
) => (
  params: ResolutionParams,
  node: InstanceBindingNode<InstanceBinding<TActivated>>
) => TActivated = <TActivated>(
  resolve: (
    params: ResolutionParams,
    node: InstanceBindingNode<InstanceBinding<TActivated>>
  ) => TActivated
) => resolveScoped(getInstanceNodeBinding, resolve);
