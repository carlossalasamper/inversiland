declare function __decorate(
  decorators: ClassDecorator[],
  target: NewableFunction,
  key?: string | symbol,
  descriptor?: PropertyDescriptor | undefined
): void;
declare function __param(
  paramIndex: number,
  decorator: ParameterDecorator
): ClassDecorator;

import { LazyServiceIdentifier } from "@inversifyjs/common";

import { interfaces } from "../../src";
import { decorate } from "../../src/annotation/decorator_utils";
import { inject } from "../../src/annotation/inject";
import { multiInject } from "../../src/annotation/multi_inject";
import * as ERROR_MSGS from "../../src/constants/error_msgs";
import * as METADATA_KEY from "../../src/constants/metadata_keys";

class Katana {}
class Shuriken {}
class Sword {}

const lazySwordId: LazyServiceIdentifier = new LazyServiceIdentifier(
  () => "Sword"
);

class DecoratedWarrior {
  private readonly _primaryWeapon: Katana;
  private readonly _secondaryWeapon: Shuriken;
  private readonly _tertiaryWeapon: Sword;

  constructor(
    @inject("Katana") primary: Katana,
    @inject("Shuriken") secondary: Shuriken,
    @inject(lazySwordId) tertiary: Shuriken
  ) {
    this._primaryWeapon = primary;
    this._secondaryWeapon = secondary;
    this._tertiaryWeapon = tertiary;
  }

  public debug() {
    return {
      primaryWeapon: this._primaryWeapon,
      secondaryWeapon: this._secondaryWeapon,
      tertiaryWeapon: this._tertiaryWeapon,
    };
  }
}

class InvalidDecoratorUsageWarrior {
  private readonly _primaryWeapon: Katana;
  private readonly _secondaryWeapon: Shuriken;

  constructor(primary: Katana, secondary: Shuriken) {
    this._primaryWeapon = primary;
    this._secondaryWeapon = secondary;
  }

  public test(_a: string) {
    return;
  }

  public debug() {
    return {
      primaryWeapon: this._primaryWeapon,
      secondaryWeapon: this._secondaryWeapon,
    };
  }
}

describe("@inject", () => {
  it("Should generate metadata for named parameters", () => {
    const metadataKey: string = METADATA_KEY.TAGGED;
    const paramsMetadata: interfaces.MetadataMap = Reflect.getMetadata(
      metadataKey,
      DecoratedWarrior
    ) as interfaces.MetadataMap;
    expect(paramsMetadata).toBeInstanceOf(Object);

    // assert metadata for first argument
    expect(paramsMetadata["0"]).toBeInstanceOf(Array);

    const zeroIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "0"
    ] as interfaces.Metadata[];

    const zeroIndexedFirstMetadata: interfaces.Metadata =
      zeroIndexedMetadata[0] as interfaces.Metadata;
    expect(zeroIndexedFirstMetadata.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(zeroIndexedFirstMetadata.value).toEqual("Katana");
    expect(zeroIndexedMetadata[1]).toBeUndefined();

    // assert metadata for second argument
    expect(paramsMetadata["1"]).toBeInstanceOf(Array);

    const oneIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "1"
    ] as interfaces.Metadata[];

    const oneIndexedFirstMetadata: interfaces.Metadata =
      oneIndexedMetadata[0] as interfaces.Metadata;

    expect(oneIndexedFirstMetadata.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(oneIndexedFirstMetadata.value).toEqual("Shuriken");
    expect(oneIndexedMetadata[1]).toBeUndefined();

    // assert metadata for second argument
    expect(paramsMetadata["2"]).toBeInstanceOf(Array);

    const twoIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "2"
    ] as interfaces.Metadata[];

    const twoIndexedFirstMetadata: interfaces.Metadata =
      twoIndexedMetadata[0] as interfaces.Metadata;
    expect(twoIndexedFirstMetadata.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(twoIndexedFirstMetadata.value).toEqual(lazySwordId);
    expect(twoIndexedMetadata[1]).toBeUndefined();

    // no more metadata should be available
    expect(paramsMetadata["3"]).toBeUndefined();
  });

  it("Should throw when applied multiple times", () => {
    const useDecoratorMoreThanOnce: () => void = function () {
      __decorate(
        [__param(0, inject("Katana")), __param(0, inject("Shurien"))],
        InvalidDecoratorUsageWarrior
      );
    };

    const msg = `${ERROR_MSGS.DUPLICATED_METADATA} ${METADATA_KEY.INJECT_TAG}`;
    expect(useDecoratorMoreThanOnce).toThrow(msg);
  });

  it("Should throw when not applied to a constructor", () => {
    const useDecoratorOnMethodThatIsNotConstructor: () => void = function () {
      __decorate(
        [__param(0, inject("Katana"))],
        InvalidDecoratorUsageWarrior.prototype as unknown as NewableFunction,
        "test",
        Object.getOwnPropertyDescriptor(
          InvalidDecoratorUsageWarrior.prototype,
          "test"
        )
      );
    };

    const msg: string = ERROR_MSGS.INVALID_DECORATOR_OPERATION;
    expect(useDecoratorOnMethodThatIsNotConstructor).toThrow(msg);
  });

  it("Should throw when applied with undefined", () => {
    // this can happen when there is circular dependency between symbols
    const useDecoratorWithUndefined: () => void = function () {
      __decorate(
        [__param(0, inject(undefined as unknown as symbol))],
        InvalidDecoratorUsageWarrior
      );
    };

    const msg: string = ERROR_MSGS.UNDEFINED_INJECT_ANNOTATION(
      "InvalidDecoratorUsageWarrior"
    );
    expect(useDecoratorWithUndefined).toThrow(msg);
  });

  it("Should be usable in VanillaJS applications", () => {
    type Shuriken = unknown;

    const vanillaJsWarrior: (primary: Katana, secondary: unknown) => void =
      (function () {
        function warrior(_primary: Katana, _secondary: Shuriken) {
          return;
        }
        return warrior;
      })();

    decorate(inject("Katana"), vanillaJsWarrior, 0);
    decorate(inject("Shurien"), vanillaJsWarrior, 1);

    const metadataKey: string = METADATA_KEY.TAGGED;
    const paramsMetadata: interfaces.MetadataMap = Reflect.getMetadata(
      metadataKey,
      vanillaJsWarrior
    ) as interfaces.MetadataMap;

    expect(paramsMetadata).toBeInstanceOf(Object);

    // assert metadata for first argument
    expect(paramsMetadata["0"]).toBeInstanceOf(Array);

    const zeroIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "0"
    ] as interfaces.Metadata[];

    const zeroIndexedFirstMetadata: interfaces.Metadata =
      zeroIndexedMetadata[0] as interfaces.Metadata;

    expect(zeroIndexedFirstMetadata.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(zeroIndexedFirstMetadata.value).toEqual("Katana");
    expect(zeroIndexedMetadata[1]).toBeUndefined();

    // assert metadata for second argument
    expect(paramsMetadata["1"]).toBeInstanceOf(Array);

    const oneIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "1"
    ] as interfaces.Metadata[];

    const oneIndexedFirstMetadata: interfaces.Metadata =
      oneIndexedMetadata[0] as interfaces.Metadata;

    expect(oneIndexedFirstMetadata.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(oneIndexedFirstMetadata.value).toEqual("Shurien");
    expect(oneIndexedMetadata[1]).toBeUndefined();

    // no more metadata should be available
    expect(paramsMetadata["2"]).toBeUndefined();
  });

  it("should throw when applied inject decorator with undefined service identifier to a property", () => {
    expect(() => {
      class WithUndefinedInject {
        @inject(undefined as unknown as symbol)
        public property!: string;
      }

      return WithUndefinedInject;
    }).toThrow(ERROR_MSGS.UNDEFINED_INJECT_ANNOTATION("WithUndefinedInject"));
  });

  it("should throw when applied multiInject decorator with undefined service identifier to a constructor parameter", () => {
    expect(() => {
      class WithUndefinedInject {
        constructor(
          @multiInject(undefined as unknown as symbol)
          public readonly dependency: string[]
        ) {}
      }

      return WithUndefinedInject;
    }).toThrow(ERROR_MSGS.UNDEFINED_INJECT_ANNOTATION("WithUndefinedInject"));
  });

  it("Should unwrap LazyServiceIdentifier", () => {
    const unwrapped: interfaces.ServiceIdentifier = lazySwordId.unwrap();

    expect(unwrapped).toEqual("Sword");
  });
});
