/* eslint-disable @typescript-eslint/no-explicit-any */
export default function defineMetadata(
  metadataKey: any,
  metadataValue: any,
  target: object
) {
  Reflect.defineMetadata(metadataKey, metadataValue, target);
}
