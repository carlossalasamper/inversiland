import { MaybeClassElementMetadataKind } from "../../types/MaybeClassElementMetadataKind";
import { MaybeManagedClassElementMetadata } from "../../types/MaybeManagedClassElementMetadata";

export function buildDefaultMaybeClassElementMetadata(): MaybeManagedClassElementMetadata {
  return {
    kind: MaybeClassElementMetadataKind.unknown,
    name: undefined,
    optional: false,
    tags: new Map(),
    targetName: undefined,
  };
}
