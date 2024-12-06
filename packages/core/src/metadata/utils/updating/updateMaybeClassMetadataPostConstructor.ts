import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { MaybeClassMetadata } from "../../types/MaybeClassMetadata";

export function updateMaybeClassMetadataPostConstructor(
  methodName: string | symbol
): (metadata: MaybeClassMetadata) => MaybeClassMetadata {
  return (metadata: MaybeClassMetadata): MaybeClassMetadata => {
    if (metadata.lifecycle.postConstructMethodName !== undefined) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.injectionDecoratorConflict,
        "Unexpected duplicated postConstruct decorator"
      );
    }

    metadata.lifecycle.postConstructMethodName = methodName;

    return metadata;
  };
}
