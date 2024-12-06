import { BasePlanParams } from './BasePlanParams';
import { PlanServiceNodeParent } from './PlanServiceNodeParent';

export interface SubplanParams extends BasePlanParams {
  node: PlanServiceNodeParent;
}
