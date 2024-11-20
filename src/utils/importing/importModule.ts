import { Newable } from "../../types";
import InversifySugar from "../../classes/InversifySugar";
import messagesMap from "../messages/messagesMap";
import ExportedProviderRef from "../../types/ExportedProviderRef";
import createExportedProviderRef from "./createExportedProviderRef";
import processImports from "./processImports";
import { MODULE_IS_BINDED_KEY } from "../constants";
import bindProviderToContainer from "../binding/bindProviderToContainer";
import { NewableModule } from "../../types/Module";
import { getModuleMetadata } from "../metadata/getModuleMetadata";

export default function importModule(
  Module: Newable,
  isRoot = false
): ExportedProviderRef[] {
  const metadata = getModuleMetadata(Module);
  const exportedProviders: ExportedProviderRef[] = [];

  if (metadata.isModule) {
    if (isRoot) {
      importRootModule(Module);
    } else {
      exportedProviders.push(...importChildModule(Module));
    }
  } else {
    console.warn(messagesMap.notAModuleImported(Module.name));
  }

  return exportedProviders;
}

/**
 * @description This function is used to import a root module.
 * @param Module
 * @returns
 */
function importRootModule(Module: NewableModule) {
  const metadata = getModuleMetadata(Module);

  if (!metadata.isBinded) {
    for (const provider of metadata.providers.concat(
      ...metadata.globalProviders
    )) {
      bindProviderToContainer(provider, InversifySugar.globalContainer);
    }
    InversifySugar.onModuleBinded(metadata.container, metadata, Module);

    processImports(Module, metadata.imports);

    Reflect.defineMetadata(MODULE_IS_BINDED_KEY, true, Module.prototype);
  }
}

/**
 * @description This function is used to import a child module.
 * @param Module
 */
function importChildModule(Module: NewableModule) {
  const metadata = getModuleMetadata(Module);
  const exportedProviderRefs: ExportedProviderRef[] = [];

  if (!metadata.isBinded) {
    processImports(Module, metadata.imports);

    for (const provider of metadata.providers) {
      metadata.container.bindProvider(provider);
    }

    for (const provider of metadata.globalProviders) {
      bindProviderToContainer(provider, InversifySugar.globalContainer);
    }

    InversifySugar.onModuleBinded(metadata.container, metadata, Module);

    Reflect.defineMetadata(MODULE_IS_BINDED_KEY, true, Module.prototype);
  }

  for (const exportedProvider of metadata.exports) {
    exportedProviderRefs.push(
      ...createExportedProviderRef(Module, exportedProvider)
    );
  }

  return exportedProviderRefs;
}
