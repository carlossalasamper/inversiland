/* eslint-disable @typescript-eslint/no-explicit-any */
import isValidProvide from "./isValidProvide";

const isValueProvider = (data: any): boolean => {
  return (
    !!data &&
    typeof data === "object" &&
    isValidProvide(data.provide) &&
    data.useValue !== undefined
  );
};

export default isValueProvider;
