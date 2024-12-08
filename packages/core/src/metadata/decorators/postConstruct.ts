import { updateMetadata } from "@inversiland/metadata";

import { handleInjectionError } from "../utils/errors/handleInjectionError";
import { getDefaultClassMetadata } from "../utils/getters/getDefaultClassMetadata";
import { classMetadataReflectKey } from "../utils/metadataKeys";
import { updateMaybeClassMetadataPostConstructor } from "../utils/updating/updateMaybeClassMetadataPostConstructor";

export function postConstruct(): MethodDecorator {
  return <T>(
    target: object,
    propertyKey: string | symbol,
    _descriptor: TypedPropertyDescriptor<T>
  ): void => {
    try {
      updateMetadata(
        classMetadataReflectKey,
        getDefaultClassMetadata(),
        updateMaybeClassMetadataPostConstructor(propertyKey),
        target.constructor
      );
    } catch (error: unknown) {
      handleInjectionError(target, propertyKey, undefined, error);
    }
  };
}