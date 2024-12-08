import { getAllMetadata } from "@inversiland/metadata";

import { MODULE_METADATA_KEYS } from "../constants";
import { NewableModule } from "../types";
import ModuleMetadata from "../types/ModuleMetadata";

export function getModuleMetadata(Module: NewableModule): ModuleMetadata {
  return getAllMetadata(MODULE_METADATA_KEYS, Module.prototype);
}
