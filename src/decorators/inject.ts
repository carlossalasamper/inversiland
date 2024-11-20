import { interfaces, inject as inversifyInject } from "inversify";
import { DecoratorTarget } from "inversify/lib/annotation/decorator_utils";

export default function inject<T = unknown>(
  serviceIdentifier: interfaces.ServiceIdentifier
) {
  return (
    target: DecoratorTarget,
    targetKey?: string | symbol,
    indexOrPropertyDescriptor?: number | TypedPropertyDescriptor<T>
  ) => {
    inversifyInject(serviceIdentifier)(
      target,
      targetKey,
      indexOrPropertyDescriptor
    );
  };
}
