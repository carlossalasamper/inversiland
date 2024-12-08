/* eslint-disable @typescript-eslint/no-explicit-any */

import isNewable from "./isNewable";

const isDynamicModule = (data: any) => {
  return (
    !!data &&
    typeof data === "object" &&
    "module" in data &&
    isNewable(data.module) &&
    "providers" in data &&
    Array.isArray(data.providers)
  );
};

export default isDynamicModule;
