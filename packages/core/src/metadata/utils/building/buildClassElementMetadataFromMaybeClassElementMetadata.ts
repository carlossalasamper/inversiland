import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { MaybeClassElementMetadata } from "../../types/MaybeClassElementMetadata";
import { MaybeClassElementMetadataKind } from "../../types/MaybeClassElementMetadataKind";
import { MaybeManagedClassElementMetadata } from "../../types/MaybeManagedClassElementMetadata";

export function buildClassElementMetadataFromMaybeClassElementMetadata<
  TParams extends unknown[]
>(
  buildDefaultMetadata: (...params: TParams) => ClassElementMetadata,
  buildMetadataFromMaybeManagedMetadata: (
    metadata: MaybeManagedClassElementMetadata,
    ...params: TParams
  ) => ClassElementMetadata
): (
  ...params: TParams
) => (metadata: MaybeClassElementMetadata | undefined) => ClassElementMetadata {
  return (...params: TParams) =>
    (metadata: MaybeClassElementMetadata | undefined): ClassElementMetadata => {
      if (metadata === undefined) {
        return buildDefaultMetadata(...params);
      }

      switch (metadata.kind) {
        case MaybeClassElementMetadataKind.unknown:
          return buildMetadataFromMaybeManagedMetadata(metadata, ...params);
        default:
          throw new InversifyCoreError(
            InversifyCoreErrorKind.injectionDecoratorConflict,
            "Unexpected injection found. Multiple @inject, @multiInject or @unmanaged decorators found"
          );
      }
    };
}
