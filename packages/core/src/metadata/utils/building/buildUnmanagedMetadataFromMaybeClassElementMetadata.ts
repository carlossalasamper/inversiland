import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { MaybeClassElementMetadata } from "../../types/MaybeClassElementMetadata";
import { buildClassElementMetadataFromMaybeClassElementMetadata } from "./buildClassElementMetadataFromMaybeClassElementMetadata";
import { buildDefaultUnmanagedMetadata } from "./buildDefaultUnmanagedMetadata";
import { buildUnmanagedMetadataFromMaybeManagedMetadata } from "./buildUnmanagedMetadataFromMaybeManagedMetadata";

export const buildUnmanagedMetadataFromMaybeClassElementMetadata: () => (
  metadata: MaybeClassElementMetadata | undefined
) => ClassElementMetadata =
  buildClassElementMetadataFromMaybeClassElementMetadata(
    buildDefaultUnmanagedMetadata,
    buildUnmanagedMetadataFromMaybeManagedMetadata
  );
