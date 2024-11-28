import { inject, interfaces, tagged } from "@carlossalasamper/inversify";
import { IMPORTED_TAG } from "../constants";
import { DecoratorTarget } from "@carlossalasamper/inversify/lib/annotation/decorator_utils";

export default function injectImported(
  serviceIdentifier: interfaces.ServiceIdentifier
) {
  return (
    target: DecoratorTarget,
    targetKey?: string | symbol,
    indexOrPropertyDescriptor?: number | PropertyDescriptor
  ) => {
    inject(serviceIdentifier)(target, targetKey, indexOrPropertyDescriptor);
    tagged(IMPORTED_TAG, true)(target, targetKey, indexOrPropertyDescriptor);
  };
}
