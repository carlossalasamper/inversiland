import { NewableModule } from "../../types/Module";
import { IS_MODULE_KEY } from "../constants";
import messagesMap from "../messages/messagesMap";
import isNewable from "../validation/isNewable";
import { getModuleMetadata } from "../metadata/getModuleMetadata";

export default async function unbindModule(Module: NewableModule) {
  const metadata = getModuleMetadata(Module);
  const newableModulesImported: NewableModule[] = metadata.imports.filter(
    (item) => isNewable(item)
  ) as NewableModule[];

  if (metadata.isBinded) {
    await metadata.container.unbindAllAsync();
    metadata.isBinded = false;
  }

  for (const item of newableModulesImported) {
    const isModule = !!Reflect.getMetadata(IS_MODULE_KEY, item.prototype);

    if (isModule) {
      await unbindModule(item);
    } else {
      console.warn(messagesMap.notAModuleUnbinded(item.name));
    }
  }
}
