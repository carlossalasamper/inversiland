import { bindingScopeValues } from "../../binding/types/BindingScope";
import { BindingType } from "../../binding/types/BindingType";
import { ScopedBinding } from "../../binding/types/ScopedBinding";
import { ResolutionParams } from "../types/ResolutionParams";

export function resolveSingletonScopedBinding<
  TActivated,
  TType extends BindingType,
  TBinding extends ScopedBinding<
    TType,
    typeof bindingScopeValues.Singleton,
    TActivated
  >
>(
  resolve: (params: ResolutionParams, binding: TBinding) => TActivated
): (params: ResolutionParams, binding: TBinding) => TActivated {
  return (params: ResolutionParams, binding: TBinding): TActivated => {
    if (binding.cache.isRight) {
      return binding.cache.value;
    }

    const resolvedValue: TActivated = resolve(params, binding);

    binding.cache = {
      isRight: true,
      value: resolvedValue,
    };

    return resolvedValue;
  };
}
