export default function getMetadata<T>(
  metadataKey: unknown,
  target: object
): T | undefined {
  return Reflect.getMetadata(metadataKey, target);
}
