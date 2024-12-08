import { getModuleMetadata } from "../metadata/getModuleMetadata";
import { Newable, Provider } from "../types";

export const bindProviderToModule = (provider: Provider, Module: Newable) => {
  const metatadata = getModuleMetadata(Module);
  const { container } = metatadata;

  container.bindProvider(provider);
};
