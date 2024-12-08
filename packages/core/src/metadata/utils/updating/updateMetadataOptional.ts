import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { ManagedClassElementMetadata } from "../../types/ManagedClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../../types/MaybeManagedClassElementMetadata";

export function updateMetadataOptional(
  metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata
): ManagedClassElementMetadata | MaybeManagedClassElementMetadata {
  if (metadata.optional) {
    throw new InversifyCoreError(
      InversifyCoreErrorKind.injectionDecoratorConflict,
      "Unexpected duplicated optional decorator"
    );
  }

  metadata.optional = true;

  return metadata;
}
