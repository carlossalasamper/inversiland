import { interfaces, multiInject, tagged } from "@inversiland/inversify";
import { DecoratorTarget } from "@inversiland/inversify";

import { PROVIDED_TAG } from "../constants";

export default function multiInjectProvided(
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
    tagged(PROVIDED_TAG, true)(target, targetKey, indexOrPropertyDescriptor);
  };
}
