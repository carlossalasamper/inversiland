import { DecoratorInfo } from "../../../decorator/types/DecoratorInfo";
import { getDecoratorInfo } from "../../../decorator/utils/getDecoratorInfo";
import { stringifyDecoratorInfo } from "../../../decorator/utils/stringifyDecoratorInfo";
import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";

export function handleInjectionError(
  target: object,
  propertyKey: string | symbol | undefined,
  parameterIndex: number | undefined,
  error: unknown
): never {
  if (
    InversifyCoreError.isErrorOfKind(
      error,
      InversifyCoreErrorKind.injectionDecoratorConflict
    )
  ) {
    const info: DecoratorInfo = getDecoratorInfo(
      target,
      propertyKey,
      parameterIndex
    );
    throw new InversifyCoreError(
      InversifyCoreErrorKind.injectionDecoratorConflict,
      `Unexpected injection error.

Cause:

${error.message}

Details

${stringifyDecoratorInfo(info)}`,
      { cause: error }
    );
  }

  throw error;
}
