import { interfaces } from "@inversiland/inversify";

import { NewableModule } from "./Module";

export interface ExportedProviderRef<T = unknown> {
  module: NewableModule;
  provide: interfaces.ServiceIdentifier<T>;
  deep?: boolean;
}

export interface DetailedExportedProvider<T = unknown> {
  provide: interfaces.ServiceIdentifier<T>;
  deep?: boolean;
  prototype?: never;
}

export type TokenExportedProvider<T = unknown> =
  interfaces.ServiceIdentifier<T>;

type ExportedProvider<T = unknown> =
  | TokenExportedProvider<T>
  | DetailedExportedProvider<T>;

export default ExportedProvider;
