import { ManagedClassElementMetadata } from "../types/ManagedClassElementMetadata";
import { MaybeClassElementMetadata } from "../types/MaybeClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../types/MaybeManagedClassElementMetadata";
import { MetadataTag } from "../types/MetadataTag";
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from "../utils/building/buildMaybeClassElementMetadataFromMaybeClassElementMetadata";
import { handleInjectionError } from "../utils/errors/handleInjectionError";
import { updateMetadataTag } from "../utils/updating/updateMetadataTag";
import { injectBase } from "./injectBase";

export function tagged(
  key: MetadataTag,
  value: unknown
): ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined
  ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata =
    buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
      updateMetadataTag(key, value)
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
