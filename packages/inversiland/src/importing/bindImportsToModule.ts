import { PROVIDED_TAG } from "../constants";
import importedConstraint from "../constraints/importedConstraint";
import { getModuleMetadata } from "../metadata/getModuleMetadata";
import { ExportedProviderRef } from "../types/ExportedProvider";
import Module, { DynamicModule, NewableModule } from "../types/Module";
import isDynamicModule from "../validation/isDynamicModule";
import isNewable from "../validation/isNewable";
import importDynamicModule from "./importDynamicModule";
import importModule from "./importModule";

/**
 * @description This function is used to bind the imports array to module.
 */
export default function bindImportsToModule(
  Module: NewableModule,
  imports: Module[]
): void {
  const { container } = getModuleMetadata(Module);
  const newableModules: NewableModule[] = imports.filter((item) =>
    isNewable(item)
  ) as NewableModule[];
  const dynamicModules: DynamicModule[] = imports.filter((item) =>
    isDynamicModule(item)
  ) as DynamicModule[];
  const exportedProviderRefs: ExportedProviderRef[] = [];

  for (const dynamicModule of dynamicModules) {
    exportedProviderRefs.push(...importDynamicModule(dynamicModule));
  }

  for (const newableModule of newableModules) {
    exportedProviderRefs.push(...importModule(newableModule));
  }

  for (const exportedProviderRef of exportedProviderRefs) {
    const metadata = getModuleMetadata(exportedProviderRef.module);

    container.copyBindings(
      metadata.container,
      [exportedProviderRef.provide],
      exportedProviderRef.deep
        ? undefined
        : {
            key: PROVIDED_TAG,
            value: true,
          },
      importedConstraint
    );
  }
}
