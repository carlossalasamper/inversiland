import { ServiceIdentifier } from "../types/ServiceIdentifier";

export const isLazyServiceIdentifierSymbol: unique symbol = Symbol.for(
  "@inversifyjs/common/islazyServiceIdentifier"
);

export class LazyServiceIdentifier<TInstance = unknown> {
  public [isLazyServiceIdentifierSymbol]: true;

  readonly #buildServiceId: () => ServiceIdentifier<TInstance>;

  constructor(buildServiceId: () => ServiceIdentifier<TInstance>) {
    this.#buildServiceId = buildServiceId;
    this[isLazyServiceIdentifierSymbol] = true;
  }

  public static is<TInstance = unknown>(
    value: unknown
  ): value is LazyServiceIdentifier<TInstance> {
    return (
      typeof value === "object" &&
      value !== null &&
      (value as Partial<LazyServiceIdentifier>)[
        isLazyServiceIdentifierSymbol
      ] === true
    );
  }

  public unwrap(): ServiceIdentifier<TInstance> {
    return this.#buildServiceId();
  }
}
