/* eslint-disable @typescript-eslint/no-explicit-any */
export default function hasOwnMetadata(metadataKey: any, target: object) {
  return Reflect.hasOwnMetadata(metadataKey, target);
}
