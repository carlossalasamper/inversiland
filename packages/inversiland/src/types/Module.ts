import { ModuleMetadataArgs } from "./ModuleMetadata";
import Newable from "./Newable";

export type NewableModule = Newable;

export interface DynamicModule extends ModuleMetadataArgs {
  module: Newable;
}

type Module = NewableModule | DynamicModule;

export default Module;
