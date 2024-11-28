import { interfaces, multiInject, tagged } from "@carlossalasamper/inversify";
import { PROVIDED_TAG } from "../constants";
import { DecoratorTarget } from "@carlossalasamper/inversify/lib/annotation/decorator_utils";

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
