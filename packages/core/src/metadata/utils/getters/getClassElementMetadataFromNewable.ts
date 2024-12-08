import { Newable } from "@inversiland/common";

import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../types/ClassElementMetadataKind";

export function getClassElementMetadataFromNewable(
  type: Newable
): ClassElementMetadata {
  return {
    kind: ClassElementMetadataKind.singleInjection,
    name: undefined,
    optional: false,
    tags: new Map(),
    targetName: undefined,
    value: type,
  };
}
