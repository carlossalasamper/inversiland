/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "@inversiland/inversify";

export default function bindScope(
  binding: interfaces.BindingInWhenOnSyntax<any>,
  scope: interfaces.BindingScope
): interfaces.BindingWhenOnSyntax<any> {
  const scopeMethodKeys: Record<
    interfaces.BindingScope,
    keyof interfaces.BindingInSyntax<any>
  > = {
    Transient: "inTransientScope",
    Request: "inRequestScope",
    Singleton: "inSingletonScope",
  };

  return binding[scopeMethodKeys[scope]]();
}
