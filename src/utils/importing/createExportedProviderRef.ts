import { Newable } from "../../types";
import ExportedProvider, {
  DetailedExportedProvider,
  TokenExportedProvider,
} from "../../types/ExportedProvider";
import ExportedProviderRef from "../../types/ExportedProviderRef";
import messagesMap from "../messages/messagesMap";
import isDetailedExportedProvider from "../validation/isDetailedExportedProvider";
import { getModuleMetadata } from "../metadata/getModuleMetadata";

export default function createExportedProviderRef(
  Module: Newable,
  exportedProvider: ExportedProvider
): ExportedProviderRef[] {
  const metadata = getModuleMetadata(Module);
  const exportedProviderRefs: ExportedProviderRef[] = [];
  const detailedExportedProvider = (
    isDetailedExportedProvider(exportedProvider)
      ? exportedProvider
      : {
          provide: exportedProvider as TokenExportedProvider,
          deep: false,
          multiple: false,
        }
  ) as DetailedExportedProvider;
  const isBound = detailedExportedProvider.deep
    ? metadata.container.isBound(detailedExportedProvider.provide)
    : metadata.container.isProvided(detailedExportedProvider.provide);
  const getValue = () => {
    const results = detailedExportedProvider.deep
      ? metadata.container.getAll(detailedExportedProvider.provide)
      : metadata.container.getAllProvided(detailedExportedProvider.provide);
    return results.length === 1 ? results[0] : results;
  };

  if (isBound) {
    exportedProviderRefs.push({
      multiple: !!detailedExportedProvider.multiple,
      provide: detailedExportedProvider.provide,
      getValue,
    });
  } else {
    throw new Error(
      messagesMap.notBoundProviderExported(
        Module.name,
        detailedExportedProvider.provide.toString()
      )
    );
  }

  return exportedProviderRefs;
}
