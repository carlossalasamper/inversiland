import { interfaces } from "@inversiland/inversify";

import { InversilandLogLevelType } from "./InversilandLogLevel";
import ModuleMetadata from "./ModuleMetadata";

export default interface InversilandOptions {
  /**
   * @description The default scope for bindings (providers prop of @module decorator).
   */
  defaultScope: interfaces.BindingScope;

  /**
   * @description Configures the log level.
   * @default "info"
   */
  logLevel: InversilandLogLevelType;

  /**
   * @description Callback that is called when a module is bound.
   * @param metadata The metadata of the module.
   * @returns void
   * */
  onModuleBound: ((metadata: ModuleMetadata) => void) | undefined;
}
