import { ResolutionContext } from "../../resolution/types/ResolutionContext";
import { bindingScopeValues } from "./BindingScope";
import { bindingTypeValues } from "./BindingType";
import { Factory } from "./Factory";
import { ScopedBinding } from "./ScopedBinding";

export interface FactoryBinding<TActivated>
  extends ScopedBinding<
    typeof bindingTypeValues.Factory,
    typeof bindingScopeValues.Singleton,
    Factory<TActivated>
  > {
  readonly factory: (context: ResolutionContext) => Factory<TActivated>;
}
