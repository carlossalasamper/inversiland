import { ServiceRedirectionBinding } from "../../binding/types/ServiceRedirectionBinding";
import { BaseBindingNode } from "./BaseBindingNode";
import { PlanBindingNode } from "./PlanBindingNode";

export interface PlanServiceRedirectionBindingNode<
  TBinding extends // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ServiceRedirectionBinding<any> = ServiceRedirectionBinding<any>
> extends BaseBindingNode<TBinding> {
  redirections: PlanBindingNode[];
}
