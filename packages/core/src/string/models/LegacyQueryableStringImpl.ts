import { LegacyQueryableString } from "../types/LegacyQueryableString";

export class LegacyQueryableStringImpl implements LegacyQueryableString {
  readonly #str: string;

  constructor(str: string) {
    this.#str = str;
  }

  public startsWith(searchString: string): boolean {
    return this.#str.startsWith(searchString);
  }

  public endsWith(searchString: string): boolean {
    return this.#str.endsWith(searchString);
  }

  public contains(searchString: string): boolean {
    return this.#str.includes(searchString);
  }

  public equals(compareString: string): boolean {
    return this.#str === compareString;
  }

  public value(): string {
    return this.#str;
  }
}
