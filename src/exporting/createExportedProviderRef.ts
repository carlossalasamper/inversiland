import ExportedProvider, {
  ExportedProviderRef,
} from "../types/ExportedProvider";
import Module, { DynamicModule, NewableModule } from "../types/Module";
import getDynamicModuleName from "../messages/getDynamicModuleName";
import messagesMap from "../messages/messagesMap";
import { getModuleMetadata } from "../metadata/getModuleMetadata";
import castToDetailedExportedProvider from "../providers/castToDetailedExportedProvider";
import isDynamicModule from "../validation/isDynamicModule";
import isNewable from "../validation/isNewable";

export default function createExportedProviderRef(
  module: Module,
  exportedProvider: ExportedProvider
): ExportedProviderRef {
  const detailedExportedProvider =
    castToDetailedExportedProvider(exportedProvider);
  let hasProvider = false;
  let newableModule: NewableModule;
  let exportedProviderRef;
  let moduleName;

  if (isNewable(module)) {
    newableModule = module as NewableModule;
    moduleName = newableModule.name;
  } else if (isDynamicModule(module)) {
    const dynamicModule = module as DynamicModule;

    newableModule = dynamicModule.module;
    moduleName = getDynamicModuleName(dynamicModule);
  } else {
    throw new Error(messagesMap.unknownModuleType);
  }

  const metadata = getModuleMetadata(newableModule);
  hasProvider = detailedExportedProvider.deep
    ? metadata.container.isProvided(detailedExportedProvider.provide) ||
      metadata.container.isImported(detailedExportedProvider.provide)
    : metadata.container.isProvided(detailedExportedProvider.provide);

  if (hasProvider) {
    exportedProviderRef = {
      module: newableModule,
      ...detailedExportedProvider,
    };
  } else {
    throw new Error(
      messagesMap.notBoundProviderExported(
        moduleName,
        detailedExportedProvider.provide
      )
    );
  }

  return exportedProviderRef;
}
