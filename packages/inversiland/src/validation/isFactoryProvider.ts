/* eslint-disable @typescript-eslint/no-explicit-any */
import isValidProvide from "./isValidProvide";

const isFactoryProvider = (data: any): boolean => {
  return (
    !!data &&
    typeof data === "object" &&
    isValidProvide(data.provide) &&
    typeof data.useFactory === "function"
  );
};

export default isFactoryProvider;
