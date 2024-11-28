import { interfaces, multiInject, tagged } from "@carlossalasamper/inversify";
import { DecoratorTarget } from "@carlossalasamper/inversify/lib/annotation/decorator_utils";

import { IMPORTED_TAG } from "../constants";

export default function multiInjectImported(
  serviceIdentifier: interfaces.ServiceIdentifier
) {
  return (
    target: DecoratorTarget,
    targetKey?: string | symbol,
    indexOrPropertyDescriptor?: number | PropertyDescriptor
  ) => {
    multiInject(serviceIdentifier)(
      target,
      targetKey,
      indexOrPropertyDescriptor
    );
    tagged(IMPORTED_TAG, true)(target, targetKey, indexOrPropertyDescriptor);
  };
}
