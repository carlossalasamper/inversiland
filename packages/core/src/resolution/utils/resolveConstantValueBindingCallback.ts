import { InversifyCoreError } from "../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../error/types/InversifyCoreErrorKind";

export function resolveConstantValueBindingCallback(): never {
  throw new InversifyCoreError(
    InversifyCoreErrorKind.unknown,
    "Expected constant value binding with value, none found"
  );
}
