import { interfaces } from "@carlossalasamper/inversify";
import getServiceIdentifierName from "./getServiceIdentifierName";

const messagesMap = {
  alreadyRunning: "You are trying to run InversifySugar twice.",
  resolveProvider: (
    serviceIdentifier: interfaces.ServiceIdentifier,
    containerId: number
  ) => {
    const serviceIdentifierName = getServiceIdentifierName(serviceIdentifier);

    return `[Provider] Resolving ${serviceIdentifierName} in container ${containerId}.`;
  },
  globalProvidersBound: (containerId: number) =>
    `[Global] Global providers bound in container ${containerId}.`,
  moduleBound: (moduleName: string, containerId: number) =>
    `[@module] ${moduleName} bound in container ${containerId}.`,
  notAModuleImported: (importedItemName: string) =>
    `importModule() was called with a class that is not a module: ${importedItemName}. Skipping...`,
  notAModuleUnbound: (unboundItemName: string) =>
    `unbindModule() was called with a class that is not a module: ${unboundItemName}. Skipping...`,
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
