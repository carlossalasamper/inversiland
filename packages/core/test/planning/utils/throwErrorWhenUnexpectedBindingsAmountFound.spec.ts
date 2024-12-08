import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("@inversiland/common");

import { stringifyServiceIdentifier } from "@inversiland/common";

jest.mock("../../../src/binding/utils/stringifyBinding");
jest.mock("../../../src/planning/utils/isPlanServiceRedirectionBindingNode");

import { bindingScopeValues } from "../../../src/binding/types/BindingScope";
import { bindingTypeValues } from "../../../src/binding/types/BindingType";
import { stringifyBinding } from "../../../src/binding/utils/stringifyBinding";
import { InversifyCoreError } from "../../../src/error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../src/error/types/InversifyCoreErrorKind";
import { PlanBindingNode } from "../../../src/planning/types/PlanBindingNode";
import { PlanServiceNode } from "../../../src/planning/types/PlanServiceNode";
import { PlanServiceRedirectionBindingNode } from "../../../src/planning/types/PlanServiceRedirectionBindingNode";
import { isPlanServiceRedirectionBindingNode } from "../../../src/planning/utils/isPlanServiceRedirectionBindingNode";
import { throwErrorWhenUnexpectedBindingsAmountFound } from "../../../src/planning/utils/throwErrorWhenUnexpectedBindingsAmountFound";

describe(throwErrorWhenUnexpectedBindingsAmountFound.name, () => {
  describe("having undefined bindings and isOptional false and node PlanServiceNode", () => {
    let bindingsFixture: undefined;
    let isOptionalFixture: false;
    let nodeFixture: PlanServiceNode;

    beforeAll(() => {
      bindingsFixture = undefined;
      isOptionalFixture = false;
      nodeFixture = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: "service-identifier",
      };
    });

    describe("when called, and isPlanServiceRedirectionBindingNode() returns true", () => {
      let stringifiedServiceIdentifier: string;

      let result: unknown;

      beforeAll(() => {
        stringifiedServiceIdentifier = "stringified-service-id";

        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        (
          stringifyServiceIdentifier as jest.Mock<
            typeof stringifyServiceIdentifier
          >
        )
          .mockReturnValueOnce(stringifiedServiceIdentifier)
          .mockReturnValueOnce(stringifiedServiceIdentifier);

        try {
          throwErrorWhenUnexpectedBindingsAmountFound(
            bindingsFixture,
            isOptionalFixture,
            nodeFixture
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should throw InversifyCoreError", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.planning,
          message: `No bindings found for service: "${stringifiedServiceIdentifier}".

Trying to resolve bindings for "${stringifiedServiceIdentifier} (Root service)".`,
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });

  describe("having single binding and isOptional false and node PlanServiceNode", () => {
    let bindingsFixture: PlanBindingNode;
    let isOptionalFixture: false;
    let nodeFixture: PlanServiceNode;

    beforeAll(() => {
      const parentNode: PlanServiceNode = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: "target-service-id",
      };

      bindingsFixture = {
        binding: {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 0,
          isSatisfiedBy: () => true,
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: "target-service-id",
          type: bindingTypeValues.ConstantValue,
        },
        parent: parentNode,
      };
      isOptionalFixture = false;
      nodeFixture = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: "service-identifier",
      };
    });

    describe("when called, and isPlanServiceRedirectionBindingNode() returns false", () => {
      let result: unknown;

      beforeAll(() => {
        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        result = throwErrorWhenUnexpectedBindingsAmountFound(
          bindingsFixture,
          isOptionalFixture,
          nodeFixture
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should return undefined", () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe("having bindings empty array and isOptional false and node PlanServiceRedirectionBindingNode", () => {
    let bindingsFixture: [];
    let isOptionalFixture: false;
    let nodeFixture: PlanServiceRedirectionBindingNode;

    beforeAll(() => {
      bindingsFixture = [];
      isOptionalFixture = false;
      nodeFixture = {
        binding: {
          id: 1,
          isSatisfiedBy: () => true,
          moduleId: undefined,
          serviceIdentifier: "service-id",
          targetServiceIdentifier: "target-service-id",
          type: bindingTypeValues.ServiceRedirection,
        },
        parent: {
          bindings: [],
          parent: undefined,
          serviceIdentifier: "service-id",
        },
        redirections: [],
      };
    });

    describe("when called, and isPlanServiceRedirectionBindingNode() returns true", () => {
      let stringifiedServiceIdentifier: string;
      let stringifiedTargetServiceIdentifier: string;

      let result: unknown;

      beforeAll(() => {
        stringifiedServiceIdentifier = "stringified-service-id";
        stringifiedTargetServiceIdentifier = "stringified-target-service-id";

        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(true);

        (
          stringifyServiceIdentifier as jest.Mock<
            typeof stringifyServiceIdentifier
          >
        )
          .mockReturnValueOnce(stringifiedTargetServiceIdentifier)
          .mockReturnValueOnce(stringifiedServiceIdentifier);

        try {
          result = throwErrorWhenUnexpectedBindingsAmountFound(
            bindingsFixture,
            isOptionalFixture,
            nodeFixture
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should throw InversifyCoreError", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.planning,
          message: `No bindings found for service: "${stringifiedTargetServiceIdentifier}".

Trying to resolve bindings for "${stringifiedServiceIdentifier}".`,
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });

  describe("having bindings empty array and isOptional false and node PlanServiceNode", () => {
    let bindingsFixture: [];
    let isOptionalFixture: false;
    let nodeFixture: PlanServiceNode;

    beforeAll(() => {
      bindingsFixture = [];
      isOptionalFixture = false;
      nodeFixture = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: "service-identifier",
      };
    });

    describe("when called, and isPlanServiceRedirectionBindingNode() returns true", () => {
      let stringifiedServiceIdentifier: string;

      let result: unknown;

      beforeAll(() => {
        stringifiedServiceIdentifier = "stringified-service-id";

        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        (
          stringifyServiceIdentifier as jest.Mock<
            typeof stringifyServiceIdentifier
          >
        )
          .mockReturnValueOnce(stringifiedServiceIdentifier)
          .mockReturnValueOnce(stringifiedServiceIdentifier);

        try {
          throwErrorWhenUnexpectedBindingsAmountFound(
            bindingsFixture,
            isOptionalFixture,
            nodeFixture
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should throw InversifyCoreError", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.planning,
          message: `No bindings found for service: "${stringifiedServiceIdentifier}".

Trying to resolve bindings for "${stringifiedServiceIdentifier} (Root service)".`,
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });

  describe("having bindings empty array and isOptional true and node PlanServiceNode", () => {
    let bindingsFixture: [];
    let isOptionalFixture: true;
    let nodeFixture: PlanServiceNode;

    beforeAll(() => {
      bindingsFixture = [];
      isOptionalFixture = true;
      nodeFixture = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: "service-identifier",
      };
    });

    describe("when called, and isPlanServiceRedirectionBindingNode() returns true", () => {
      let result: unknown;

      beforeAll(() => {
        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        result = throwErrorWhenUnexpectedBindingsAmountFound(
          bindingsFixture,
          isOptionalFixture,
          nodeFixture
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should return undefined", () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe("having multiple bindings and node PlanServiceRedirectionBindingNode", () => {
    let bindingsFixture: PlanBindingNode[];
    let isOptionalFixture: boolean;
    let nodeFixture: PlanServiceRedirectionBindingNode;

    beforeAll(() => {
      const parentNode: PlanServiceNode = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: "target-service-id",
      };

      bindingsFixture = [
        {
          binding: {
            cache: {
              isRight: true,
              value: Symbol(),
            },
            id: 0,
            isSatisfiedBy: () => true,
            moduleId: undefined,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: bindingScopeValues.Singleton,
            serviceIdentifier: "target-service-id",
            type: bindingTypeValues.ConstantValue,
          },
          parent: parentNode,
        },
        {
          binding: {
            cache: {
              isRight: true,
              value: Symbol(),
            },
            id: 0,
            isSatisfiedBy: () => true,
            moduleId: undefined,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: bindingScopeValues.Singleton,
            serviceIdentifier: "target-service-id",
            type: bindingTypeValues.ConstantValue,
          },
          parent: parentNode,
        },
      ];
      isOptionalFixture = false;
      nodeFixture = {
        binding: {
          id: 1,
          isSatisfiedBy: () => true,
          moduleId: undefined,
          serviceIdentifier: "service-id",
          targetServiceIdentifier: "target-service-id",
          type: bindingTypeValues.ServiceRedirection,
        },
        parent: {
          bindings: [],
          parent: undefined,
          serviceIdentifier: "service-id",
        },
        redirections: [],
      };
    });

    describe("when called, and isPlanServiceRedirectionBindingNode() returns true", () => {
      let stringifiedTargetServiceIdentifierFixture: string;
      let stringifiedServiceIdentifierFixture: string;

      let stringifiedBindingFixture: string;

      let result: unknown;

      beforeAll(() => {
        stringifiedTargetServiceIdentifierFixture =
          "stringified-target-service-id";
        stringifiedServiceIdentifierFixture = "stringified-service-id";

        stringifiedBindingFixture = "stringified-binding";

        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(true);

        (
          stringifyServiceIdentifier as jest.Mock<
            typeof stringifyServiceIdentifier
          >
        )
          .mockReturnValueOnce(stringifiedTargetServiceIdentifierFixture)
          .mockReturnValueOnce(stringifiedServiceIdentifierFixture);

        (stringifyBinding as jest.Mock<typeof stringifyBinding>)
          .mockReturnValueOnce(stringifiedBindingFixture)
          .mockReturnValueOnce(stringifiedBindingFixture);

        try {
          result = throwErrorWhenUnexpectedBindingsAmountFound(
            bindingsFixture,
            isOptionalFixture,
            nodeFixture
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should throw InversifyCoreError", () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.planning,
          message: `Ambiguous bindings found for service: "${stringifiedTargetServiceIdentifierFixture}".

Registered bindings:

${stringifiedBindingFixture}
${stringifiedBindingFixture}

Trying to resolve bindings for "${stringifiedServiceIdentifierFixture}".`,
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties)
        );
      });
    });
  });
});
