import { DynamicValueBinding } from "../../binding/types/DynamicValueBinding";
import { ResolutionParams } from "../types/ResolutionParams";

export function resolveDynamicValueBindingCallback<TActivated>(
  params: ResolutionParams,
  binding: DynamicValueBinding<TActivated>
): TActivated | Promise<TActivated> {
  return binding.value(params.context);
}
