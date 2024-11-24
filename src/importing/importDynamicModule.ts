import { ExportedProviderRef } from "../types/ExportedProvider";
import { DynamicModule } from "../types/Module";
import Provider, { WithIsGlobal } from "../types/Provider";
import bindProviderToContainer from "../binding/bindProviderToContainer";
import createExportedProviderRef from "../exporting/createExportedProviderRef";
import { getModuleMetadata } from "../metadata/getModuleMetadata";
import InversifySugar from "../inversifySugar/InversifySugar";
import bindImportsToModule from "./bindImportsToModule";

export default function importDynamicModule(
  dynamicModule: DynamicModule
): ExportedProviderRef[] {
  const metadata = getModuleMetadata(dynamicModule.module);
  const imports = dynamicModule.imports || [];
  const exports = dynamicModule.exports || [];
  const allProviders: Provider[] = dynamicModule.providers || [];
  const providers = allProviders.filter(
    (provider) => !(<WithIsGlobal>provider).isGlobal
  );
  const globalProviders = allProviders.filter(
    (provider) => !!(<WithIsGlobal>provider).isGlobal
  );
  const exportedProviderRefs: ExportedProviderRef[] = [];

  bindImportsToModule(dynamicModule.module, imports);

  for (const globalProvider of globalProviders) {
    bindProviderToContainer(
      globalProvider,
      InversifySugar.globalContainer,
      metadata.container.innerContainer
    );
  }

  for (const provider of providers) {
    metadata.container.bindProvider(provider);
  }

  for (const exportedProvider of exports) {
    exportedProviderRefs.push(
      createExportedProviderRef(dynamicModule, exportedProvider)
    );
  }

  return exportedProviderRefs;
}
