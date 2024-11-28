import messagesMap from "../messages/messagesMap";
import ExportedProvider, {
  DetailedExportedProvider,
  TokenExportedProvider,
} from "../types/ExportedProvider";
import isDetailedExportedProvider from "../validation/isDetailedExportedProvider";
import isTokenExportedProvider from "../validation/isTokenExportedProvider";

export default function castToDetailedExportedProvider(
  exportedProvider: ExportedProvider
): DetailedExportedProvider {
  let detailedExportedProvider: DetailedExportedProvider;

  if (isDetailedExportedProvider(exportedProvider)) {
    detailedExportedProvider = exportedProvider as DetailedExportedProvider;
  } else if (isTokenExportedProvider(exportedProvider)) {
    const tokenExportedProvider = exportedProvider as TokenExportedProvider;
    detailedExportedProvider = {
      provide: tokenExportedProvider,
      deep: false,
    };
  } else {
    throw new Error(messagesMap.unknownExportedProviderType);
  }

  return detailedExportedProvider;
}
