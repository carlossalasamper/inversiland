import { interfaces } from "@carlossalasamper/inversify";
import getServiceIdentifierName from "./getServiceIdentifierName";

const messagesMap = {
  alreadyRunning: "You are trying to run InversifySugar twice.",
  resolveProvider: (
    serviceIdentifier: interfaces.ServiceIdentifier,
    containerId: number
  ) => {
    const serviceIdentifierName = getServiceIdentifierName(serviceIdentifier);

    return `[provider] Resolving ${serviceIdentifierName} in container ${containerId}.`;
  },
  moduleProvidersBinded: (moduleName: string) =>
    `[@module] ${moduleName} providers binded.`,
  notAModuleImported: (importedItemName: string) =>
    `importModule() was called with a class that is not a module: ${importedItemName}. Skipping...`,
  notAModuleUnbinded: (unbindedItemName: string) =>
    `unbindModule() was called with a class that is not a module: ${unbindedItemName}. Skipping...`,
  notBoundProviderExported: (
    moduleName: string,
    provide: interfaces.ServiceIdentifier
  ) =>
    `You are trying to export a provider that is not bound in the module ${moduleName}: ${getServiceIdentifierName(
      provide
    )}.`,
  unknownProviderType: "Unknown provider type.",
  unknownExportedProviderType: "Unknown exported provider type.",
  unknownModuleType: "Unknown module type.",
};

export default messagesMap;
