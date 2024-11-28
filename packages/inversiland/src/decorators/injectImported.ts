import { inject, interfaces, tagged } from "@carlossalasamper/inversify";
import { DecoratorTarget } from "@carlossalasamper/inversify/lib/annotation/decorator_utils";

import { IMPORTED_TAG } from "../constants";

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
