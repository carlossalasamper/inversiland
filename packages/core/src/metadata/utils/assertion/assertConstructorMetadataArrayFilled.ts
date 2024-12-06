import { Newable } from "@inversiland/common";

import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { ClassElementMetadata } from "../../types/ClassElementMetadata";

export function assertConstructorMetadataArrayFilled(
  type: Newable,
  value: (ClassElementMetadata | undefined)[]
): asserts value is ClassElementMetadata[] {
  const undefinedIndexes: number[] = [];

  // Using a for loop to ensure empty values are traversed as well
  for (let i = 0; i < value.length; ++i) {
    const element: ClassElementMetadata | undefined = value[i];

    if (element === undefined) {
      undefinedIndexes.push(i);
    }
  }

  if (undefinedIndexes.length > 0) {
    throw new InversifyCoreError(
      InversifyCoreErrorKind.missingInjectionDecorator,
      `Found unexpected missing metadata on type "${
        type.name
      }" at constructor indexes "${undefinedIndexes.join('", "')}".

Are you using @inject, @multiInject or @unmanaged decorators at those indexes?

If you're using typescript and want to rely on auto injection, set "emitDecoratorMetadata" compiler option to true`
    );
  }
}
