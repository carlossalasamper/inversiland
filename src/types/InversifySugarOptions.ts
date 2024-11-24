import { interfaces } from "@carlossalasamper/inversify";
import ModuleMetadata from "./ModuleMetadata";
import Newable from "./Newable";
import ModuleContainer from "../modules/ModuleContainer";

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
   * @param container The container that is used to import the module.
   * @param metadata The metadata of the module.
   * @param Module The module that is bound.
   * @returns void
   * */
  onModuleBound:
    | ((
        container: ModuleContainer,
        metadata: ModuleMetadata,
        Module: Newable
      ) => void)
    | undefined;
}
