import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";

import { ClassElementMetadata } from "../types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../types/ClassElementMetadataKind";
import { MaybeClassElementMetadata } from "../types/MaybeClassElementMetadata";
import { buildManagedMetadataFromMaybeClassElementMetadata } from "../utils/building/buildManagedMetadataFromMaybeClassElementMetadata";
import { handleInjectionError } from "../utils/errors/handleInjectionError";
import { injectBase } from "./injectBase";

export function multiInject(
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier
): ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    classElementMetadata: MaybeClassElementMetadata | undefined
  ) => ClassElementMetadata = buildManagedMetadataFromMaybeClassElementMetadata(
    ClassElementMetadataKind.multipleInjection,
    serviceIdentifier
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
