import { interfaces, multiInject as inversifyMultiInject } from "inversify";
import { DecoratorTarget } from "inversify/lib/annotation/decorator_utils";

export default function multiInject<T = unknown>(
  serviceIdentifier: interfaces.ServiceIdentifier
) {
  return (
    target: DecoratorTarget,
    targetKey?: string | symbol,
    indexOrPropertyDescriptor?: number | TypedPropertyDescriptor<T>
  ) => {
    inversifyMultiInject(serviceIdentifier)(
      target,
      targetKey,
      indexOrPropertyDescriptor
    );
  };
}
