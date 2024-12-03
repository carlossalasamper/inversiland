/* eslint-disable @typescript-eslint/no-explicit-any */
export default function hasMetadata(metadataKey: any, target: object) {
  return Reflect.hasMetadata(metadataKey, target);
}
