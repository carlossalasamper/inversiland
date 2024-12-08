import { MetadataName } from "../../metadata/types/MetadataName";
import { MetadataTag } from "../../metadata/types/MetadataTag";

export interface BindingMetadata {
  readonly name: MetadataName | undefined;
  readonly tags: Map<MetadataTag, unknown>;
}
