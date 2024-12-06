import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";

import { ClassElementMetadataKind } from "../../metadata/types/ClassElementMetadataKind";
import { LegacyMetadata } from "../../metadata/types/LegacyMetadata";
import { ManagedClassElementMetadata } from "../../metadata/types/ManagedClassElementMetadata";
import { MetadataName } from "../../metadata/types/MetadataName";
import { MetadataTag } from "../../metadata/types/MetadataTag";
import { getLegacyMetadata } from "../../metadata/utils/getters/getLegacyMetadata";
import { NAMED_TAG } from "../../metadata/utils/metadataKeys";
import { LegacyQueryableStringImpl } from "../../string/models/LegacyQueryableStringImpl";
import { LegacyQueryableString } from "../../string/types/LegacyQueryableString";
import { getDescription } from "../../symbol/utils/getDescription";
import { LegacyTarget } from "../types/LegacyTarget";
import { LegacyTargetType } from "../types/LegacyTargetType";
import { getTargetId } from "../utils/getTargetId";

export class LegacyTargetImpl implements LegacyTarget {
  readonly #metadata: ManagedClassElementMetadata;
  readonly #id: number;
  readonly #identifier: string | symbol;
  #lazyLegacyMetadata: LegacyMetadata[] | undefined;
  readonly #name: LegacyQueryableString;
  readonly #type: LegacyTargetType;

  constructor(
    identifier: string | symbol,
    metadata: ManagedClassElementMetadata,
    type: LegacyTargetType
  ) {
    this.#id = getTargetId();
    this.#identifier = identifier;
    this.#lazyLegacyMetadata = undefined;
    this.#metadata = metadata;
    this.#name = new LegacyQueryableStringImpl(
      typeof identifier === "string" ? identifier : getDescription(identifier)
    );
    this.#type = type;
  }

  public get id(): number {
    return this.#id;
  }

  /**
   * If this is a class property target, this is the name of the property to be injected
   */
  public get identifier(): string | symbol {
    return this.#identifier;
  }

  public get metadata(): LegacyMetadata[] {
    if (this.#lazyLegacyMetadata === undefined) {
      this.#lazyLegacyMetadata = getLegacyMetadata(this.#metadata);
    }

    return this.#lazyLegacyMetadata;
  }

  public get name(): LegacyQueryableString {
    return this.#name;
  }

  public get type(): LegacyTargetType {
    return this.#type;
  }

  public get serviceIdentifier(): ServiceIdentifier {
    if (LazyServiceIdentifier.is(this.#metadata.value)) {
      return this.#metadata.value.unwrap();
    } else {
      return this.#metadata.value;
    }
  }

  public getCustomTags(): LegacyMetadata[] | null {
    return [...this.#metadata.tags.entries()].map(
      ([key, value]: [MetadataTag, unknown]): LegacyMetadata => ({
        key,
        value,
      })
    );
  }

  public getNamedTag(): LegacyMetadata<MetadataName> | null {
    return this.#metadata.name === undefined
      ? null
      : {
          key: NAMED_TAG,
          value: this.#metadata.name,
        };
  }

  public hasTag(key: MetadataTag): boolean {
    return this.metadata.some(
      (metadata: LegacyMetadata): boolean => metadata.key === key
    );
  }

  public isArray(): boolean {
    return this.#metadata.kind === ClassElementMetadataKind.multipleInjection;
  }

  public isNamed(): boolean {
    return this.#metadata.name !== undefined;
  }

  public isOptional(): boolean {
    return this.#metadata.optional;
  }

  public isTagged(): boolean {
    return this.#metadata.tags.size > 0;
  }

  public matchesArray(name: ServiceIdentifier): boolean {
    return this.isArray() && this.#metadata.value === name;
  }

  public matchesNamedTag(name: MetadataName): boolean {
    return this.#metadata.name === name;
  }

  public matchesTag(key: MetadataTag): (value: unknown) => boolean {
    return (value: unknown): boolean =>
      this.metadata.some(
        (metadata: LegacyMetadata): boolean =>
          metadata.key === key && metadata.value === value
      );
  }
}
