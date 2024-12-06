/* eslint-disable @typescript-eslint/ban-types */
import { InversifyCoreError } from "../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../error/types/InversifyCoreErrorKind";
import { DecoratorInfo } from "../types/DecoratorInfo";
import { DecoratorInfoKind } from "../types/DecoratorInfoKind";

export function getDecoratorInfo(
  target: object,
  propertyKey: undefined,
  parameterIndex: number
): DecoratorInfo;
export function getDecoratorInfo(
  target: object,
  propertyKey: string | symbol
): DecoratorInfo;
export function getDecoratorInfo(
  target: object,
  propertyKey: string | symbol | undefined,
  parameterIndex?: number | undefined
): DecoratorInfo;
export function getDecoratorInfo(
  target: object,
  propertyKey: string | symbol | undefined,
  parameterIndex?: number | undefined
): DecoratorInfo {
  if (parameterIndex === undefined) {
    if (propertyKey === undefined) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.unknown,
        "Unexpected undefined property and index values"
      );
    }

    return {
      kind: DecoratorInfoKind.property,
      property: propertyKey,
      targetClass: target.constructor,
    };
  }

  return {
    index: parameterIndex,
    kind: DecoratorInfoKind.parameter,
    targetClass: target as Function,
  };
}
