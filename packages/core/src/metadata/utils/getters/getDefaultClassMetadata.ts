import { ClassMetadata } from "../../types/ClassMetadata";

export function getDefaultClassMetadata(): ClassMetadata {
  return {
    constructorArguments: [],
    lifecycle: {
      postConstructMethodName: undefined,
      preDestroyMethodName: undefined,
    },
    properties: new Map(),
  };
}
