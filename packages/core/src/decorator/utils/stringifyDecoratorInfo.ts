import { DecoratorInfo } from "../types/DecoratorInfo";
import { DecoratorInfoKind } from "../types/DecoratorInfoKind";

export function stringifyDecoratorInfo(
  decoratorTargetInfo: DecoratorInfo
): string {
  switch (decoratorTargetInfo.kind) {
    case DecoratorInfoKind.parameter:
      return `[class: "${
        decoratorTargetInfo.targetClass.name
      }", index: "${decoratorTargetInfo.index.toString()}"]`;
    case DecoratorInfoKind.property:
      return `[class: "${
        decoratorTargetInfo.targetClass.name
      }", property: "${decoratorTargetInfo.property.toString()}"]`;
  }
}
