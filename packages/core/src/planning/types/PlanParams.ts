import { BasePlanParams } from './BasePlanParams';
import { PlanParamsConstraint } from './PlanParamsConstraint';

export interface PlanParams extends BasePlanParams {
  rootConstraints: PlanParamsConstraint;
}
