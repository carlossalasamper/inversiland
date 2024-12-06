import { Newable } from "@inversiland/common";
import { getMetadata } from "@inversiland/metadata";

import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { LegacyMetadata } from "../../types/LegacyMetadata";
import { LegacyMetadataMap } from "../../types/LegacyMetadataMap";
import { TAGGED_PROP } from "../metadataKeys";
import { getPropertyMetadataFromLegacyMetadata } from "./getPropertyMetadataFromLegacyMetadata";

export function getClassMetadataProperties(
  type: Newable
): Map<string | symbol, ClassElementMetadata> {
  const propertiesLegacyMetadata: LegacyMetadataMap | undefined = getMetadata(
    TAGGED_PROP,
    type
  );

  const propertiesMetadata: Map<string | symbol, ClassElementMetadata> =
    new Map();

  if (propertiesLegacyMetadata !== undefined) {
    for (const property of Reflect.ownKeys(propertiesLegacyMetadata)) {
      const legacyMetadata: LegacyMetadata[] = propertiesLegacyMetadata[
        property
      ] as LegacyMetadata[];
      propertiesMetadata.set(
        property,
        getPropertyMetadataFromLegacyMetadata(type, property, legacyMetadata)
      );
    }
  }

  return propertiesMetadata;
}
