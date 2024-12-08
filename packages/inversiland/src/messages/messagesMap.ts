import { getServiceIdentifierName } from "@inversiland/common";
import { interfaces } from "@inversiland/inversify";

import { InversilandLogLevelType } from "../types/InversilandLogLevel";

const messagesMap = {
  alreadyRunning: "You are trying to run Inversiland twice.",
  providerRequested: (
    serviceIdentifier: interfaces.ServiceIdentifier,
    containerId: number
  ) => {
    const serviceIdentifierName = getServiceIdentifierName(serviceIdentifier);

    return `[Container ${containerId}] Requested ${serviceIdentifierName}.`;
  },
  globalProvidersBound: (
    containerId: number,
    logLevel: InversilandLogLevelType
  ) => {
    let message = "";

    if (logLevel == "debug") {
      message = `[Global] Global providers bound in container ${containerId}.`;
    } else if (logLevel == "info") {
      message = "[Global] Global providers bound.";
    }

    return message;
  },
  moduleBound: (
    moduleName: string,
    containerId: number,
    logLevel: InversilandLogLevelType
  ) => {
    let message = "";

    if (logLevel == "debug") {
      message = `[@module] ${moduleName} bound in container ${containerId}.`;
    } else if (logLevel == "info") {
      message = `[@module] ${moduleName} bound.`;
    }

    return message;
  },
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
