import { inject, interfaces, tagged } from "inversify";
import { DecoratorTarget } from "inversify/lib/annotation/decorator_utils";
import { PROVIDED_TAG } from "../utils/constants";

export default function injectProvided<T = unknown>(
  serviceIdentifier: interfaces.ServiceIdentifier
) {
  return (
    target: DecoratorTarget,
    targetKey?: string | symbol,
    indexOrPropertyDescriptor?: number | TypedPropertyDescriptor<T>
  ) => {
    inject(serviceIdentifier)(target, targetKey, indexOrPropertyDescriptor);
    tagged(PROVIDED_TAG, true)(target, targetKey, indexOrPropertyDescriptor);
  };
}
