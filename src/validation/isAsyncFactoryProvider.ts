/* eslint-disable @typescript-eslint/no-explicit-any */
import isValidProvide from "./isValidProvide";

const isAsyncFactoryProvider = (data: any): boolean => {
  return (
    !!data &&
    typeof data === "object" &&
    isValidProvide(data.provide) &&
    typeof data.useAsyncFactory === "function"
  );
};

export default isAsyncFactoryProvider;
