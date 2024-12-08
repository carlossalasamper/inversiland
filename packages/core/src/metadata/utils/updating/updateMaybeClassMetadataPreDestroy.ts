import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { MaybeClassMetadata } from "../../types/MaybeClassMetadata";

export function updateMaybeClassMetadataPreDestroy(
  methodName: string | symbol
): (metadata: MaybeClassMetadata) => MaybeClassMetadata {
  return (metadata: MaybeClassMetadata): MaybeClassMetadata => {
    if (metadata.lifecycle.preDestroyMethodName !== undefined) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.injectionDecoratorConflict,
        "Unexpected duplicated preDestroy decorator"
      );
    }

    metadata.lifecycle.preDestroyMethodName = methodName;

    return metadata;
  };
}
