import { interfaces } from "@inversiland/inversify";

import ModuleMetadata from "./types/ModuleMetadata";

export const IS_MODULE_KEY: keyof ModuleMetadata = "isModule";

export const MODULE_IS_BOUND_KEY: keyof ModuleMetadata = "isBound";

export const MODULE_METADATA_KEYS: (keyof ModuleMetadata)[] = [
  "id",
  "isModule",
  "isBound",
  "container",
  "imports",
  "providers",
  "globalProviders",
  "exports",
];

export const SCOPE_KEYS: (keyof interfaces.BindingScopeEnum)[] = [
  "Transient",
  "Request",
  "Singleton",
];

export const PROVIDED_TAG = Symbol.for("provided");

export const IMPORTED_TAG = Symbol.for("imported");
