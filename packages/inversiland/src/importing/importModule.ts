import { defineMetadata } from "@inversiland/metadata-utils";

import bindProviderToContainer from "../binding/bindProviderToContainer";
import { MODULE_IS_BOUND_KEY } from "../constants";
import createExportedProviderRef from "../exporting/createExportedProviderRef";
import Inversiland from "../inversiland/Inversiland";
import messagesMap from "../messages/messagesMap";
import { getModuleMetadata } from "../metadata/getModuleMetadata";
import { Newable } from "../types";
import { ExportedProviderRef } from "../types/ExportedProvider";
import { NewableModule } from "../types/Module";
import bindImportsToModule from "./bindImportsToModule";

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
      bindProviderToContainer(provider, Inversiland.globalContainer);
    }

    defineMetadata(MODULE_IS_BOUND_KEY, true, Module.prototype);

    Inversiland.onModuleBound(Module);
  }
}

function importChildModule(Module: NewableModule): ExportedProviderRef[] {
  const metadata = getModuleMetadata(Module);
  const exportedProviderRefs: ExportedProviderRef[] = [];

  if (!metadata.isBound) {
    bindImportsToModule(Module, metadata.imports);

    for (const globalProvider of metadata.globalProviders) {
      bindProviderToContainer(
        globalProvider,
        Inversiland.globalContainer,
        metadata.container.innerContainer
      );
    }

    for (const provider of metadata.providers) {
      metadata.container.bindProvider(provider);
    }

    defineMetadata(MODULE_IS_BOUND_KEY, true, Module.prototype);

    Inversiland.onModuleBound(Module);
  }

  for (const exportedProvider of metadata.exports) {
    exportedProviderRefs.push(
      createExportedProviderRef(Module, exportedProvider)
    );
  }

  return exportedProviderRefs;
}
