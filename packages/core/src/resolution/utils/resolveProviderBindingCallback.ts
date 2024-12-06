import { Provider } from "../../binding/types/Provider";
import { ProviderBinding } from "../../binding/types/ProviderBinding";
import { ResolutionParams } from "../types/ResolutionParams";

export function resolveProviderBindingCallback<TActivated>(
  params: ResolutionParams,
  binding: ProviderBinding<TActivated>
): Provider<TActivated> {
  return binding.provider(params.context);
}
