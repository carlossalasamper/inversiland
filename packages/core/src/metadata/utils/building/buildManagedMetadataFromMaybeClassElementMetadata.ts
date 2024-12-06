import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";

import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../types/ClassElementMetadataKind";
import { MaybeClassElementMetadata } from "../../types/MaybeClassElementMetadata";
import { buildClassElementMetadataFromMaybeClassElementMetadata } from "./buildClassElementMetadataFromMaybeClassElementMetadata";
import { buildDefaultManagedMetadata } from "./buildDefaultManagedMetadata";
import { buildManagedMetadataFromMaybeManagedMetadata } from "./buildManagedMetadataFromMaybeManagedMetadata";

export const buildManagedMetadataFromMaybeClassElementMetadata: (
  kind:
    | ClassElementMetadataKind.multipleInjection
    | ClassElementMetadataKind.singleInjection,
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier
) => (metadata: MaybeClassElementMetadata | undefined) => ClassElementMetadata =
  buildClassElementMetadataFromMaybeClassElementMetadata(
    buildDefaultManagedMetadata,
    buildManagedMetadataFromMaybeManagedMetadata
  );
