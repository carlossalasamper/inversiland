import "reflect-metadata";

export function clearMetadata(target: object) {
  const keys = Reflect.getMetadataKeys(target);

  keys.forEach((key) => {
    Reflect.deleteMetadata(key, target);
  });
}
