import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";

import { ClassElementMetadataKind } from "../../types/ClassElementMetadataKind";
import { ManagedClassElementMetadata } from "../../types/ManagedClassElementMetadata";

export function buildDefaultManagedMetadata(
  kind:
    | ClassElementMetadataKind.singleInjection
    | ClassElementMetadataKind.multipleInjection,
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier
): ManagedClassElementMetadata {
  return {
    kind,
    name: undefined,
    optional: false,
    tags: new Map(),
    targetName: undefined,
    value: serviceIdentifier,
  };
}
