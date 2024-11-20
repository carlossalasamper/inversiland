import { interfaces } from "inversify";
import { IMPORTED_TAG } from "../constants";

export default function bindWhenIsImported(
  bindingWhenSyntax: interfaces.BindingWhenSyntax<unknown>
) {
  return bindingWhenSyntax.when((request) => {
    return !request.target.isTagged() || request.target.hasTag(IMPORTED_TAG);
  });
}
