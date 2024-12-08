import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";

import { ClassElementMetadataKind } from "../../types/ClassElementMetadataKind";
import { ManagedClassElementMetadata } from "../../types/ManagedClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../../types/MaybeManagedClassElementMetadata";

export function buildManagedMetadataFromMaybeManagedMetadata(
  metadata: MaybeManagedClassElementMetadata,
  kind:
    | ClassElementMetadataKind.singleInjection
    | ClassElementMetadataKind.multipleInjection,
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier
): ManagedClassElementMetadata {
  return {
    ...metadata,
    kind,
    value: serviceIdentifier,
  };
}
