import { interfaces, METADATA_KEY } from '../inversify';
import { Metadata } from '../planning/metadata';

function getTargetMetadata(
  isMultiInject: boolean,
  serviceIdentifier: interfaces.ServiceIdentifier,
  key: string | number | symbol | undefined,
  value: unknown,
): Metadata[] {
  const metadataKey: string = isMultiInject
    ? METADATA_KEY.MULTI_INJECT_TAG
    : METADATA_KEY.INJECT_TAG;

  const metadataList: Metadata[] = [
    new Metadata(metadataKey, serviceIdentifier),
  ];

  if (key !== undefined) {
    metadataList.push(new Metadata(key, value));
  }

  return metadataList;
}

export { getTargetMetadata };
