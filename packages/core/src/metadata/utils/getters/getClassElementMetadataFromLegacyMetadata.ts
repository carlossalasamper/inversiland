import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";

import { InversifyCoreError } from "../../../error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../error/types/InversifyCoreErrorKind";
import { ClassElementMetadata } from "../../types/ClassElementMetadata";
import { ClassElementMetadataKind } from "../../types/ClassElementMetadataKind";
import { LegacyMetadata } from "../../types/LegacyMetadata";
import { ManagedClassElementMetadata } from "../../types/ManagedClassElementMetadata";
import { MetadataName } from "../../types/MetadataName";
import { MetadataTag } from "../../types/MetadataTag";
import { MetadataTargetName } from "../../types/MetadataTargetName";
import { UnmanagedClassElementMetadata } from "../../types/UnmanagedClassElementMetadata";
import {
  INJECT_TAG,
  MULTI_INJECT_TAG,
  NAME_TAG,
  NAMED_TAG,
  NON_CUSTOM_TAG_KEYS,
  OPTIONAL_TAG,
  UNMANAGED_TAG,
} from "../metadataKeys";

export function getClassElementMetadataFromLegacyMetadata(
  metadataList: LegacyMetadata[]
): ClassElementMetadata {
  const injectMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === INJECT_TAG
  );
  const multiInjectMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === MULTI_INJECT_TAG
  );
  const unmanagedMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === UNMANAGED_TAG
  );

  if (unmanagedMetadata !== undefined) {
    return getUnmanagedClassElementMetadata(
      injectMetadata,
      multiInjectMetadata
    );
  }

  if (multiInjectMetadata === undefined && injectMetadata === undefined) {
    throw new InversifyCoreError(
      InversifyCoreErrorKind.missingInjectionDecorator,
      "Expected @inject, @multiInject or @unmanaged metadata"
    );
  }

  const nameMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === NAMED_TAG
  );

  const optionalMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === OPTIONAL_TAG
  );

  const targetNameMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === NAME_TAG
  );

  const managedClassElementMetadata: ManagedClassElementMetadata = {
    kind:
      injectMetadata === undefined
        ? ClassElementMetadataKind.multipleInjection
        : ClassElementMetadataKind.singleInjection,
    name: nameMetadata?.value as MetadataName | undefined,
    optional: optionalMetadata !== undefined,
    tags: new Map(
      metadataList
        .filter((metadata: LegacyMetadata): boolean =>
          NON_CUSTOM_TAG_KEYS.every(
            (customTagKey: string): boolean => metadata.key !== customTagKey
          )
        )
        .map((metadata: LegacyMetadata): [MetadataTag, unknown] => [
          metadata.key,
          metadata.value,
        ])
    ),
    targetName: targetNameMetadata?.value as MetadataTargetName | undefined,
    value:
      injectMetadata === undefined
        ? (multiInjectMetadata?.value as
            | ServiceIdentifier
            | LazyServiceIdentifier)
        : (injectMetadata.value as ServiceIdentifier | LazyServiceIdentifier),
  };

  return managedClassElementMetadata;
}

function getUnmanagedClassElementMetadata(
  injectMetadata: LegacyMetadata | undefined,
  multiInjectMetadata: LegacyMetadata | undefined
): UnmanagedClassElementMetadata {
  if (multiInjectMetadata !== undefined || injectMetadata !== undefined) {
    throw new InversifyCoreError(
      InversifyCoreErrorKind.missingInjectionDecorator,
      "Expected a single @inject, @multiInject or @unmanaged metadata"
    );
  }

  return {
    kind: ClassElementMetadataKind.unmanaged,
  };
}
