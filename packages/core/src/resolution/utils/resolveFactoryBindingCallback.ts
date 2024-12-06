import { Factory } from "../../binding/types/Factory";
import { FactoryBinding } from "../../binding/types/FactoryBinding";
import { ResolutionParams } from "../types/ResolutionParams";

export function resolveFactoryBindingCallback(
  params: ResolutionParams,
  binding: FactoryBinding<unknown>
): Factory<unknown> {
  return binding.factory(params.context);
}
