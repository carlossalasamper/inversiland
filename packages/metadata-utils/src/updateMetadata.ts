import defineMetadata from "./defineMetadata";
import getMetadata from "./getMetadata";

export default function updateMetadata<TMetadata>(
  target: object,
  metadataKey: unknown,
  defaultMetadataValue: TMetadata,
  callback: (metadataValue: TMetadata) => TMetadata
): void {
  const metadataValue: TMetadata =
    getMetadata(metadataKey, target) ?? defaultMetadataValue;
  const updatedMetadataValue: TMetadata = callback(metadataValue);

  defineMetadata(metadataKey, updatedMetadataValue, target);
}
