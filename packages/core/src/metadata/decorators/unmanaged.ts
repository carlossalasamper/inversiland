import { ClassElementMetadata } from "../types/ClassElementMetadata";
import { MaybeClassElementMetadata } from "../types/MaybeClassElementMetadata";
import { buildUnmanagedMetadataFromMaybeClassElementMetadata } from "../utils/building/buildUnmanagedMetadataFromMaybeClassElementMetadata";
import { handleInjectionError } from "../utils/errors/handleInjectionError";
import { injectBase } from "./injectBase";

export function unmanaged(): ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    classElementMetadata: MaybeClassElementMetadata | undefined
  ) => ClassElementMetadata =
    buildUnmanagedMetadataFromMaybeClassElementMetadata();

  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number
  ): void => {
    try {
      if (parameterIndex === undefined) {
        injectBase(updateMetadata)(target, propertyKey as string | symbol);
      } else {
        injectBase(updateMetadata)(target, propertyKey, parameterIndex);
      }
    } catch (error: unknown) {
      handleInjectionError(target, propertyKey, parameterIndex, error);
    }
  };
}
