import { ServiceIdentifier } from "@inversiland/common";

import { Binding } from "./Binding";

export interface BindingService {
  get<TInstance>(
    serviceIdentifier: ServiceIdentifier<TInstance>
  ): Binding<TInstance>[] | undefined;
  remove(serviceIdentifier: ServiceIdentifier): void;
  removeByModule(moduleId: number): void;
  set<TInstance>(binding: Binding<TInstance>): void;
}
