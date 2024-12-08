import { Either } from "@inversiland/common";

import { BaseBinding } from "./BaseBinding";
import { BindingActivation } from "./BindingActivation";
import { BindingDeactivation } from "./BindingDeactivation";
import { BindingScope } from "./BindingScope";
import { BindingType } from "./BindingType";

export interface ScopedBinding<
  TType extends BindingType,
  TScope extends BindingScope,
  TActivated
> extends BaseBinding<TType, TActivated> {
  cache: Either<undefined, TActivated>;
  readonly onActivation: BindingActivation<TActivated> | undefined;
  readonly onDeactivation: BindingDeactivation<TActivated> | undefined;
  readonly scope: TScope;
}
