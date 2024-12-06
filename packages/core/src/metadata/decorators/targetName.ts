import { ManagedClassElementMetadata } from "../types/ManagedClassElementMetadata";
import { MaybeClassElementMetadata } from "../types/MaybeClassElementMetadata";
import { MaybeManagedClassElementMetadata } from "../types/MaybeManagedClassElementMetadata";
import { MetadataTargetName } from "../types/MetadataTargetName";
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from "../utils/building/buildMaybeClassElementMetadataFromMaybeClassElementMetadata";
import { handleInjectionError } from "../utils/errors/handleInjectionError";
import { updateMetadataTargetName } from "../utils/updating/updateMetadataTargetName";
import { injectBase } from "./injectBase";

export function targetName(
  targetName: MetadataTargetName
): ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined
  ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata =
    buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
      updateMetadataTargetName(targetName)
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
