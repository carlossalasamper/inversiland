import {
  BindingScope,
  bindingScopeValues,
} from "../../binding/types/BindingScope";
import { BindingType } from "../../binding/types/BindingType";
import { ScopedBinding } from "../../binding/types/ScopedBinding";
import { ResolutionParams } from "../types/ResolutionParams";

export function resolveScoped<
  TActivated,
  TArg,
  TType extends BindingType,
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>
>(
  getBinding: (arg: TArg) => TBinding,
  resolve: (params: ResolutionParams, arg: TArg) => TActivated
): (params: ResolutionParams, arg: TArg) => TActivated {
  return (params: ResolutionParams, arg: TArg): TActivated => {
    const binding: TBinding = getBinding(arg);

    switch (binding.scope) {
      case bindingScopeValues.Singleton: {
        if (binding.cache.isRight) {
          return binding.cache.value;
        }

        const resolvedValue: TActivated = resolve(params, arg);

        binding.cache = {
          isRight: true,
          value: resolvedValue,
        };

        return resolvedValue;
      }
      case bindingScopeValues.Request: {
        if (params.requestScopeCache.has(binding.id)) {
          return params.requestScopeCache.get(binding.id) as TActivated;
        }

        const resolvedValue: TActivated = resolve(params, arg);

        params.requestScopeCache.set(binding.id, resolvedValue);

        return resolvedValue;
      }
      case bindingScopeValues.Transient:
        return resolve(params, arg);
    }
  };
}
