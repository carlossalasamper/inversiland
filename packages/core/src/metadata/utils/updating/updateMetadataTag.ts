import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { ManagedClassElementMetadata } from "../../types/ManagedClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../../types/MaybeManagedClassElementMetadata";
import { MetadataTag } from "../../types/MetadataTag";

export function updateMetadataTag(
  key: MetadataTag,
  value: unknown
): (
  metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata
) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata {
  return (
    metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata
  ): ManagedClassElementMetadata | MaybeManagedClassElementMetadata => {
    if (metadata.tags.has(key)) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.injectionDecoratorConflict,
        "Unexpected duplicated tag decorator with existing tag"
      );
    }

    metadata.tags.set(key, value);

    return metadata;
  };
}
