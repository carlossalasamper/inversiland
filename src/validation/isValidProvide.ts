const isValidProvide = (data: unknown): boolean => {
  return typeof data === "string" || typeof data === "symbol";
};

export default isValidProvide;
