import { Newable } from "@inversiland/common";

import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { LegacyMetadata } from "../../types/LegacyMetadata";
import { LegacyMetadataMap } from "../../types/LegacyMetadataMap";
import { LegacyMetadataReader } from "../../types/LegacyMetadataReader";
import { getPropertyMetadataFromLegacyMetadata } from "./getPropertyMetadataFromLegacyMetadata";

export function getClassMetadataPropertiesFromMetadataReader(
  type: Newable,
  metadataReader: LegacyMetadataReader
): Map<string | symbol, ClassElementMetadata> {
  const propertiesLegacyMetadata: LegacyMetadataMap =
    metadataReader.getPropertiesMetadata(type);

  const propertiesMetadata: Map<string | symbol, ClassElementMetadata> =
    new Map();

  for (const property of Reflect.ownKeys(propertiesLegacyMetadata)) {
    const legacyMetadata: LegacyMetadata[] = propertiesLegacyMetadata[
      property
    ] as LegacyMetadata[];
    propertiesMetadata.set(
      property,
      getPropertyMetadataFromLegacyMetadata(type, property, legacyMetadata)
    );
  }

  return propertiesMetadata;
}
