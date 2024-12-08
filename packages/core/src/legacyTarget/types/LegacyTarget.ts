import { ServiceIdentifier } from "@inversiland/common";

import { LegacyMetadata } from "../../metadata/types/LegacyMetadata";
import { MetadataName } from "../../metadata/types/MetadataName";
import { MetadataTag } from "../../metadata/types/MetadataTag";
import { LegacyQueryableString } from "../../string/types/LegacyQueryableString";
import { LegacyTargetType } from "./LegacyTargetType";

export interface LegacyTarget {
  id: number;
  serviceIdentifier: ServiceIdentifier;
  type: LegacyTargetType;
  name: LegacyQueryableString;
  identifier: string | symbol;
  metadata: LegacyMetadata[];
  getNamedTag(): LegacyMetadata<MetadataName> | null;
  getCustomTags(): LegacyMetadata[] | null;
  hasTag(key: MetadataTag): boolean;
  isArray(): boolean;
  matchesArray(name: ServiceIdentifier): boolean;
  isNamed(): boolean;
  isTagged(): boolean;
  isOptional(): boolean;
  matchesNamedTag(name: MetadataName): boolean;
  matchesTag(key: MetadataTag): (value: unknown) => boolean;
}
