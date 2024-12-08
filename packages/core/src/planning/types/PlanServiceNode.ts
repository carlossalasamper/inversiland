import { ServiceIdentifier } from "@inversiland/common";

import { PlanBindingNode } from "./PlanBindingNode";
import { PlanServiceNodeParent } from "./PlanServiceNodeParent";

export interface PlanServiceNode {
  readonly bindings: PlanBindingNode | PlanBindingNode[] | undefined;
  readonly parent: PlanServiceNodeParent | undefined;
  readonly serviceIdentifier: ServiceIdentifier;
}
