import { ManagedClassElementMetadata } from "../types/ManagedClassElementMetadata";
import { MaybeClassElementMetadata } from "../types/MaybeClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../types/MaybeManagedClassElementMetadata";
import { MetadataName } from "../types/MetadataName";
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from "../utils/building/buildMaybeClassElementMetadataFromMaybeClassElementMetadata";
import { handleInjectionError } from "../utils/errors/handleInjectionError";
import { updateMetadataName } from "../utils/updating/updateMetadataName";
import { injectBase } from "./injectBase";

export function named(
  name: MetadataName
): ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined
  ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata =
    buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
      updateMetadataName(name)
    );

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
