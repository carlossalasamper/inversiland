import { Newable } from "@inversiland/common";
import { getMetadata } from "@inversiland/metadata";
import { beforeAll, describe, expect, it } from "@jest/globals";

import { BindingServiceImplementation } from "../../../src/binding/services/BindingServiceImplementation";
import { bindingScopeValues } from "../../../src/binding/types/BindingScope";
import { BindingService } from "../../../src/binding/types/BindingService";
import { bindingTypeValues } from "../../../src/binding/types/BindingType";
import { ConstantValueBinding } from "../../../src/binding/types/ConstantValueBinding";
import { DynamicValueBinding } from "../../../src/binding/types/DynamicValueBinding";
import { FactoryBinding } from "../../../src/binding/types/FactoryBinding";
import { InstanceBinding } from "../../../src/binding/types/InstanceBinding";
import { ProviderBinding } from "../../../src/binding/types/ProviderBinding";
import { ServiceRedirectionBinding } from "../../../src/binding/types/ServiceRedirectionBinding";
import { Writable } from "../../../src/common/types/Writable";
import { InversifyCoreError } from "../../../src/error/models/InversifyCoreError";
import { InversifyCoreErrorKind } from "../../../src/error/types/InversifyCoreErrorKind";
import { inject } from "../../../src/metadata/decorators/inject";
import { ClassMetadata } from "../../../src/metadata/types/ClassMetadata";
import { getDefaultClassMetadata } from "../../../src/metadata/utils/getters/getDefaultClassMetadata";
import { classMetadataReflectKey } from "../../../src/metadata/utils/metadataKeys";
import { InstanceBindingNode } from "../../../src/planning/types/InstanceBindingNode";
import { PlanParamsConstraint } from "../../../src/planning/types/PlanParamsConstraint";
import { PlanResult } from "../../../src/planning/types/PlanResult";
import { PlanServiceNode } from "../../../src/planning/types/PlanServiceNode";
import { PlanServiceRedirectionBindingNode } from "../../../src/planning/types/PlanServiceRedirectionBindingNode";
import { plan } from "../../../src/planning/utils/plan";

enum ServiceIds {
  constantValue = "constant-value-service-id",
  dynamicValue = "dynamic-value-service-id",
  factory = "factory-service-id",
  instance = "instance-service-id",
  nonExistent = "non-existent-service-id",
  provider = "provider-service-id",
  serviceRedirection = "service-redirection-service-id",
  serviceRedirectionToNonExistent = "service-redirection-to-non-existent-service-id",
}

class Foo {
  @inject(ServiceIds.dynamicValue)
  public readonly property!: symbol;

  constructor(
    @inject(ServiceIds.constantValue)
    _param: symbol
  ) {
    return;
  }
}

function buildLeafBindingPlanResult(
  binding:
    | ConstantValueBinding<unknown>
    | DynamicValueBinding<unknown>
    | FactoryBinding<unknown>
    | ProviderBinding<unknown>
): PlanResult {
  const planServiceNode: PlanServiceNode = {
    bindings: [],
    parent: undefined,
    serviceIdentifier: binding.serviceIdentifier,
  };

  const planResult: PlanResult = {
    tree: {
      root: planServiceNode,
    },
  };

  (planServiceNode as Writable<PlanServiceNode>).bindings = {
    binding: binding,
    parent: planServiceNode,
  };

  return planResult;
}

function buildSimpleInstancePlanResult(
  constructorParameterBinding:
    | ConstantValueBinding<unknown>
    | DynamicValueBinding<unknown>
    | FactoryBinding<unknown>
    | ProviderBinding<unknown>,
  propertyKeyBindingPair: [
    string | symbol,
    (
      | ConstantValueBinding<unknown>
      | DynamicValueBinding<unknown>
      | FactoryBinding<unknown>
      | ProviderBinding<unknown>
    )
  ],
  instanceBinding: InstanceBinding<unknown>
): PlanResult {
  const planServiceNode: PlanServiceNode = {
    bindings: [],
    parent: undefined,
    serviceIdentifier: instanceBinding.serviceIdentifier,
  };

  const instanceBindingNode: InstanceBindingNode = {
    binding: instanceBinding,
    classMetadata: expect.any(Object) as unknown as ClassMetadata,
    constructorParams: [],
    parent: planServiceNode,
    propertyParams: new Map(),
  };

  const constructorParamServiceNode: PlanServiceNode = {
    bindings: [],
    parent: instanceBindingNode,
    serviceIdentifier: constructorParameterBinding.serviceIdentifier,
  };

  (constructorParamServiceNode as Writable<PlanServiceNode>).bindings = {
    binding: constructorParameterBinding,
    parent: constructorParamServiceNode,
  };

  instanceBindingNode.constructorParams.push(constructorParamServiceNode);

  const [propertyKey, propertyKeyBinding]: [
    string | symbol,
    (
      | ConstantValueBinding<unknown>
      | DynamicValueBinding<unknown>
      | FactoryBinding<unknown>
      | ProviderBinding<unknown>
    )
  ] = propertyKeyBindingPair;

  const propertyServiceNode: PlanServiceNode = {
    bindings: [],
    parent: instanceBindingNode,
    serviceIdentifier: propertyKeyBinding.serviceIdentifier,
  };

  (propertyServiceNode as Writable<PlanServiceNode>).bindings = {
    binding: propertyKeyBinding,
    parent: propertyServiceNode,
  };

  instanceBindingNode.propertyParams.set(propertyKey, propertyServiceNode);

  (planServiceNode as Writable<PlanServiceNode>).bindings = instanceBindingNode;

  const planResult: PlanResult = {
    tree: {
      root: planServiceNode,
    },
  };

  return planResult;
}

function buildServiceRedirectionToLeafBindingPlanResult(
  leafBinding:
    | ConstantValueBinding<unknown>
    | DynamicValueBinding<unknown>
    | FactoryBinding<unknown>
    | ProviderBinding<unknown>,
  serviceRedirectionBinding: ServiceRedirectionBinding<unknown>
): PlanResult {
  const planServiceNode: PlanServiceNode = {
    bindings: [],
    parent: undefined,
    serviceIdentifier: serviceRedirectionBinding.serviceIdentifier,
  };

  const planResult: PlanResult = {
    tree: {
      root: planServiceNode,
    },
  };

  const serviceRedirectionBindingNode: PlanServiceRedirectionBindingNode = {
    binding: serviceRedirectionBinding,
    parent: planServiceNode,
    redirections: [],
  };

  serviceRedirectionBindingNode.redirections.push({
    binding: leafBinding,
    parent: serviceRedirectionBindingNode,
  });

  (planServiceNode as Writable<PlanServiceNode>).bindings =
    serviceRedirectionBindingNode;

  return planResult;
}

describe(plan.name, () => {
  let constantValueBinding: ConstantValueBinding<unknown>;
  let dynamicValueBinding: DynamicValueBinding<unknown>;
  let factoryBinding: FactoryBinding<unknown>;
  let instanceBinding: InstanceBinding<unknown>;
  let providerBinding: ProviderBinding<unknown>;
  let serviceRedirectionBinding: ServiceRedirectionBinding<unknown>;
  let serviceRedirectionToNonExistentBinding: ServiceRedirectionBinding<unknown>;

  let bindingService: BindingService;
  let getClassMetadataFunction: (type: Newable) => ClassMetadata;

  beforeAll(() => {
    constantValueBinding = {
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
      serviceIdentifier: ServiceIds.constantValue,
      type: bindingTypeValues.ConstantValue,
    };

    dynamicValueBinding = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: 1,
      isSatisfiedBy: () => true,
      moduleId: undefined,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: ServiceIds.dynamicValue,
      type: bindingTypeValues.DynamicValue,
      value: () => Symbol(),
    };

    factoryBinding = {
      cache: {
        isRight: false,
        value: undefined,
      },
      factory: () => (): unknown => Symbol(),
      id: 2,
      isSatisfiedBy: () => true,
      moduleId: undefined,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: ServiceIds.factory,
      type: bindingTypeValues.Factory,
    };

    instanceBinding = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: 3,
      implementationType: Foo,
      isSatisfiedBy: () => true,
      moduleId: undefined,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: ServiceIds.instance,
      type: bindingTypeValues.Instance,
    };

    providerBinding = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: 4,
      isSatisfiedBy: () => true,
      moduleId: undefined,
      onActivation: undefined,
      onDeactivation: undefined,
      provider: () => async () => Symbol(),
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: ServiceIds.provider,
      type: bindingTypeValues.Provider,
    };

    serviceRedirectionBinding = {
      id: 5,
      isSatisfiedBy: () => true,
      moduleId: undefined,
      serviceIdentifier: ServiceIds.serviceRedirection,
      targetServiceIdentifier: constantValueBinding.serviceIdentifier,
      type: bindingTypeValues.ServiceRedirection,
    };

    serviceRedirectionToNonExistentBinding = {
      id: 6,
      isSatisfiedBy: () => true,
      moduleId: undefined,
      serviceIdentifier: ServiceIds.serviceRedirectionToNonExistent,
      targetServiceIdentifier: ServiceIds.nonExistent,
      type: bindingTypeValues.ServiceRedirection,
    };

    bindingService = new BindingServiceImplementation();

    bindingService.set(constantValueBinding);
    bindingService.set(dynamicValueBinding);
    bindingService.set(factoryBinding);
    bindingService.set(instanceBinding);
    bindingService.set(providerBinding);
    bindingService.set(serviceRedirectionBinding);
    bindingService.set(serviceRedirectionToNonExistentBinding);

    getClassMetadataFunction = (type: Newable): ClassMetadata =>
      getMetadata(classMetadataReflectKey, type) ?? getDefaultClassMetadata();
  });

  describe.each<[string, PlanParamsConstraint, () => PlanResult]>([
    [
      "with constant value bound service",
      {
        isMultiple: false,
        serviceIdentifier: ServiceIds.constantValue,
      },
      () => buildLeafBindingPlanResult(constantValueBinding),
    ],
    [
      "with dynamic value bound service",
      {
        isMultiple: false,
        serviceIdentifier: ServiceIds.dynamicValue,
      },
      () => buildLeafBindingPlanResult(dynamicValueBinding),
    ],
    [
      "with factory bound service",
      {
        isMultiple: false,
        serviceIdentifier: ServiceIds.factory,
      },
      () => buildLeafBindingPlanResult(factoryBinding),
    ],
    [
      "with instance bound service",
      {
        isMultiple: false,
        serviceIdentifier: ServiceIds.instance,
      },
      () =>
        buildSimpleInstancePlanResult(
          constantValueBinding,
          ["property", dynamicValueBinding],
          instanceBinding
        ),
    ],
    [
      "with provider bound service",
      {
        isMultiple: false,
        serviceIdentifier: ServiceIds.provider,
      },
      () => buildLeafBindingPlanResult(providerBinding),
    ],
    [
      "with service redirection bound service",
      {
        isMultiple: false,
        serviceIdentifier: ServiceIds.serviceRedirection,
      },
      () =>
        buildServiceRedirectionToLeafBindingPlanResult(
          constantValueBinding,
          serviceRedirectionBinding
        ),
    ],
  ])(
    "having plan params %s",
    (
      _: string,
      planParamsConstraint: PlanParamsConstraint,
      expectedResultBuilder: () => PlanResult
    ) => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          result = plan({
            getBindings: bindingService.get.bind(bindingService),
            getClassMetadata: getClassMetadataFunction,
            rootConstraints: planParamsConstraint,
            servicesBranch: new Set(),
          });
        });

        it("should return expected plan", () => {
          expect(result).toStrictEqual(expectedResultBuilder());
        });
      });
    }
  );

  describe.each<[string, PlanParamsConstraint, Partial<InversifyCoreError>]>([
    [
      "with non existent service id",
      {
        isMultiple: false,
        serviceIdentifier: ServiceIds.nonExistent,
      },
      {
        kind: InversifyCoreErrorKind.planning,
        message: `No bindings found for service: "${ServiceIds.nonExistent}".

Trying to resolve bindings for "${ServiceIds.nonExistent} (Root service)".`,
      },
    ],
    [
      "with service redirection to non existent service id",
      {
        isMultiple: false,
        serviceIdentifier: ServiceIds.serviceRedirectionToNonExistent,
      },
      {
        kind: InversifyCoreErrorKind.planning,
        message: `No bindings found for service: "${ServiceIds.nonExistent}".

Trying to resolve bindings for "${ServiceIds.serviceRedirectionToNonExistent}".`,
      },
    ],
  ])(
    "having plan params %s",
    (
      _: string,
      planParamsConstraint: PlanParamsConstraint,
      expectedErrorProperties: Partial<InversifyCoreError>
    ) => {
      describe("when called", () => {
        let result: unknown;

        beforeAll(() => {
          try {
            plan({
              getBindings: bindingService.get.bind(bindingService),
              getClassMetadata: getClassMetadataFunction,
              rootConstraints: planParamsConstraint,
              servicesBranch: new Set(),
            });
          } catch (error: unknown) {
            result = error;
          }
        });

        it("should return expected plan", () => {
          expect(result).toBeInstanceOf(InversifyCoreError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties)
          );
        });
      });
    }
  );
});
