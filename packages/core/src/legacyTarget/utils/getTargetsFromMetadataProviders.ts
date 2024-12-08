import { Newable } from "@inversiland/common";

import { ClassElementMetadata } from "../../metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../metadata/types/ClassElementMetadataKind";
import { ClassMetadata } from "../../metadata/types/ClassMetadata";
import { getBaseType } from "../../prototype/utils/getBaseType";
import { LegacyTargetImpl } from "../models/LegacyTargetImpl";
import { LegacyTarget } from "../types/LegacyTarget";

export function getTargetsFromMetadataProviders(
  getClassMetadata: (type: Newable) => ClassMetadata,
  getClassMetadataProperties: (
    type: Newable
  ) => Map<string | symbol, ClassElementMetadata>
): (type: Newable) => LegacyTarget[] {
  return function getTagets(type: Newable): LegacyTarget[] {
    const classMetadata: ClassMetadata = getClassMetadata(type);

    let baseType: Newable | undefined = getBaseType(type);

    while (baseType !== undefined && baseType !== Object) {
      const classMetadataProperties: Map<
        string | symbol,
        ClassElementMetadata
      > = getClassMetadataProperties(baseType);

      for (const [propertyKey, propertyValue] of classMetadataProperties) {
        if (!classMetadata.properties.has(propertyKey)) {
          classMetadata.properties.set(propertyKey, propertyValue);
        }
      }

      baseType = getBaseType(baseType);
    }

    const targets: LegacyTarget[] = [];

    for (const constructorArgument of classMetadata.constructorArguments) {
      if (constructorArgument.kind !== ClassElementMetadataKind.unmanaged) {
        const targetName: string = constructorArgument.targetName ?? "";

        targets.push(
          new LegacyTargetImpl(
            targetName,
            constructorArgument,
            "ConstructorArgument"
          )
        );
      }
    }

    for (const [property, metadata] of classMetadata.properties) {
      if (metadata.kind !== ClassElementMetadataKind.unmanaged) {
        const targetName: string | symbol = metadata.targetName ?? property;

        targets.push(
          new LegacyTargetImpl(targetName, metadata, "ClassProperty")
        );
      }
    }

    return targets;
  };
}
