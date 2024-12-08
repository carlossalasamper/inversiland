import { Newable } from "@inversiland/common";
import { getMetadata } from "@inversiland/metadata";

import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { LegacyMetadataMap } from "../../types/LegacyMetadataMap";
import { assertConstructorMetadataArrayFilled } from "../assertion/assertConstructorMetadataArrayFilled";
import { DESIGN_PARAM_TYPES, TAGGED } from "../metadataKeys";
import { getClassElementMetadataFromNewable } from "./getClassElementMetadataFromNewable";
import { getConstructorArgumentMetadataFromLegacyMetadata } from "./getConstructorArgumentMetadataFromLegacyMetadata";

export function getClassMetadataConstructorArguments(
  type: Newable
): ClassElementMetadata[] {
  const typescriptMetadataList: Newable[] | undefined = getMetadata(
    DESIGN_PARAM_TYPES,
    type
  );

  const constructorParametersLegacyMetadata: LegacyMetadataMap | undefined =
    getMetadata(TAGGED, type);

  const constructorArgumentsMetadata: (ClassElementMetadata | undefined)[] = [];

  if (constructorParametersLegacyMetadata !== undefined) {
    for (const [stringifiedIndex, metadataList] of Object.entries(
      constructorParametersLegacyMetadata
    )) {
      const index: number = parseInt(stringifiedIndex);

      constructorArgumentsMetadata[index] =
        getConstructorArgumentMetadataFromLegacyMetadata(
          type,
          index,
          metadataList
        );
    }
  }

  if (typescriptMetadataList !== undefined) {
    for (let i = 0; i < typescriptMetadataList.length; ++i) {
      if (constructorArgumentsMetadata[i] === undefined) {
        const typescriptMetadata: Newable = typescriptMetadataList[
          i
        ] as Newable;

        constructorArgumentsMetadata[i] =
          getClassElementMetadataFromNewable(typescriptMetadata);
      }
    }
  }

  assertConstructorMetadataArrayFilled(type, constructorArgumentsMetadata);

  return constructorArgumentsMetadata;
}
