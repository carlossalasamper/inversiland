import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

jest.mock(
  "../../../src/planning/utils/checkServiceNodeSingleInjectionBindings"
);

import { LazyServiceIdentifier, ServiceIdentifier } from "@inversiland/common";

import { BindingMetadata } from "../../../src/binding/types/BindingMetadata";
import { bindingScopeValues } from "../../../src/binding/types/BindingScope";
import { bindingTypeValues } from "../../../src/binding/types/BindingType";
import { ConstantValueBinding } from "../../../src/binding/types/ConstantValueBinding";
import { InstanceBinding } from "../../../src/binding/types/InstanceBinding";
import { ServiceRedirectionBinding } from "../../../src/binding/types/ServiceRedirectionBinding";
import { Writable } from "../../../src/common/types/Writable";
import { ClassElementMetadataKind } from "../../../src/metadata/types/ClassElementMetadataKind";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { ManagedClassElementMetadata } from "../../../src/metadata/types/ManagedClassElementMetadata";
import { UnmanagedClassElementMetadata } from "../../../src/metadata/types/UnmanagedClassElementMetadata";
import { InstanceBindingNode } from "../../../src/planning/types/InstanceBindingNode";
import { PlanBindingNode } from "../../../src/planning/types/PlanBindingNode";
import { PlanParams } from "../../../src/planning/types/PlanParams";
import { PlanResult } from "../../../src/planning/types/PlanResult";
import { PlanServiceNode } from "../../../src/planning/types/PlanServiceNode";
import { PlanServiceNodeParent } from "../../../src/planning/types/PlanServiceNodeParent";
import { PlanServiceRedirectionBindingNode } from "../../../src/planning/types/PlanServiceRedirectionBindingNode";
import { checkServiceNodeSingleInjectionBindings } from "../../../src/planning/utils/checkServiceNodeSingleInjectionBindings";
import { plan } from "../../../src/planning/utils/plan";

describe(plan.name, () => {
  describe("having PlanParams with name and tag root constraint", () => {
    let planParamsMock: jest.Mocked<PlanParams>;

    beforeAll(() => {
      planParamsMock = {
        getBindings: jest.fn() as unknown,
        getClassMetadata: jest.fn() as unknown,
        rootConstraints: {
          isMultiple: true,
          name: "name",
          serviceIdentifier: "service-id",
          tag: {
            key: "tag-key",
            value: "tag-value",
          },
        },
        servicesBranch: new Set(),
      } as Partial<jest.Mocked<PlanParams>> as jest.Mocked<PlanParams>;
    });

    describe("when called, and params.getBindings() returns an array with a ConstantValueBinding", () => {
      let constantValueBinding: ConstantValueBinding<unknown>;
      let result: unknown;

      beforeAll(() => {
        constantValueBinding = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.ConstantValue,
        };

        planParamsMock.getBindings.mockReturnValueOnce([constantValueBinding]);

        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(1);
        expect(planParamsMock.getBindings).toHaveBeenCalledWith(
          planParamsMock.rootConstraints.serviceIdentifier
        );
      });

      it("should call constantValueBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: planParamsMock.rootConstraints.name,
          tags: new Map([
            [
              planParamsMock.rootConstraints.tag?.key as string,
              planParamsMock.rootConstraints.tag?.value as string,
            ],
          ]),
        };

        expect(constantValueBinding.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(constantValueBinding.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should return expected PlanResult", () => {
        const planServiceNodeBindings: PlanBindingNode[] = [];

        const planServiceNode: PlanServiceNode = {
          bindings: planServiceNodeBindings,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        const expected: PlanResult = {
          tree: {
            root: planServiceNode,
          },
        };

        planServiceNodeBindings.push({
          binding: constantValueBinding,
          parent: planServiceNode,
        });

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe("having PlanParams with isMultiple true root constraint", () => {
    let planParamsMock: jest.Mocked<PlanParams>;

    beforeAll(() => {
      planParamsMock = {
        getBindings: jest.fn() as unknown,
        getClassMetadata: jest.fn() as unknown,
        rootConstraints: {
          isMultiple: true,
          serviceIdentifier: "service-id",
        },
        servicesBranch: new Set(),
      } as Partial<jest.Mocked<PlanParams>> as jest.Mocked<PlanParams>;
    });

    describe("when called, and params.getBindings() returns undefined", () => {
      let result: unknown;

      beforeAll(() => {
        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(1);
        expect(planParamsMock.getBindings).toHaveBeenCalledWith(
          planParamsMock.rootConstraints.serviceIdentifier
        );
      });

      it("should return expected PlanResult", () => {
        const expected: PlanResult = {
          tree: {
            root: {
              bindings: [],
              parent: undefined,
              serviceIdentifier:
                planParamsMock.rootConstraints.serviceIdentifier,
            },
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe("when called, and params.getBindings() returns an array with a single ConstantValueBinding", () => {
      let constantValueBinding: ConstantValueBinding<unknown>;
      let result: unknown;

      beforeAll(() => {
        constantValueBinding = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.ConstantValue,
        };

        planParamsMock.getBindings.mockReturnValueOnce([constantValueBinding]);

        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(1);
        expect(planParamsMock.getBindings).toHaveBeenCalledWith(
          planParamsMock.rootConstraints.serviceIdentifier
        );
      });

      it("should call constantValueBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: undefined,
          tags: new Map(),
        };

        expect(constantValueBinding.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(constantValueBinding.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should return expected PlanResult", () => {
        const planServiceNodeBindings: PlanBindingNode[] = [];

        const planServiceNode: PlanServiceNode = {
          bindings: planServiceNodeBindings,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        const expected: PlanResult = {
          tree: {
            root: planServiceNode,
          },
        };

        planServiceNodeBindings.push({
          binding: constantValueBinding,
          parent: planServiceNode,
        });

        expect(result).toStrictEqual(expected);
      });
    });

    describe("when called, and params.getBindings() returns an array with a single InstanceBinding with empty class metadata", () => {
      let classMetadataFixture: ClassMetadata;
      let instanceBindingFixture: InstanceBinding<unknown>;
      let result: unknown;

      beforeAll(() => {
        classMetadataFixture = {
          constructorArguments: [],
          lifecycle: {
            postConstructMethodName: undefined,
            preDestroyMethodName: undefined,
          },
          properties: new Map(),
        };
        instanceBindingFixture = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          implementationType: class {},
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.Instance,
        };

        planParamsMock.getBindings.mockReturnValueOnce([
          instanceBindingFixture,
        ]);

        planParamsMock.getClassMetadata.mockReturnValueOnce(
          classMetadataFixture
        );

        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(1);
        expect(planParamsMock.getBindings).toHaveBeenCalledWith(
          planParamsMock.rootConstraints.serviceIdentifier
        );
      });

      it("should call instanceBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: undefined,
          tags: new Map(),
        };

        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should return expected PlanResult", () => {
        const planServiceNodeBindings: PlanBindingNode[] = [];

        const planServiceNode: PlanServiceNode = {
          bindings: planServiceNodeBindings,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        const expected: PlanResult = {
          tree: {
            root: planServiceNode,
          },
        };

        const instanceBindingNode: InstanceBindingNode = {
          binding: instanceBindingFixture,
          classMetadata: classMetadataFixture,
          constructorParams: [],
          parent: planServiceNode,
          propertyParams: new Map(),
        };

        planServiceNodeBindings.push(instanceBindingNode);

        expect(result).toStrictEqual(expected);
      });
    });

    describe("when called, and params.getBindings() returns an array with a single InstanceBinding with non empty class metadata with multiple injection", () => {
      let constantValueBinding: ConstantValueBinding<unknown>;
      let constructorArgumentMetadata: ManagedClassElementMetadata;
      let propertyArgumentMetadata: ManagedClassElementMetadata;
      let propertyKey: string;
      let classMetadataFixture: ClassMetadata;
      let instanceBindingFixture: InstanceBinding<unknown>;
      let result: unknown;

      beforeAll(() => {
        constantValueBinding = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.ConstantValue,
        };
        constructorArgumentMetadata = {
          kind: ClassElementMetadataKind.multipleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: "constructor-param-service-id",
        };
        propertyKey = "property-key";
        propertyArgumentMetadata = {
          kind: ClassElementMetadataKind.multipleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: "property-param-service-id",
        };
        classMetadataFixture = {
          constructorArguments: [constructorArgumentMetadata],
          lifecycle: {
            postConstructMethodName: undefined,
            preDestroyMethodName: undefined,
          },
          properties: new Map([[propertyKey, propertyArgumentMetadata]]),
        };
        instanceBindingFixture = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          implementationType: class {},
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.Instance,
        };

        planParamsMock.getBindings
          .mockReturnValueOnce([instanceBindingFixture])
          .mockReturnValueOnce([constantValueBinding])
          .mockReturnValueOnce([constantValueBinding]);

        planParamsMock.getClassMetadata.mockReturnValueOnce(
          classMetadataFixture
        );

        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(3);
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          1,
          planParamsMock.rootConstraints.serviceIdentifier
        );
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          2,
          constructorArgumentMetadata.value
        );
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          3,
          propertyArgumentMetadata.value
        );
      });

      it("should call instanceBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: undefined,
          tags: new Map(),
        };

        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should return expected PlanResult", () => {
        const planServiceNodeBindings: PlanBindingNode[] = [];

        const planServiceNode: PlanServiceNode = {
          bindings: planServiceNodeBindings,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        const expected: PlanResult = {
          tree: {
            root: planServiceNode,
          },
        };

        const instanceBindingNode: InstanceBindingNode = {
          binding: instanceBindingFixture,
          classMetadata: classMetadataFixture,
          constructorParams: [],
          parent: planServiceNode,
          propertyParams: new Map(),
        };

        const constructorParamsPlanServiceNodeBindings: PlanBindingNode[] = [];

        const constructorParamsPlanServiceNode: PlanServiceNode = {
          bindings: constructorParamsPlanServiceNodeBindings,
          parent: instanceBindingNode,
          serviceIdentifier:
            constructorArgumentMetadata.value as ServiceIdentifier,
        };

        constructorParamsPlanServiceNodeBindings.push({
          binding: constantValueBinding,
          parent: constructorParamsPlanServiceNode,
        });

        const propertyParamsPlanServiceNodeBindings: PlanBindingNode[] = [];

        const propertyParamsPlanServiceNode: PlanServiceNode = {
          bindings: propertyParamsPlanServiceNodeBindings,
          parent: instanceBindingNode,
          serviceIdentifier:
            propertyArgumentMetadata.value as ServiceIdentifier,
        };

        propertyParamsPlanServiceNodeBindings.push({
          binding: constantValueBinding,
          parent: propertyParamsPlanServiceNode,
        });

        instanceBindingNode.constructorParams.push(
          constructorParamsPlanServiceNode
        );

        instanceBindingNode.propertyParams.set(
          propertyKey,
          propertyParamsPlanServiceNode
        );

        planServiceNodeBindings.push(instanceBindingNode);

        expect(result).toStrictEqual(expected);
      });
    });

    describe("when called, and params.getBindings() returns an array with a single InstanceBinding with non empty class metadata with lazy multiple injection", () => {
      let constantValueBinding: ConstantValueBinding<unknown>;
      let constructorArgumentMetadata: ManagedClassElementMetadata;
      let propertyArgumentMetadata: ManagedClassElementMetadata;
      let propertyKey: string;
      let classMetadataFixture: ClassMetadata;
      let instanceBindingFixture: InstanceBinding<unknown>;
      let result: unknown;

      beforeAll(() => {
        constantValueBinding = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.ConstantValue,
        };
        constructorArgumentMetadata = {
          kind: ClassElementMetadataKind.multipleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: new LazyServiceIdentifier(
            () => "constructor-param-service-id"
          ),
        };
        propertyKey = "property-key";
        propertyArgumentMetadata = {
          kind: ClassElementMetadataKind.multipleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: new LazyServiceIdentifier(() => "property-param-service-id"),
        };
        classMetadataFixture = {
          constructorArguments: [constructorArgumentMetadata],
          lifecycle: {
            postConstructMethodName: undefined,
            preDestroyMethodName: undefined,
          },
          properties: new Map([[propertyKey, propertyArgumentMetadata]]),
        };
        instanceBindingFixture = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          implementationType: class {},
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.Instance,
        };

        planParamsMock.getBindings
          .mockReturnValueOnce([instanceBindingFixture])
          .mockReturnValueOnce([constantValueBinding])
          .mockReturnValueOnce([constantValueBinding]);

        planParamsMock.getClassMetadata.mockReturnValueOnce(
          classMetadataFixture
        );

        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(3);
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          1,
          planParamsMock.rootConstraints.serviceIdentifier
        );
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          2,
          (constructorArgumentMetadata.value as LazyServiceIdentifier).unwrap()
        );
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          3,
          (propertyArgumentMetadata.value as LazyServiceIdentifier).unwrap()
        );
      });

      it("should call instanceBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: undefined,
          tags: new Map(),
        };

        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should return expected PlanResult", () => {
        const planServiceNodeBindings: PlanBindingNode[] = [];

        const planServiceNode: PlanServiceNode = {
          bindings: planServiceNodeBindings,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        const expected: PlanResult = {
          tree: {
            root: planServiceNode,
          },
        };

        const instanceBindingNode: InstanceBindingNode = {
          binding: instanceBindingFixture,
          classMetadata: classMetadataFixture,
          constructorParams: [],
          parent: planServiceNode,
          propertyParams: new Map(),
        };

        const constructorParamsPlanServiceNodeBindings: PlanBindingNode[] = [];

        const constructorParamsPlanServiceNode: PlanServiceNode = {
          bindings: constructorParamsPlanServiceNodeBindings,
          parent: instanceBindingNode,
          serviceIdentifier: (
            constructorArgumentMetadata.value as LazyServiceIdentifier
          ).unwrap(),
        };

        constructorParamsPlanServiceNodeBindings.push({
          binding: constantValueBinding,
          parent: constructorParamsPlanServiceNode,
        });

        const propertyParamsPlanServiceNodeBindings: PlanBindingNode[] = [];

        const propertyParamsPlanServiceNode: PlanServiceNode = {
          bindings: propertyParamsPlanServiceNodeBindings,
          parent: instanceBindingNode,
          serviceIdentifier: (
            propertyArgumentMetadata.value as LazyServiceIdentifier
          ).unwrap(),
        };

        propertyParamsPlanServiceNodeBindings.push({
          binding: constantValueBinding,
          parent: propertyParamsPlanServiceNode,
        });

        instanceBindingNode.constructorParams.push(
          constructorParamsPlanServiceNode
        );

        instanceBindingNode.propertyParams.set(
          propertyKey,
          propertyParamsPlanServiceNode
        );

        planServiceNodeBindings.push(instanceBindingNode);

        expect(result).toStrictEqual(expected);
      });
    });

    describe("when called, and params.getBindings() returns an array with a single InstanceBinding with non empty class metadata with single injection", () => {
      let constantValueBinding: ConstantValueBinding<unknown>;
      let constructorArgumentMetadata: ManagedClassElementMetadata;
      let propertyArgumentMetadata: ManagedClassElementMetadata;
      let propertyKey: string;
      let classMetadataFixture: ClassMetadata;
      let instanceBindingFixture: InstanceBinding<unknown>;
      let result: unknown;

      beforeAll(() => {
        constantValueBinding = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.ConstantValue,
        };
        constructorArgumentMetadata = {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: "constructor-param-service-id",
        };
        propertyKey = "property-key";
        propertyArgumentMetadata = {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map(),
          targetName: undefined,
          value: "property-param-service-id",
        };
        classMetadataFixture = {
          constructorArguments: [constructorArgumentMetadata],
          lifecycle: {
            postConstructMethodName: undefined,
            preDestroyMethodName: undefined,
          },
          properties: new Map([[propertyKey, propertyArgumentMetadata]]),
        };
        instanceBindingFixture = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          implementationType: class {},
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.Instance,
        };

        planParamsMock.getBindings
          .mockReturnValueOnce([instanceBindingFixture])
          .mockReturnValueOnce([constantValueBinding])
          .mockReturnValueOnce([constantValueBinding]);

        planParamsMock.getClassMetadata.mockReturnValueOnce(
          classMetadataFixture
        );

        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(3);
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          1,
          planParamsMock.rootConstraints.serviceIdentifier
        );
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          2,
          constructorArgumentMetadata.value
        );
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          3,
          propertyArgumentMetadata.value
        );
      });

      it("should call checkServiceNodeSingleInjectionBindings()", () => {
        const constructorParamsPlanServiceNode: PlanServiceNode = {
          bindings: expect.any(Object) as unknown as PlanBindingNode,
          parent: expect.any(Object) as unknown as PlanServiceNodeParent,
          serviceIdentifier:
            constructorArgumentMetadata.value as ServiceIdentifier,
        };

        const propertyParamsPlanServiceNode: PlanServiceNode = {
          bindings: expect.any(Object) as unknown as PlanBindingNode,
          parent: expect.any(Object) as unknown as PlanServiceNodeParent,
          serviceIdentifier:
            propertyArgumentMetadata.value as ServiceIdentifier,
        };

        expect(checkServiceNodeSingleInjectionBindings).toHaveBeenCalledTimes(
          2
        );
        expect(checkServiceNodeSingleInjectionBindings).toHaveBeenNthCalledWith(
          1,
          constructorParamsPlanServiceNode,
          constructorArgumentMetadata.optional
        );
        expect(checkServiceNodeSingleInjectionBindings).toHaveBeenNthCalledWith(
          2,
          propertyParamsPlanServiceNode,
          propertyArgumentMetadata.optional
        );
      });

      it("should call instanceBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: undefined,
          tags: new Map(),
        };

        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should return expected PlanResult", () => {
        const planServiceNodeBindings: PlanBindingNode[] = [];

        const planServiceNode: PlanServiceNode = {
          bindings: planServiceNodeBindings,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        const expected: PlanResult = {
          tree: {
            root: planServiceNode,
          },
        };

        const instanceBindingNode: InstanceBindingNode = {
          binding: instanceBindingFixture,
          classMetadata: classMetadataFixture,
          constructorParams: [],
          parent: planServiceNode,
          propertyParams: new Map(),
        };

        const constructorParamsPlanServiceNode: PlanServiceNode = {
          bindings: undefined,
          parent: instanceBindingNode,
          serviceIdentifier:
            constructorArgumentMetadata.value as ServiceIdentifier,
        };

        (
          constructorParamsPlanServiceNode as Writable<PlanServiceNode>
        ).bindings = {
          binding: constantValueBinding,
          parent: constructorParamsPlanServiceNode,
        };

        const propertyParamsPlanServiceNode: PlanServiceNode = {
          bindings: undefined,
          parent: instanceBindingNode,
          serviceIdentifier:
            propertyArgumentMetadata.value as ServiceIdentifier,
        };

        (propertyParamsPlanServiceNode as Writable<PlanServiceNode>).bindings =
          {
            binding: constantValueBinding,
            parent: propertyParamsPlanServiceNode,
          };

        instanceBindingNode.constructorParams.push(
          constructorParamsPlanServiceNode
        );

        instanceBindingNode.propertyParams.set(
          propertyKey,
          propertyParamsPlanServiceNode
        );

        planServiceNodeBindings.push(instanceBindingNode);

        expect(result).toStrictEqual(expected);
      });
    });

    describe("when called, and params.getBindings() returns an array with a single InstanceBinding with non empty class metadata with unmanaged injection", () => {
      let constructorArgumentMetadata: UnmanagedClassElementMetadata;
      let propertyArgumentMetadata: UnmanagedClassElementMetadata;
      let propertyKey: string;
      let classMetadataFixture: ClassMetadata;
      let instanceBindingFixture: InstanceBinding<unknown>;
      let result: unknown;

      beforeAll(() => {
        constructorArgumentMetadata = {
          kind: ClassElementMetadataKind.unmanaged,
        };
        propertyKey = "property-key";
        propertyArgumentMetadata = {
          kind: ClassElementMetadataKind.unmanaged,
        };
        classMetadataFixture = {
          constructorArguments: [constructorArgumentMetadata],
          lifecycle: {
            postConstructMethodName: undefined,
            preDestroyMethodName: undefined,
          },
          properties: new Map([[propertyKey, propertyArgumentMetadata]]),
        };
        instanceBindingFixture = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          implementationType: class {},
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          type: bindingTypeValues.Instance,
        };

        planParamsMock.getBindings.mockReturnValueOnce([
          instanceBindingFixture,
        ]);

        planParamsMock.getClassMetadata.mockReturnValueOnce(
          classMetadataFixture
        );

        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(1);
        expect(planParamsMock.getBindings).toHaveBeenCalledWith(
          planParamsMock.rootConstraints.serviceIdentifier
        );
      });

      it("should call instanceBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: undefined,
          tags: new Map(),
        };

        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(instanceBindingFixture.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should return expected PlanResult", () => {
        const planServiceNodeBindings: PlanBindingNode[] = [];

        const planServiceNode: PlanServiceNode = {
          bindings: planServiceNodeBindings,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        const expected: PlanResult = {
          tree: {
            root: planServiceNode,
          },
        };

        const instanceBindingNode: InstanceBindingNode = {
          binding: instanceBindingFixture,
          classMetadata: classMetadataFixture,
          constructorParams: [undefined],
          parent: planServiceNode,
          propertyParams: new Map(),
        };

        planServiceNodeBindings.push(instanceBindingNode);

        expect(result).toStrictEqual(expected);
      });
    });

    describe("when called, and params.getBindings() returns an array with a single ServiceRedirectionBinding with non existing target", () => {
      let serviceRedirectionBinding: ServiceRedirectionBinding<unknown>;
      let result: unknown;

      beforeAll(() => {
        serviceRedirectionBinding = {
          id: 1,
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          targetServiceIdentifier: "target-service-id",
          type: bindingTypeValues.ServiceRedirection,
        };

        planParamsMock.getBindings.mockReturnValueOnce([
          serviceRedirectionBinding,
        ]);

        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(2);
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          1,
          planParamsMock.rootConstraints.serviceIdentifier
        );
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          2,
          serviceRedirectionBinding.targetServiceIdentifier
        );
      });

      it("should call serviceRedirectionBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: undefined,
          tags: new Map(),
        };

        expect(serviceRedirectionBinding.isSatisfiedBy).toHaveBeenCalledTimes(
          1
        );
        expect(serviceRedirectionBinding.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should return expected PlanResult", () => {
        const planServiceNodeBindings: PlanBindingNode[] = [];

        const planServiceNode: PlanServiceNode = {
          bindings: planServiceNodeBindings,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        const expected: PlanResult = {
          tree: {
            root: planServiceNode,
          },
        };

        const serviceRedirectionBindingNode: PlanServiceRedirectionBindingNode =
          {
            binding: serviceRedirectionBinding,
            parent: planServiceNode,
            redirections: [],
          };

        serviceRedirectionBindingNode.redirections.push();

        planServiceNodeBindings.push(serviceRedirectionBindingNode);

        expect(result).toStrictEqual(expected);
      });
    });

    describe("when called, and params.getBindings() returns an array with a single ServiceRedirectionBinding with existing target", () => {
      let constantValueBinding: ConstantValueBinding<unknown>;
      let serviceRedirectionBinding: ServiceRedirectionBinding<unknown>;
      let result: unknown;

      beforeAll(() => {
        serviceRedirectionBinding = {
          id: 1,
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
          targetServiceIdentifier: "target-service-id",
          type: bindingTypeValues.ServiceRedirection,
        };

        constantValueBinding = {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 1,
          isSatisfiedBy: jest.fn(() => true),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: serviceRedirectionBinding.targetServiceIdentifier,
          type: bindingTypeValues.ConstantValue,
        };

        planParamsMock.getBindings
          .mockReturnValueOnce([serviceRedirectionBinding])
          .mockReturnValueOnce([constantValueBinding]);

        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(2);
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          1,
          planParamsMock.rootConstraints.serviceIdentifier
        );
        expect(planParamsMock.getBindings).toHaveBeenNthCalledWith(
          2,
          serviceRedirectionBinding.targetServiceIdentifier
        );
      });

      it("should call serviceRedirectionBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: undefined,
          tags: new Map(),
        };

        expect(serviceRedirectionBinding.isSatisfiedBy).toHaveBeenCalledTimes(
          1
        );
        expect(serviceRedirectionBinding.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should call constantValueBinding.isSatisfiedBy()", () => {
        const expectedBindingMetadata: BindingMetadata = {
          name: undefined,
          tags: new Map(),
        };

        expect(constantValueBinding.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(constantValueBinding.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata
        );
      });

      it("should return expected PlanResult", () => {
        const planServiceNodeBindings: PlanBindingNode[] = [];

        const planServiceNode: PlanServiceNode = {
          bindings: planServiceNodeBindings,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        const expected: PlanResult = {
          tree: {
            root: planServiceNode,
          },
        };

        const serviceRedirectionBindingNode: PlanServiceRedirectionBindingNode =
          {
            binding: serviceRedirectionBinding,
            parent: planServiceNode,
            redirections: [],
          };

        serviceRedirectionBindingNode.redirections.push({
          binding: constantValueBinding,
          parent: serviceRedirectionBindingNode,
        });

        planServiceNodeBindings.push(serviceRedirectionBindingNode);

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe("having PlanParams with isMultiple false root constraint", () => {
    let planParamsMock: jest.Mocked<PlanParams>;

    beforeAll(() => {
      planParamsMock = {
        getBindings: jest.fn(),
        getClassMetadata: jest.fn(),
        rootConstraints: {
          isMultiple: false,
          serviceIdentifier: "service-id",
        },
        servicesBranch: new Set(),
      } as Partial<PlanParams> as jest.Mocked<PlanParams>;
    });

    describe("when called, and params.getBindings() returns undefined", () => {
      let result: unknown;

      beforeAll(() => {
        result = plan(planParamsMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("should call params.getBindings()", () => {
        expect(planParamsMock.getBindings).toHaveBeenCalledTimes(1);
        expect(planParamsMock.getBindings).toHaveBeenCalledWith(
          planParamsMock.rootConstraints.serviceIdentifier
        );
      });

      it("should call checkServiceNodeSingleInjectionBindings()", () => {
        const expectedServiceNode: PlanServiceNode = {
          bindings: undefined,
          parent: undefined,
          serviceIdentifier: planParamsMock.rootConstraints.serviceIdentifier,
        };

        expect(checkServiceNodeSingleInjectionBindings).toHaveBeenCalledTimes(
          1
        );
        expect(checkServiceNodeSingleInjectionBindings).toHaveBeenCalledWith(
          expectedServiceNode,
          false
        );
      });

      it("should return expected PlanResult", () => {
        const expected: PlanResult = {
          tree: {
            root: {
              bindings: undefined,
              parent: undefined,
              serviceIdentifier:
                planParamsMock.rootConstraints.serviceIdentifier,
            },
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
