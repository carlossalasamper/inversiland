import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../types/ClassElementMetadataKind";
import { LegacyMetadata } from "../../types/LegacyMetadata";
import { ManagedClassElementMetadata } from "../../types/ManagedClassElementMetadata";
import {
  INJECT_TAG,
  MULTI_INJECT_TAG,
  NAME_TAG,
  NAMED_TAG,
  OPTIONAL_TAG,
  UNMANAGED_TAG,
} from "../metadataKeys";

export function getLegacyMetadata(
  classElementMetadata: ClassElementMetadata
): LegacyMetadata[] {
  switch (classElementMetadata.kind) {
    case ClassElementMetadataKind.unmanaged:
      return getUnmanagedLegacyMetadata();
    default:
      return getManagedLegacyMetadata(classElementMetadata);
  }
}

function getManagedLegacyMetadata(
  classElementMetadata: ManagedClassElementMetadata
): LegacyMetadata[] {
  const legacyMetadataList: LegacyMetadata[] = [
    getManagedKindLegacyMetadata(classElementMetadata),
  ];

  if (classElementMetadata.name !== undefined) {
    legacyMetadataList.push({
      key: NAMED_TAG,
      value: classElementMetadata.name,
    });
  }

  if (classElementMetadata.optional) {
    legacyMetadataList.push({
      key: OPTIONAL_TAG,
      value: true,
    });
  }

  for (const [tagKey, tagValue] of classElementMetadata.tags) {
    legacyMetadataList.push({
      key: tagKey,
      value: tagValue,
    });
  }

  if (classElementMetadata.targetName !== undefined) {
    legacyMetadataList.push({
      key: NAME_TAG,
      value: classElementMetadata.targetName,
    });
  }

  return legacyMetadataList;
}

function getManagedKindLegacyMetadata(
  classElementMetadata: ManagedClassElementMetadata
): LegacyMetadata {
  let kindLegacyMetadata: LegacyMetadata;

  switch (classElementMetadata.kind) {
    case ClassElementMetadataKind.multipleInjection:
      kindLegacyMetadata = {
        key: MULTI_INJECT_TAG,
        value: classElementMetadata.value,
      };
      break;
    case ClassElementMetadataKind.singleInjection:
      kindLegacyMetadata = {
        key: INJECT_TAG,
        value: classElementMetadata.value,
      };
      break;
  }

  return kindLegacyMetadata;
}

function getUnmanagedLegacyMetadata(): LegacyMetadata[] {
  return [
    {
      key: UNMANAGED_TAG,
      value: true,
    },
  ];
}
