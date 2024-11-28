const isNewable = (data: unknown): boolean => {
  return data instanceof Function;
};

export default isNewable;
