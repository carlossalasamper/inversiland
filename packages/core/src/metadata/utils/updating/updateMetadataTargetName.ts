import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { ManagedClassElementMetadata } from "../../types/ManagedClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../../types/MaybeManagedClassElementMetadata";
import { MetadataTargetName } from "../../types/MetadataTargetName";

export function updateMetadataTargetName(
  targetName: MetadataTargetName
): (
  metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata
) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata {
  return (
    metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata
  ): ManagedClassElementMetadata | MaybeManagedClassElementMetadata => {
    if (metadata.targetName !== undefined) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.injectionDecoratorConflict,
        "Unexpected duplicated targetName decorator"
      );
    }

    metadata.targetName = targetName;

    return metadata;
  };
}
