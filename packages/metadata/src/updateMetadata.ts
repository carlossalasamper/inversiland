import defineMetadata from "./defineMetadata";
import getMetadata from "./getMetadata";

export default function updateMetadata<TMetadata>(
  metadataKey: unknown,
  defaultMetadataValue: TMetadata,
  callback: (metadataValue: TMetadata) => TMetadata,
  target: object
): void {
  const metadataValue: TMetadata =
    getMetadata(metadataKey, target) ?? defaultMetadataValue;
  const updatedMetadataValue: TMetadata = callback(metadataValue);

  defineMetadata(metadataKey, updatedMetadataValue, target);
}
