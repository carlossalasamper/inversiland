import { inject, interfaces, tagged } from "@inversiland/inversify";
import { DecoratorTarget } from "@inversiland/inversify";

import { PROVIDED_TAG } from "../constants";

export default function injectProvided(
  serviceIdentifier: interfaces.ServiceIdentifier
) {
  return (
    target: DecoratorTarget,
    targetKey?: string | symbol,
    indexOrPropertyDescriptor?: number | PropertyDescriptor
  ) => {
    inject(serviceIdentifier)(target, targetKey, indexOrPropertyDescriptor);
    tagged(PROVIDED_TAG, true)(target, targetKey, indexOrPropertyDescriptor);
  };
}
