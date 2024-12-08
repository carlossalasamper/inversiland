export default function getAllMetadata<T>(
  metadataKeys: string[],
  target: object
): T {
  return metadataKeys.reduce((acc, key) => {
    acc[key] = Reflect.getMetadata(key, target);
    return acc;
  }, {} as Record<string, unknown>) as T;
}
