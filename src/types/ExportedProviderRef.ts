import { interfaces } from "inversify";

export default interface ExportedProviderRef<T = unknown> {
  provide: interfaces.ServiceIdentifier<T>;
  multiple: boolean;
  getValue: () => T;
}
