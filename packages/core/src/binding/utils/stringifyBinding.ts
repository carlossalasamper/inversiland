import { stringifyServiceIdentifier } from "@inversiland/common";

import { Binding } from "../types/Binding";
import { bindingTypeValues } from "../types/BindingType";

export function stringifyBinding(binding: Binding<unknown>): string {
  switch (binding.type) {
    case bindingTypeValues.Instance:
      return `[ type: "${
        binding.type
      }", serviceIdentifier: "${stringifyServiceIdentifier(
        binding.serviceIdentifier
      )}", scope: "${binding.scope}", implementationType: "${
        binding.implementationType.name
      }" ]`;
    case bindingTypeValues.ServiceRedirection:
      return `[ type: "${
        binding.type
      }", serviceIdentifier: "${stringifyServiceIdentifier(
        binding.serviceIdentifier
      )}", redirection: "${stringifyServiceIdentifier(
        binding.targetServiceIdentifier
      )}" ]`;
    default:
      return `[ type: "${
        binding.type
      }", serviceIdentifier: "${stringifyServiceIdentifier(
        binding.serviceIdentifier
      )}", scope: "${binding.scope}" ]`;
  }
}
