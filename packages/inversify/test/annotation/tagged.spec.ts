// eslint-disable-next-line @typescript-eslint/naming-convention
declare function __decorate(
  decorators: ClassDecorator[],
  target: NewableFunction,
  key?: string | symbol,
  descriptor?: PropertyDescriptor | undefined
): void;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare function __param(
  paramIndex: number,
  decorator: ParameterDecorator
): ClassDecorator;

import { interfaces } from "../../src";
import { decorate } from "../../src/annotation/decorator_utils";
import { tagged } from "../../src/annotation/tagged";
import * as ERRORS_MSGS from "../../src/constants/error_msgs";
import * as METADATA_KEY from "../../src/constants/metadata_keys";

type Weapon = unknown;

class TaggedWarrior {
  private readonly _primaryWeapon: Weapon;
  private readonly _secondaryWeapon: Weapon;

  constructor(
    @tagged("power", 1) primary: Weapon,

    @tagged("power", 2) secondary: Weapon
  ) {
    this._primaryWeapon = primary;
    this._secondaryWeapon = secondary;
  }
  public debug() {
    return {
      primaryWeapon: this._primaryWeapon,
      secondaryWeapon: this._secondaryWeapon,
    };
  }
}

class DoubleTaggedWarrior {
  private readonly _primaryWeapon: Weapon;
  private readonly _secondaryWeapon: Weapon;

  constructor(
    @tagged("power", 1) @tagged("distance", 1) primary: Weapon,

    @tagged("power", 2) @tagged("distance", 5) secondary: Weapon
  ) {
    this._primaryWeapon = primary;
    this._secondaryWeapon = secondary;
  }
  public debug() {
    return {
      primaryWeapon: this._primaryWeapon,
      secondaryWeapon: this._secondaryWeapon,
    };
  }
}

class InvalidDecoratorUsageWarrior {
  private readonly _primaryWeapon: Weapon;
  private readonly _secondaryWeapon: Weapon;

  constructor(primary: Weapon, secondary: Weapon) {
    this._primaryWeapon = primary;
    this._secondaryWeapon = secondary;
  }

  public test(_a: string) {
    return _a;
  }

  public debug() {
    return {
      primaryWeapon: this._primaryWeapon,
      secondaryWeapon: this._secondaryWeapon,
    };
  }
}

describe("@Tagged", () => {
  it("Should generate metadata for tagged parameters", () => {
    const metadataKey: string = METADATA_KEY.TAGGED;
    const paramsMetadata: interfaces.MetadataMap = Reflect.getMetadata(
      metadataKey,
      TaggedWarrior
    ) as interfaces.MetadataMap;

    expect(paramsMetadata).toBeInstanceOf(Object);

    // assert metadata for first argument
    expect(paramsMetadata["0"]).toBeInstanceOf(Array);

    const zeroIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "0"
    ] as interfaces.Metadata[];

    const zeroIndexedFirstMetadata: interfaces.Metadata =
      zeroIndexedMetadata[0] as interfaces.Metadata;

    expect(zeroIndexedFirstMetadata.key).toBe("power");
    expect(zeroIndexedFirstMetadata.value).toBe(1);

    // argument at index 0 should only have one tag
    expect(zeroIndexedMetadata[1]).toBeUndefined();

    // assert metadata for second argument
    expect(paramsMetadata["1"]).toBeInstanceOf(Array);

    const oneIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "1"
    ] as interfaces.Metadata[];

    const oneIndexedFirstMetadata: interfaces.Metadata =
      oneIndexedMetadata[0] as interfaces.Metadata;

    expect(oneIndexedFirstMetadata.key).toBe("power");

    expect(oneIndexedFirstMetadata.value).toBe(2);

    // argument at index 1 should only have one tag
    expect(oneIndexedMetadata[1]).toBeUndefined();

    // no more metadata should be available
    expect(paramsMetadata["2"]).toBeUndefined();
  });

  it("Should generate metadata for tagged properties", () => {
    class Warrior {
      @tagged("throwable", false)
      public weapon!: Weapon;
    }

    const metadataKey: string = METADATA_KEY.TAGGED_PROP;
    const metadata: interfaces.MetadataMap = Reflect.getMetadata(
      metadataKey,
      Warrior
    ) as interfaces.MetadataMap;

    const weaponMetadata: interfaces.Metadata[] = metadata[
      "weapon"
    ] as interfaces.Metadata[];

    const weaponFirstMetadata: interfaces.Metadata =
      weaponMetadata[0] as interfaces.Metadata;

    expect(weaponFirstMetadata.key).toBe("throwable");
    expect(weaponFirstMetadata.value).toBe(false);
    expect(weaponMetadata[1]).toBeUndefined();
  });

  it("Should generate metadata for parameters tagged multiple times", () => {
    const metadataKey: string = METADATA_KEY.TAGGED;
    const paramsMetadata: interfaces.MetadataMap = Reflect.getMetadata(
      metadataKey,
      DoubleTaggedWarrior
    ) as interfaces.MetadataMap;

    expect(paramsMetadata).toBeInstanceOf(Object);

    // assert metadata for argument at index 0
    expect(paramsMetadata["0"]).toBeInstanceOf(Array);

    const zeroIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "0"
    ] as interfaces.Metadata[];

    const zeroIndexedFirstMetadata: interfaces.Metadata =
      zeroIndexedMetadata[0] as interfaces.Metadata;

    // assert argument at index 0 first tag
    expect(zeroIndexedFirstMetadata.key).toBe("distance");
    expect(zeroIndexedFirstMetadata.value).toBe(1);

    // assert argument at index 0 second tag

    const zeroIndexedSecondMetadata: interfaces.Metadata =
      zeroIndexedMetadata[1] as interfaces.Metadata;

    expect(zeroIndexedSecondMetadata.key).toBe("power");
    expect(zeroIndexedSecondMetadata.value).toBe(1);

    // assert metadata for argument at index 1
    expect(paramsMetadata["1"]).toBeInstanceOf(Array);

    const oneIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "1"
    ] as interfaces.Metadata[];

    const oneIndexedFirstMetadata: interfaces.Metadata =
      oneIndexedMetadata[0] as interfaces.Metadata;

    // assert argument at index 1 first tag
    expect(oneIndexedFirstMetadata.key).toBe("distance");

    expect(oneIndexedFirstMetadata.value).toBe(5);

    // assert argument at index 1 second tag

    const oneIndexedSecondMetadata: interfaces.Metadata =
      oneIndexedMetadata[1] as interfaces.Metadata;

    expect(oneIndexedSecondMetadata.key).toBe("power");

    expect(oneIndexedSecondMetadata.value).toBe(2);

    // no more metadata (argument at index > 1)
    expect(paramsMetadata["2"]).toBeUndefined();
  });

  it("Should throw when applied multiple times", () => {
    const metadataKey = "a";

    const useDecoratorMoreThanOnce: () => void = function () {
      __decorate(
        [
          __param(0, tagged(metadataKey, 1)),

          __param(0, tagged(metadataKey, 2)),
        ],
        InvalidDecoratorUsageWarrior
      );
    };

    const msg = `${ERRORS_MSGS.DUPLICATED_METADATA} ${metadataKey}`;
    expect(useDecoratorMoreThanOnce).toThrow(msg);
  });

  it("Should throw when not applied to a constructor", () => {
    const useDecoratorOnMethodThatIsNotConstructor: () => void = function () {
      __decorate(
        [__param(0, tagged("a", 1))],
        InvalidDecoratorUsageWarrior.prototype as unknown as NewableFunction,
        "test",
        Object.getOwnPropertyDescriptor(
          InvalidDecoratorUsageWarrior.prototype,
          "test"
        )
      );
    };

    const msg: string = ERRORS_MSGS.INVALID_DECORATOR_OPERATION;
    expect(useDecoratorOnMethodThatIsNotConstructor).toThrow(msg);
  });

  it("Should be usable in VanillaJS applications", () => {
    type Katana = unknown;
    type Shuriken = unknown;

    const vanillaJsWarrior: (primary: unknown, secondary: unknown) => void =
      (function () {
        return function taggedVanillaJsWarrior(
          _primary: Katana,
          _secondary: Shuriken
        ) {
          return;
        };
      })();

    decorate(tagged("power", 1), vanillaJsWarrior, 0);

    decorate(tagged("power", 2), vanillaJsWarrior, 1);

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

    expect(zeroIndexedFirstMetadata.key).toBe("power");
    expect(zeroIndexedFirstMetadata.value).toBe(1);

    // argument at index 0 should only have one tag
    expect(zeroIndexedMetadata[1]).toBeUndefined();

    // assert metadata for second argument
    expect(paramsMetadata["1"]).toBeInstanceOf(Array);

    const oneIndexedMetadata: interfaces.Metadata[] = paramsMetadata[
      "1"
    ] as interfaces.Metadata[];

    const oneIndexedFirstMetadata: interfaces.Metadata =
      oneIndexedMetadata[0] as interfaces.Metadata;

    expect(oneIndexedFirstMetadata.key).toBe("power");

    expect(oneIndexedFirstMetadata.value).toBe(2);

    // argument at index 1 should only have one tag
    expect(oneIndexedMetadata[1]).toBeUndefined();

    // no more metadata should be available
    expect(paramsMetadata["2"]).toBeUndefined();
  });
});
