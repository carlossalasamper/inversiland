import { Newable, ServiceIdentifier } from "@inversiland/common";

import { Binding } from "../../binding/types/Binding";
import { ClassMetadata } from "../../metadata/types/ClassMetadata";

export interface BasePlanParams {
  getBindings: <TInstance>(
    serviceIdentifier: ServiceIdentifier<TInstance>
  ) => Binding<TInstance>[] | undefined;
  getClassMetadata: (type: Newable) => ClassMetadata;
  servicesBranch: Set<ServiceIdentifier>;
}
