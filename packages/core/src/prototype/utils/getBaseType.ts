import { Newable } from "@inversiland/common";

import { Prototype } from "../types/Prototype";

export function getBaseType<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>
): Newable | undefined {
  const prototype: Prototype | null = Object.getPrototypeOf(
    type.prototype
  ) as Prototype | null;

  const baseType: Newable | undefined = prototype?.constructor;

  return baseType;
}
