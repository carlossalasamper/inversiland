import { interfaces } from "inversify";

export interface DetailedExportedProvider<T = unknown> {
  provide: interfaces.ServiceIdentifier<T>;
  multiple?: boolean;
  deep?: boolean;
  prototype?: never;
}

export type TokenExportedProvider<T = unknown> =
  interfaces.ServiceIdentifier<T>;

type ExportedProvider<T = unknown> =
  | TokenExportedProvider<T>
  | DetailedExportedProvider<T>;

export default ExportedProvider;
