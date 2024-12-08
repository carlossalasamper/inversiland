import { ServiceIdentifier } from "@inversiland/common";

import { MetadataName } from "../../metadata/types/MetadataName";
import { PlanParamsTagConstraint } from "./PlanParamsTagConstraint";

export interface PlanParamsConstraint {
  name?: MetadataName;
  isMultiple: boolean;
  serviceIdentifier: ServiceIdentifier;
  tag?: PlanParamsTagConstraint;
}
