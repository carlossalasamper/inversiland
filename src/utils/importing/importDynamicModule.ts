/* eslint-disable @typescript-eslint/no-explicit-any */
import { InversifySugar } from "../../classes";
import ExportedProviderRef from "../../types/ExportedProviderRef";
import { DynamicModule } from "../../types/Module";
import bindProviderToContainer from "../binding/bindProviderToContainer";
import createExportedProviderRef from "./createExportedProviderRef";
import { getModuleMetadata } from "../metadata/getModuleMetadata";

export default function importDynamicModule({
  module,
  providers: allProviders,
  exports = [],
}: DynamicModule) {
  const exportedProviderRefs: ExportedProviderRef[] = [];
  const providers = allProviders.filter((provider: any) => !provider.isGlobal);
  const globalProviders = allProviders.filter(
    (provider: any) => !!provider.isGlobal
  );
  const { container } = getModuleMetadata(module);

  for (const provider of globalProviders) {
    bindProviderToContainer(provider, InversifySugar.globalContainer);
  }

  for (const provider of providers) {
    container.bindProvider(provider);
  }

  for (const exportedProvider of exports) {
    exportedProviderRefs.push(
      ...createExportedProviderRef(module, exportedProvider)
    );
  }

  return exportedProviderRefs;
}
