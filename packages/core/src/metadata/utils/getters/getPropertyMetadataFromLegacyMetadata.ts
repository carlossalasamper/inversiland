import { Newable } from "@inversiland/common";

import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { LegacyMetadata } from "../../types/LegacyMetadata";
import { getClassElementMetadataFromLegacyMetadata } from "./getClassElementMetadataFromLegacyMetadata";

export function getPropertyMetadataFromLegacyMetadata(
  type: Newable,
  key: string | symbol,
  metadataList: LegacyMetadata[]
): ClassElementMetadata {
  try {
    return getClassElementMetadataFromLegacyMetadata(metadataList);
  } catch (error: unknown) {
    if (
      InversifyCoreError.isErrorOfKind(
        error,
        InversifyCoreErrorKind.missingInjectionDecorator
      )
    ) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.missingInjectionDecorator,
        `Expected a single @inject, @multiInject or @unmanaged decorator at type "${
          type.name
        }" at property "${key.toString()}"`,
        { cause: error }
      );
    } else {
      throw error;
    }
  }
}
