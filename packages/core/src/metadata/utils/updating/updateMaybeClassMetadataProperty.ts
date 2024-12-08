import { MaybeClassElementMetadata } from "../../types/MaybeClassElementMetadata";
import { MaybeClassMetadata } from "../../types/MaybeClassMetadata";

export function updateMaybeClassMetadataProperty(
  updateMetadata: (
    classElementMetadata: MaybeClassElementMetadata | undefined
  ) => MaybeClassElementMetadata,
  propertyKey: string | symbol
): (classMetadata: MaybeClassMetadata) => MaybeClassMetadata {
  return (classMetadata: MaybeClassMetadata): MaybeClassMetadata => {
    const propertyMetadata: MaybeClassElementMetadata | undefined =
      classMetadata.properties.get(propertyKey);

    classMetadata.properties.set(propertyKey, updateMetadata(propertyMetadata));

    return classMetadata;
  };
}
