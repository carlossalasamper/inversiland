import { beforeAll, describe, expect, it } from "@jest/globals";

import { InversifyCoreError } from "../../../../src/error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../../src/error/types/InversifyCoreErrorKind";
import { ClassElementMetadata } from "../../../../src/metadata/types/ClassElementMetadata";
import { assertConstructorMetadataArrayFilled } from "../../../../src/metadata/utils/assertion/assertConstructorMetadataArrayFilled";

describe(assertConstructorMetadataArrayFilled.name, () => {
  describe("having an array with no empty values", () => {
    class Foo {}

    let arrayFixture: [ClassElementMetadata];

    beforeAll(() => {
      arrayFixture = [Symbol() as unknown as ClassElementMetadata];
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        try {
          assertConstructorMetadataArrayFilled(Foo, arrayFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it("should not throw an error", () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe("having an array with empty values", () => {
    class Foo {}

    let arrayFixture: (ClassElementMetadata | undefined)[];

    beforeAll(() => {
      arrayFixture = new Array<ClassElementMetadata | undefined>(3);

      arrayFixture[1] = Symbol() as unknown as ClassElementMetadata;
    });

    describe("when called", () => {
      let result: unknown;

      beforeAll(() => {
        try {
          assertConstructorMetadataArrayFilled(Foo, arrayFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it("should throw an error", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.missingInjectionDecorator,
          message: `Found unexpected missing metadata on type "Foo" at constructor indexes "0", "2".

Are you using @inject, @multiInject or @unmanaged decorators at those indexes?

If you're using typescript and want to rely on auto injection, set "emitDecoratorMetadata" compiler option to true`,
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });
});
