import { LegacyTargetImpl } from "./legacyTarget/models/LegacyTargetImpl";
import { LegacyTarget } from "./legacyTarget/types/LegacyTarget";
import { LegacyTargetType } from "./legacyTarget/types/LegacyTargetType";
import { getTargets } from "./legacyTarget/utils/getTargets";
import { ClassElementMetadata } from "./metadata/types/ClassElementMetadata";
import { ClassElementMetadataKind } from "./metadata/types/ClassElementMetadataKind";
import { ClassMetadata } from "./metadata/types/ClassMetadata";
import { ClassMetadataLifecycle } from "./metadata/types/ClassMetadataLifecycle";
import { LegacyMetadata } from "./metadata/types/LegacyMetadata";
import { LegacyMetadataMap } from "./metadata/types/LegacyMetadataMap";
import { LegacyMetadataReader } from "./metadata/types/LegacyMetadataReader";
import { ManagedClassElementMetadata } from "./metadata/types/ManagedClassElementMetadata";
import { MetadataName } from "./metadata/types/MetadataName";
import { MetadataTag } from "./metadata/types/MetadataTag";
import { MetadataTargetName } from "./metadata/types/MetadataTargetName";
import { UnmanagedClassElementMetadata } from "./metadata/types/UnmanagedClassElementMetadata";
import { getClassElementMetadataFromLegacyMetadata } from "./metadata/utils/getters/getClassElementMetadataFromLegacyMetadata";
import { getClassMetadata } from "./metadata/utils/getters/getClassMetadata";
import { getClassMetadataFromMetadataReader } from "./metadata/utils/getters/getClassMetadataFromMetadataReader";
import { LegacyQueryableString } from "./string/types/LegacyQueryableString";

export type {
  ClassElementMetadata,
  ClassMetadata,
  ClassMetadataLifecycle,
  LegacyMetadata,
  LegacyMetadataMap,
  LegacyMetadataReader,
  LegacyQueryableString,
  LegacyTarget,
  LegacyTargetType,
  ManagedClassElementMetadata,
  MetadataName,
  MetadataTag,
  MetadataTargetName,
  UnmanagedClassElementMetadata,
};

export {
  ClassElementMetadataKind,
  getClassElementMetadataFromLegacyMetadata,
  getClassMetadata,
  getClassMetadataFromMetadataReader,
  getTargets,
  LegacyTargetImpl,
};
