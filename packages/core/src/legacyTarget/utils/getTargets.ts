import { Newable } from "@inversiland/common";

import { ClassElementMetadata } from "../../metadata/types/ClassElementMetadata";
import { ClassMetadata } from "../../metadata/types/ClassMetadata";
import { LegacyMetadataReader } from "../../metadata/types/LegacyMetadataReader";
import { getClassMetadata } from "../../metadata/utils/getters/getClassMetadata";
import { getClassMetadataFromMetadataReader } from "../../metadata/utils/getters/getClassMetadataFromMetadataReader";
import { getClassMetadataProperties } from "../../metadata/utils/getters/getClassMetadataProperties";
import { getClassMetadataPropertiesFromMetadataReader } from "../../metadata/utils/getters/getClassMetadataPropertiesFromMetadataReader";
import { LegacyTarget } from "../types/LegacyTarget";
import { getTargetsFromMetadataProviders } from "./getTargetsFromMetadataProviders";

export const getTargets: (
  metadataReader?: LegacyMetadataReader
) => (type: Newable) => LegacyTarget[] = (
  metadataReader?: LegacyMetadataReader
): ((type: Newable) => LegacyTarget[]) => {
  const getClassMetadataFn: (type: Newable) => ClassMetadata =
    metadataReader === undefined
      ? getClassMetadata
      : (type: Newable): ClassMetadata =>
          getClassMetadataFromMetadataReader(type, metadataReader);
  const getClassMetadataPropertiesFn: (
    type: Newable
  ) => Map<string | symbol, ClassElementMetadata> =
    metadataReader === undefined
      ? getClassMetadataProperties
      : (type: Newable): Map<string | symbol, ClassElementMetadata> =>
          getClassMetadataPropertiesFromMetadataReader(type, metadataReader);

  return getTargetsFromMetadataProviders(
    getClassMetadataFn,
    getClassMetadataPropertiesFn
  );
};
