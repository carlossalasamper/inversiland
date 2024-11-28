import { interfaces } from "@carlossalasamper/inversify";

import ModuleMetadata from "./ModuleMetadata";

export default interface InversifySugarOptions {
  /**
   * @description The default scope for bindings (providers prop of @module decorator).
   */
  defaultScope: interfaces.BindingScope;

  /**
   * @description Flag that enables debug mode.
   */
  debug: boolean;

  /**
   * @description Callback that is called when a module is bound.
   * @param metadata The metadata of the module.
   * @returns void
   * */
  onModuleBound: ((metadata: ModuleMetadata) => void) | undefined;
}
