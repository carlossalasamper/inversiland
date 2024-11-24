import { NewableModule } from "../types/Module";
import { IS_MODULE_KEY, MODULE_IS_BOUND_KEY } from "../constants";
import messagesMap from "../messages/messagesMap";
import isNewable from "../validation/isNewable";
import { getModuleMetadata } from "../metadata/getModuleMetadata";
import defineMetadata from "../metadata/defineMetadata";

export default async function unbindModule(Module: NewableModule) {
  const metadata = getModuleMetadata(Module);
  const newableModulesImported: NewableModule[] = metadata.imports.filter(
    (item) => isNewable(item)
  ) as NewableModule[];

  if (metadata.isBound) {
    await metadata.container.unbindAllAsync();
    defineMetadata(MODULE_IS_BOUND_KEY, false, Module.prototype);
  }

  for (const item of newableModulesImported) {
    const isModule = !!Reflect.getMetadata(IS_MODULE_KEY, item.prototype);

    if (isModule) {
      await unbindModule(item);
    } else {
      console.warn(messagesMap.notAModuleUnbound(item.name));
    }
  }
}
