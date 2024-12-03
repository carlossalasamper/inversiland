import { getAllMetadata } from "@inversiland/metadata-utils";

import { MODULE_METADATA_KEYS } from "../constants";
import { NewableModule } from "../types";
import ModuleMetadata from "../types/ModuleMetadata";

export function getModuleMetadata(Module: NewableModule): ModuleMetadata {
  return getAllMetadata(Module.prototype, MODULE_METADATA_KEYS);
}
