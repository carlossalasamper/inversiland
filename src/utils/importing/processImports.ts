import ExportedProviderRef from "../../types/ExportedProviderRef";
import importModule from "./importModule";
import Module, { DynamicModule, NewableModule } from "../../types/Module";
import isNewable from "../validation/isNewable";
import isDynamicModule from "../validation/isDynamicModule";
import importDynamicModule from "./importDynamicModule";
import { getModuleMetadata } from "../metadata/getModuleMetadata";

/**
 * @description This function is used to process imports.
 * It will group all exported providers from different modules with the same 'provide' property.
 * Then you can inject them as an array.
 */
export default function processImports(
  Module: NewableModule,
  imports: Module[]
): ExportedProviderRef[] {
  const { container } = getModuleMetadata(Module);
  const newableModules: NewableModule[] = imports.filter((item) =>
    isNewable(item)
  ) as NewableModule[];
  const dynamicModules: DynamicModule[] = imports.filter((item) =>
    isDynamicModule(item)
  ) as DynamicModule[];
  const allRefs: ExportedProviderRef[] = [];
  const reducedRefs: ExportedProviderRef[] = [];
  const groups: Record<
    string,
    {
      provide: ExportedProviderRef["provide"];
      getters: ExportedProviderRef["getValue"][];
    }
  > = {};

  for (const item of dynamicModules) {
    allRefs.push(...importDynamicModule(item));
  }

  for (const item of newableModules) {
    allRefs.push(...importModule(item));
  }

  for (const ref of allRefs) {
    const key = ref.provide.toString();

    if (groups[key]) {
      groups[key].getters.push(ref.getValue);
    } else {
      Object.assign(groups, {
        [key]: {
          provide: ref.provide,
          getters: [ref.getValue],
        },
      });
    }
  }

  for (const key of Object.keys(groups)) {
    const group = groups[key];
    const multiple = group.getters.length > 1;
    const reducedRef: ExportedProviderRef = {
      provide: group.provide,
      multiple,
      getValue: () => {
        return multiple
          ? group.getters.map((getter) => getter()).flat()
          : group.getters[0]();
      },
    };

    reducedRefs.push(reducedRef);

    container.bindExportedProviderRef(reducedRef);
  }

  return reducedRefs;
}
