import { LegacyMetadata } from './LegacyMetadata';

export interface LegacyMetadataMap {
  [propertyNameOrArgumentIndex: string | symbol]: LegacyMetadata[];
}
