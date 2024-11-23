export default function getAllMetadata<T>(target: object, keys: string[]): T {
  return keys.reduce((acc, key) => {
    acc[key] = Reflect.getMetadata(key, target);
    return acc;
  }, {} as Record<string, unknown>) as T;
}
