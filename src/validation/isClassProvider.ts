/* eslint-disable @typescript-eslint/no-explicit-any */

import isUndefined from "./isUndefined";
import isValidProvide from "./isValidProvide";
import isValidScope from "./isValidScope";

const isClassProvider = (data: any) => {
  return (
    !!data &&
    (isValidProvide(data.provide) || isUndefined(data.provide)) &&
    data.useClass instanceof Function &&
    (isValidScope(data.scope) || isUndefined(data.scope))
  );
};

export default isClassProvider;
