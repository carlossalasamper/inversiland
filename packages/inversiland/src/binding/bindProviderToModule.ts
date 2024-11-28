import { Newable, Provider } from "../types";
import { getModuleMetadata } from "../metadata/getModuleMetadata";

export const bindProviderToModule = (provider: Provider, Module: Newable) => {
  const metatadata = getModuleMetadata(Module);
  const { container } = metatadata;

  container.bindProvider(provider);
};
