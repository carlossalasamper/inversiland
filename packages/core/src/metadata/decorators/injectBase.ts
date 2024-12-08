import { updateMetadata as utilsUpdateMetadata } from "@inversiland/metadata";

import { MaybeClassElementMetadata } from "../types/MaybeClassElementMetadata";
import { getDefaultClassMetadata } from "../utils/getters/getDefaultClassMetadata";
import { classMetadataReflectKey } from "../utils/metadataKeys";
import { updateMaybeClassMetadataConstructorArgument } from "../utils/updating/updateMaybeClassMetadataConstructorArgument";
import { updateMaybeClassMetadataProperty } from "../utils/updating/updateMaybeClassMetadataProperty";

export function injectBase(
  updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined
  ) => MaybeClassElementMetadata
): ParameterDecorator & PropertyDecorator {
  const decorator: ParameterDecorator & PropertyDecorator = (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number
  ): void => {
    if (parameterIndex === undefined) {
      injectProperty(updateMetadata)(target, propertyKey as string | symbol);
    } else {
      injectParameter(updateMetadata)(target, propertyKey, parameterIndex);
    }
  };

  return decorator;
}

function injectParameter(
  updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined
  ) => MaybeClassElementMetadata
): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ): void => {
    if (isConstructorParameter(target, propertyKey)) {
      utilsUpdateMetadata(
        classMetadataReflectKey,
        getDefaultClassMetadata(),
        updateMaybeClassMetadataConstructorArgument(
          updateMetadata,
          parameterIndex
        ),
        target
      );
    } else {
      throw new Error(
        `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method "${
          propertyKey?.toString() ?? ""
        }" at class "${target.constructor.name}"`
      );
    }
  };
}

function injectProperty(
  updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined
  ) => MaybeClassElementMetadata
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    utilsUpdateMetadata(
      classMetadataReflectKey,
      getDefaultClassMetadata(),
      updateMaybeClassMetadataProperty(updateMetadata, propertyKey),
      target.constructor
    );
  };
}

function isConstructorParameter(
  target: unknown,
  propertyKey: string | symbol | undefined
): boolean {
  return typeof target === "function" && propertyKey === undefined;
}
