const isValidProvide = (data: unknown): boolean => {
  return (
    typeof data === "string" ||
    typeof data === "symbol" ||
    (typeof data === "function" && /^\s*class\s+/.test(data.toString()))
  );
};

export default isValidProvide;
