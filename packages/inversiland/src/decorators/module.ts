import defineMetadata from "../metadata/defineMetadata";
import ModuleContainer from "../modules/ModuleContainer";
import { Newable } from "../types";
import ModuleMetadata, { ModuleMetadataArgs } from "../types/ModuleMetadata";
import { WithIsGlobal } from "../types/Provider";

export default function module({
  imports = [],
  providers: allProviders = [],
  exports = [],
}: ModuleMetadataArgs) {
  return (target: Newable) => {
    const providers = allProviders.filter(
      (provider) => !(<WithIsGlobal>provider).isGlobal
    );
    const globalProviders = allProviders.filter(
      (provider) => !!(<WithIsGlobal>provider).isGlobal
    );
    const metadata: ModuleMetadata = {
      id: new Date().getTime(),
      isModule: true,
      isBound: false,
      container: new ModuleContainer(),
      imports,
      providers,
      globalProviders,
      exports,
    };

    for (const key in metadata) {
      if (metadata.hasOwnProperty(key)) {
        defineMetadata(
          key,
          metadata[key as keyof ModuleMetadata],
          target.prototype
        );
      }
    }
  };
}
