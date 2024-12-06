import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { ManagedClassElementMetadata } from "../../types/ManagedClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../../types/MaybeManagedClassElementMetadata";
import { MetadataName } from "../../types/MetadataName";

export function updateMetadataName(
  name: MetadataName
): (
  metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata
) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata {
  return (
    metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata
  ): ManagedClassElementMetadata | MaybeManagedClassElementMetadata => {
    if (metadata.name !== undefined) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.injectionDecoratorConflict,
        "Unexpected duplicated named decorator"
      );
    }

    metadata.name = name;

    return metadata;
  };
}
