import { interfaces } from "@carlossalasamper/inversify";

import { IMPORTED_TAG } from "../constants";

const importedConstraint: interfaces.ConstraintFunction = (request) => {
  return (
    !!request &&
    (request.target.getCustomTags()?.length === 0 ||
      request.target.hasTag(IMPORTED_TAG))
  );
};

export default importedConstraint;
