import { Newable } from "../types";
import InversifySugar from "../inversifySugar/InversifySugar";
import messagesMap from "../messages/messagesMap";
import bindImportsToModule from "./bindImportsToModule";
import { MODULE_IS_BOUND_KEY } from "../constants";
import bindProviderToContainer from "../binding/bindProviderToContainer";
import { NewableModule } from "../types/Module";
import { getModuleMetadata } from "../metadata/getModuleMetadata";
import defineMetadata from "../metadata/defineMetadata";
import { ExportedProviderRef } from "../types/ExportedProvider";
import createExportedProviderRef from "../exporting/createExportedProviderRef";

/**
 * @description This function is used to import a module.
 * @param Module
 * @param isRoot
 */
export default function importModule(
  Module: Newable,
  isRoot = false
): ExportedProviderRef[] {
  const metadata = getModuleMetadata(Module);
  const exportedProviderRefs: ExportedProviderRef[] = [];

  if (metadata.isModule) {
    if (isRoot) {
      importRootModule(Module);
    } else {
      exportedProviderRefs.push(...importChildModule(Module));
    }
  } else {
    console.warn(messagesMap.notAModuleImported(Module.name));
  }

  return exportedProviderRefs;
}

function importRootModule(Module: NewableModule) {
  const metadata = getModuleMetadata(Module);

  if (!metadata.isBound) {
    bindImportsToModule(Module, metadata.imports);

    for (const provider of metadata.providers.concat(
      ...metadata.globalProviders
    )) {
      bindProviderToContainer(provider, InversifySugar.globalContainer);
    }

    InversifySugar.onModuleBound(metadata.container, metadata, Module);

    defineMetadata(MODULE_IS_BOUND_KEY, true, Module.prototype);
  }
}

function importChildModule(Module: NewableModule): ExportedProviderRef[] {
  const metadata = getModuleMetadata(Module);
  const exportedProviderRefs: ExportedProviderRef[] = [];

  if (!metadata.isBound) {
    bindImportsToModule(Module, metadata.imports);

    for (const provider of metadata.globalProviders) {
      bindProviderToContainer(provider, InversifySugar.globalContainer);
    }

    for (const provider of metadata.providers) {
      metadata.container.bindProvider(provider);
    }

    InversifySugar.onModuleBound(metadata.container, metadata, Module);

    defineMetadata(MODULE_IS_BOUND_KEY, true, Module.prototype);
  }

  for (const exportedProvider of metadata.exports) {
    exportedProviderRefs.push(
      createExportedProviderRef(Module, exportedProvider)
    );
  }

  return exportedProviderRefs;
}
