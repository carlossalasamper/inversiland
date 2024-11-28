import ModuleContainer from "../modules/ModuleContainer";
import ExportedProvider from "./ExportedProvider";
import Module from "./Module";
import Provider from "./Provider";

/**
 * @description Interface defining the property object that describes the module.
 */
export interface ModuleMetadataArgs {
  /**
   * @description Optional list of submodules defined in this module which have to be
   * registered.
   */
  imports?: Module[];

  /**
   * @description Optional list of providers defined in this module which have to be
   * registered.
   */
  providers?: Provider[];

  /**
   * @description Optional list of providers exported from this module.
   */
  exports?: ExportedProvider[];
}

export default interface ModuleMetadata {
  id: number;
  isModule: true;
  isBound: boolean;
  container: ModuleContainer;
  imports: Module[];
  providers: Provider[];
  globalProviders: Provider[];
  exports: ExportedProvider[];
}
