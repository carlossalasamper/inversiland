import { inject, interfaces, tagged } from "inversify";
import { DecoratorTarget } from "inversify/lib/annotation/decorator_utils";
import { IMPORTED_TAG } from "../utils/constants";

export default function injectImported<T = unknown>(
  serviceIdentifier: interfaces.ServiceIdentifier
) {
  return (
    target: DecoratorTarget,
    targetKey?: string | symbol,
    indexOrPropertyDescriptor?: number | TypedPropertyDescriptor<T>
  ) => {
    inject(serviceIdentifier)(target, targetKey, indexOrPropertyDescriptor);
    tagged(IMPORTED_TAG, true)(target, targetKey, indexOrPropertyDescriptor);
  };
}
