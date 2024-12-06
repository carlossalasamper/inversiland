import { ClassElementMetadataKind } from "../../types/ClassElementMetadataKind";
import { UnmanagedClassElementMetadata } from "../../types/UnmanagedClassElementMetadata";

export function buildDefaultUnmanagedMetadata(): UnmanagedClassElementMetadata {
  return {
    kind: ClassElementMetadataKind.unmanaged,
  };
}
