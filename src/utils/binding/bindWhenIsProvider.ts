import { interfaces } from "inversify";
import { PROVIDED_TAG } from "../constants";

export default function bindWhenIsProvider(
  bindingWhenSyntax: interfaces.BindingWhenSyntax<unknown>
) {
  return bindingWhenSyntax.when((request) => {
    return !request.target.isTagged() || request.target.hasTag(PROVIDED_TAG);
  });
}
