import { Newable } from "@inversiland/common";
import { getMetadata } from "@inversiland/metadata";

import { ClassMetadata } from "../../types/ClassMetadata";
import { LegacyMetadata } from "../../types/LegacyMetadata";
import { POST_CONSTRUCT, PRE_DESTROY } from "../metadataKeys";
import { getClassMetadataConstructorArguments } from "./getClassMetadataConstructorArguments";
import { getClassMetadataProperties } from "./getClassMetadataProperties";

export function getClassMetadata(type: Newable): ClassMetadata {
  const postConstructMetadata: LegacyMetadata | undefined =
    getMetadata<LegacyMetadata>(POST_CONSTRUCT, type);
  const preDestroyMetadata: LegacyMetadata | undefined =
    getMetadata<LegacyMetadata>(PRE_DESTROY, type);

  const classMetadata: ClassMetadata = {
    constructorArguments: getClassMetadataConstructorArguments(type),
    lifecycle: {
      postConstructMethodName: postConstructMetadata?.value as string,
      preDestroyMethodName: preDestroyMetadata?.value as string,
    },
    properties: getClassMetadataProperties(type),
  };

  return classMetadata;
}
