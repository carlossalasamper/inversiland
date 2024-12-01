import { interfaces } from "@inversiland/inversify";

import { PROVIDED_TAG } from "../constants";

const providedConstraint: interfaces.ConstraintFunction = (request) => {
  return (
    !!request &&
    (request.target.getCustomTags()?.length === 0 ||
      request.target.hasTag(PROVIDED_TAG))
  );
};

export default providedConstraint;
