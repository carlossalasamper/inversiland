import { PlanServiceNode } from './PlanServiceNode';
import { PlanServiceRedirectionBindingNode } from './PlanServiceRedirectionBindingNode';

export type BindingNodeParent =
  | PlanServiceNode
  | PlanServiceRedirectionBindingNode;
