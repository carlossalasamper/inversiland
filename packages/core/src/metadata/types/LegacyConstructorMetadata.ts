import { LegacyMetadataMap } from './LegacyMetadataMap';

export interface LegacyConstructorMetadata {
  compilerGeneratedMetadata: NewableFunction[] | undefined;
  userGeneratedMetadata: LegacyMetadataMap;
}
