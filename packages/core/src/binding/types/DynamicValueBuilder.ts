import { ResolutionContext } from "../../resolution/types/ResolutionContext";

export type DynamicValueBuilder<T> = (
  context: ResolutionContext
) => T | Promise<T>;
