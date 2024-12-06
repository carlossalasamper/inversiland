import { Newable } from "@inversiland/common";
import { getMetadata } from "@inversiland/metadata";

import { ClassMetadata } from "../../types/ClassMetadata";
import { LegacyMetadata } from "../../types/LegacyMetadata";
import { LegacyMetadataReader } from "../../types/LegacyMetadataReader";
import { POST_CONSTRUCT, PRE_DESTROY } from "../metadataKeys";
import { getClassMetadataConstructorArgumentsFromMetadataReader } from "./getClassMetadataConstructorArgumentsFromMetadataReader";
import { getClassMetadataPropertiesFromMetadataReader } from "./getClassMetadataPropertiesFromMetadataReader";

export function getClassMetadataFromMetadataReader(
  type: Newable,
  metadataReader: LegacyMetadataReader
): ClassMetadata {
  const postConstructMetadata: LegacyMetadata | undefined =
    getMetadata<LegacyMetadata>(POST_CONSTRUCT, type);
  const preDestroyMetadata: LegacyMetadata | undefined =
    getMetadata<LegacyMetadata>(PRE_DESTROY, type);

  const classMetadata: ClassMetadata = {
    constructorArguments:
      getClassMetadataConstructorArgumentsFromMetadataReader(
        type,
        metadataReader
      ),
    lifecycle: {
      postConstructMethodName: postConstructMetadata?.value as string,
      preDestroyMethodName: preDestroyMetadata?.value as string,
    },
    properties: getClassMetadataPropertiesFromMetadataReader(
      type,
      metadataReader
    ),
  };

  return classMetadata;
}
