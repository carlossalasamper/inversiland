import { ExportedProviderRef } from "../types/ExportedProvider";
import { DynamicModule } from "../types/Module";
import { WithIsGlobal } from "../types/Provider";
import bindProviderToContainer from "../binding/bindProviderToContainer";
import createExportedProviderRef from "../exporting/createExportedProviderRef";
import { getModuleMetadata } from "../metadata/getModuleMetadata";
import InversifySugar from "../inversifySugar/InversifySugar";

export default function importDynamicModule(
  dynamicModule: DynamicModule
): ExportedProviderRef[] {
  const providers = dynamicModule.providers.filter(
    (provider) => !(<WithIsGlobal>provider).isGlobal
  );
  const globalProviders = dynamicModule.providers.filter(
    (provider) => !!(<WithIsGlobal>provider).isGlobal
  );
  const exports = dynamicModule.exports || [];
  const metadata = getModuleMetadata(dynamicModule.module);
  const exportedProviderRefs: ExportedProviderRef[] = [];

  // TODO: bindImportsToModule(dynamicModule.module, dynamicModule.imports);

  for (const provider of globalProviders) {
    bindProviderToContainer(provider, InversifySugar.globalContainer);
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
