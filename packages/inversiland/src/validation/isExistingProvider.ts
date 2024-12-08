/* eslint-disable @typescript-eslint/no-explicit-any */
import isValidProvide from "./isValidProvide";

const isExistingProvider = (data: any): boolean => {
  return (
    !!data &&
    typeof data === "object" &&
    isValidProvide(data.provide) &&
    isValidProvide(data.useExisting)
  );
};

export default isExistingProvider;
