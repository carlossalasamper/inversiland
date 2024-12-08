/* eslint-disable @typescript-eslint/naming-convention */

import type {
  Newable as CommonNewable,
  ServiceIdentifier as CommonServiceIdentifier,
} from "@inversiland/common";
import { LegacyTarget } from "@inversiland/core";

import { FactoryType } from "../utils/factory_type";

export type Newable<TInstance = unknown> = CommonNewable<TInstance>;

export type ServiceIdentifier<TInstance = unknown> =
  CommonServiceIdentifier<TInstance>;

export type DynamicValue<T> = (context: Context) => T | Promise<T>;
export type ContainerResolution<T> = T | Promise<T> | (T | Promise<T>)[];

type AsyncCallback<TCallback> = TCallback extends (
  ...args: infer TArgs
) => infer TResult
  ? (...args: TArgs) => Promise<TResult>
  : never;

export type BindingScope = "Singleton" | "Transient" | "Request";

export type BindingType =
  | "ConstantValue"
  | "Constructor"
  | "DynamicValue"
  | "Factory"
  | "Function"
  | "Instance"
  | "Invalid"
  | "Provider";

export type TargetType = "ConstructorArgument" | "ClassProperty" | "Variable";

export interface BindingScopeEnum {
  Request: BindingScope;
  Singleton: BindingScope;
  Transient: BindingScope;
}

export interface BindingTypeEnum {
  ConstantValue: BindingType;
  Constructor: BindingType;
  DynamicValue: BindingType;
  Factory: BindingType;
  Function: BindingType;
  Instance: BindingType;
  Invalid: BindingType;
  Provider: BindingType;
}

export interface TargetTypeEnum {
  ConstructorArgument: TargetType;
  ClassProperty: TargetType;
  Variable: TargetType;
}

export type Instance<T> = T & Record<string, () => void>;

export interface Abstract<T> {
  prototype: T;
}

export interface Clonable<T> {
  clone(): T;
}

export type BindingActivation<T = unknown> = (
  context: Context,
  injectable: T
) => T | Promise<T>;

export type BindingDeactivation<T = unknown> = (
  injectable: T
) => void | Promise<void>;

export type BindingState<T = unknown> = {
  activated: boolean;
  cache: T | Promise<T> | null;
};

export interface Binding<TActivated = unknown>
  extends Clonable<Binding<TActivated>> {
  id: number;
  moduleId: ContainerModuleBase["id"];
  serviceIdentifier: ServiceIdentifier<TActivated>;
  constraint: ConstraintFunction;
  dynamicValue: DynamicValue<TActivated> | null;
  scope: BindingScope;
  type: BindingType;
  implementationType: Newable<TActivated> | TActivated | null;
  factory: FactoryCreator<unknown> | null;
  provider: ProviderCreator<unknown> | null;
  onActivation: BindingActivation<TActivated> | null;
  onDeactivation: BindingDeactivation<TActivated> | null;
  state: BindingState<TActivated>;
  container: Container | null;
}

export type SimpleFactory<T, U extends unknown[] = unknown[]> = (
  ...args: U
) => T;

export type MultiFactory<
  T,
  U extends unknown[] = unknown[],
  V extends unknown[] = unknown[]
> = (...args: U) => SimpleFactory<T, V>;

export type Factory<
  T,
  U extends unknown[] = unknown[],
  V extends unknown[] = unknown[]
> = SimpleFactory<T, U> | MultiFactory<T, U, V>;

export type FactoryCreator<
  T,
  U extends unknown[] = unknown[],
  V extends unknown[] = unknown[]
> = (context: Context) => Factory<T, U, V>;

export type AutoNamedFactory<T> = SimpleFactory<T, [string]>;

export type AutoFactory<T> = SimpleFactory<T, []>;

export type FactoryTypeFunction<T = unknown> = (
  context: Context
) => T | Promise<T>;

export interface FactoryDetails {
  factoryType: FactoryType;
  factory: FactoryTypeFunction | null;
}

export type Provider<T> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
((...args: any[]) => Promise<T>) | Promise<T>;

export type ProviderCreator<T> = (context: Context) => Provider<T>;

export interface NextArgs<T = unknown> {
  avoidConstraints: boolean;
  contextInterceptor: (contexts: Context) => Context;
  isMultiInject: boolean;
  targetType: TargetType;
  serviceIdentifier: ServiceIdentifier<T>;
  key?: string | number | symbol | undefined;
  value?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Next = (args: NextArgs) => unknown | unknown[];

export type Middleware = (next: Next) => Next;

export type ContextInterceptor = (context: Context) => Context;

export interface Context extends Clonable<Context> {
  id: number;
  container: Container;
  plan: Plan;
  currentRequest: Request;
  addPlan(plan: Plan): void;
  setCurrentRequest(request: Request): void;
}

export type MetadataOrMetadataArray = Metadata | Metadata[];

export interface Metadata<TValue = unknown> {
  key: string | number | symbol;
  value: TValue;
}

export interface Plan {
  parentContext: Context;
  rootRequest: Request;
}

export interface QueryableString {
  startsWith(searchString: string): boolean;
  endsWith(searchString: string): boolean;
  contains(searchString: string): boolean;
  equals(compareString: string): boolean;
  value(): string;
}

export type ResolveRequestHandler = (request: Request) => unknown;

export type RequestScope = Map<unknown, unknown>;

export interface Request {
  id: number;
  serviceIdentifier: ServiceIdentifier;
  parentContext: Context;
  parentRequest: Request | null;
  childRequests: Request[];
  target: Target;
  bindings: Binding<unknown>[];
  requestScope: RequestScope | null;
  addChildRequest(
    serviceIdentifier: ServiceIdentifier,
    bindings: Binding<unknown> | Binding<unknown>[],
    target: Target
  ): Request;
}

export type Target = LegacyTarget;

export interface ContainerOptions {
  autoBindInjectable?: boolean;
  defaultScope?: BindingScope | undefined;
  skipBaseClassChecks?: boolean;
}

export interface Container {
  id: number;
  parent: Container | null;
  options: ContainerOptions;
  bind<T>(serviceIdentifier: ServiceIdentifier<T>): BindingToSyntax<T>;
  rebind<T>(serviceIdentifier: ServiceIdentifier<T>): BindingToSyntax<T>;
  rebindAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>
  ): Promise<BindingToSyntax<T>>;
  unbind(serviceIdentifier: ServiceIdentifier): void;
  unbindAsync(serviceIdentifier: ServiceIdentifier): Promise<void>;
  unbindAll(): void;
  unbindAllAsync(): Promise<void>;
  isBound(serviceIdentifier: ServiceIdentifier): boolean;
  isCurrentBound<T>(serviceIdentifier: ServiceIdentifier<T>): boolean;
  isBoundNamed(
    serviceIdentifier: ServiceIdentifier,
    named: string | number | symbol
  ): boolean;
  isCurrentBoundNamed(
    serviceIdentifier: ServiceIdentifier,
    named: string | number | symbol
  ): boolean;
  isBoundTagged(
    serviceIdentifier: ServiceIdentifier,
    key: string | number | symbol,
    value: unknown
  ): boolean;
  isCurrentBoundTagged(
    serviceIdentifier: ServiceIdentifier,
    key: string | number | symbol,
    value: unknown
  ): boolean;
  get<T>(serviceIdentifier: ServiceIdentifier<T>): T;
  getNamed<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol
  ): T;
  getTagged<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown
  ): T;
  getAll<T>(serviceIdentifier: ServiceIdentifier<T>): T[];
  getAllTagged<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown
  ): T[];
  getAllNamed<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol
  ): T[];
  getAsync<T>(serviceIdentifier: ServiceIdentifier<T>): Promise<T>;
  getNamedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol
  ): Promise<T>;
  getTaggedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown
  ): Promise<T>;
  getAllAsync<T>(serviceIdentifier: ServiceIdentifier<T>): Promise<T[]>;
  getAllTaggedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown
  ): Promise<T[]>;
  getAllNamedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol
  ): Promise<T[]>;
  onActivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    onActivation: BindingActivation<T>
  ): void;
  onDeactivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    onDeactivation: BindingDeactivation<T>
  ): void;
  resolve<T>(constructorFunction: Newable<T>): T;
  load(...modules: ContainerModule[]): void;
  loadAsync(...modules: AsyncContainerModule[]): Promise<void>;
  unload(...modules: ContainerModuleBase[]): void;
  unloadAsync(...modules: ContainerModuleBase[]): Promise<void>;
  applyCustomMetadataReader(metadataReader: MetadataReader): void;
  applyMiddleware(...middleware: Middleware[]): void;
  snapshot(): void;
  restore(): void;
  createChild(): Container;
  copyBindings(
    container: Container,
    serviceIdentifiers: ServiceIdentifier[],
    metadata?: Metadata,
    newConstraint?: ConstraintFunction
  ): void;
}

export type Bind = <T = unknown>(
  serviceIdentifier: ServiceIdentifier<T>
) => BindingToSyntax<T>;

export type Rebind = <T = unknown>(
  serviceIdentifier: ServiceIdentifier<T>
) => BindingToSyntax<T>;

export type Unbind = <T = unknown>(
  serviceIdentifier: ServiceIdentifier<T>
) => void;

export type UnbindAsync = <T = unknown>(
  serviceIdentifier: ServiceIdentifier<T>
) => Promise<void>;

export type IsBound = <T = unknown>(
  serviceIdentifier: ServiceIdentifier<T>
) => boolean;

export interface ContainerModuleBase {
  id: number;
}

export interface ContainerModule extends ContainerModuleBase {
  registry: ContainerModuleCallBack;
}

export interface AsyncContainerModule extends ContainerModuleBase {
  registry: AsyncContainerModuleCallBack;
}

export interface ModuleActivationHandlers {
  onActivations: Lookup<BindingActivation<unknown>>;
  onDeactivations: Lookup<BindingDeactivation<unknown>>;
}

export interface ModuleActivationStore extends Clonable<ModuleActivationStore> {
  addDeactivation<T>(
    moduleId: ContainerModuleBase["id"],
    serviceIdentifier: ServiceIdentifier<T>,
    onDeactivation: BindingDeactivation<T>
  ): void;
  addActivation<T>(
    moduleId: ContainerModuleBase["id"],
    serviceIdentifier: ServiceIdentifier<T>,
    onActivation: BindingActivation<T>
  ): void;
  remove(moduleId: ContainerModuleBase["id"]): ModuleActivationHandlers;
}

export type ContainerModuleCallBack = (
  bind: Bind,
  unbind: Unbind,
  isBound: IsBound,
  rebind: Rebind,
  unbindAsync: UnbindAsync,
  onActivation: Container["onActivation"],
  onDeactivation: Container["onDeactivation"]
) => void;

export type AsyncContainerModuleCallBack =
  AsyncCallback<ContainerModuleCallBack>;

export interface ContainerSnapshot {
  bindings: Lookup<Binding<unknown>>;
  activations: Lookup<BindingActivation<unknown>>;
  deactivations: Lookup<BindingDeactivation<unknown>>;
  middleware: Next | null;
  moduleActivationStore: ModuleActivationStore;
}

export interface Lookup<T> extends Clonable<Lookup<T>> {
  add(serviceIdentifier: ServiceIdentifier, value: T): void;
  getMap(): Map<ServiceIdentifier, T[]>;
  get(serviceIdentifier: ServiceIdentifier): T[];
  remove(serviceIdentifier: ServiceIdentifier): void;
  removeByCondition(condition: (item: T) => boolean): T[];
  removeIntersection(lookup: Lookup<T>): void;
  hasKey(serviceIdentifier: ServiceIdentifier): boolean;
  clone(): Lookup<T>;
  traverse(func: (key: ServiceIdentifier, value: T[]) => void): void;
}

export interface BindingOnSyntax<T> {
  onActivation(
    fn: (context: Context, injectable: T) => T | Promise<T>
  ): BindingWhenSyntax<T>;
  onDeactivation(
    fn: (injectable: T) => void | Promise<void>
  ): BindingWhenSyntax<T>;
}

export interface BindingWhenSyntax<T> {
  when(constraint: (request: Request) => boolean): BindingOnSyntax<T>;
  whenTargetNamed(name: string | number | symbol): BindingOnSyntax<T>;
  whenTargetIsDefault(): BindingOnSyntax<T>;
  whenTargetTagged(
    tag: string | number | symbol,
    value: unknown
  ): BindingOnSyntax<T>;
  whenInjectedInto(parent: NewableFunction | string): BindingOnSyntax<T>;
  whenParentNamed(name: string | number | symbol): BindingOnSyntax<T>;
  whenParentTagged(
    tag: string | number | symbol,
    value: unknown
  ): BindingOnSyntax<T>;
  whenAnyAncestorIs(ancestor: NewableFunction | string): BindingOnSyntax<T>;
  whenNoAncestorIs(ancestor: NewableFunction | string): BindingOnSyntax<T>;
  whenAnyAncestorNamed(name: string | number | symbol): BindingOnSyntax<T>;
  whenAnyAncestorTagged(
    tag: string | number | symbol,
    value: unknown
  ): BindingOnSyntax<T>;
  whenNoAncestorNamed(name: string | number | symbol): BindingOnSyntax<T>;
  whenNoAncestorTagged(
    tag: string | number | symbol,
    value: unknown
  ): BindingOnSyntax<T>;
  whenAnyAncestorMatches(
    constraint: (request: Request) => boolean
  ): BindingOnSyntax<T>;
  whenNoAncestorMatches(
    constraint: (request: Request) => boolean
  ): BindingOnSyntax<T>;
}

export interface BindingWhenOnSyntax<T>
  extends BindingWhenSyntax<T>,
    BindingOnSyntax<T> {}

export interface BindingInSyntax<T> {
  inSingletonScope(): BindingWhenOnSyntax<T>;
  inTransientScope(): BindingWhenOnSyntax<T>;
  inRequestScope(): BindingWhenOnSyntax<T>;
}

export interface BindingInWhenOnSyntax<T>
  extends BindingInSyntax<T>,
    BindingWhenOnSyntax<T> {}

export interface BindingToSyntax<T> {
  to(constructor: Newable<T>): BindingInWhenOnSyntax<T>;
  toSelf(): BindingInWhenOnSyntax<T>;
  toConstantValue(value: T): BindingWhenOnSyntax<T>;
  toDynamicValue(func: DynamicValue<T>): BindingInWhenOnSyntax<T>;
  toConstructor<T2>(constructor: Newable<T2>): BindingWhenOnSyntax<T>;
  toFactory<
    T2,
    T3 extends unknown[] = unknown[],
    T4 extends unknown[] = unknown[]
  >(
    factory: FactoryCreator<T2, T3, T4>
  ): BindingWhenOnSyntax<T>;
  toFunction(func: T): BindingWhenOnSyntax<T>;
  toAutoFactory<T2>(
    serviceIdentifier: ServiceIdentifier<T2>
  ): BindingWhenOnSyntax<T>;
  toAutoNamedFactory<T2>(
    serviceIdentifier: ServiceIdentifier<T2>
  ): BindingWhenOnSyntax<T>;
  toProvider<T2>(provider: ProviderCreator<T2>): BindingWhenOnSyntax<T>;
  toService(service: ServiceIdentifier<T>): void;
}

export interface ConstraintFunction {
  (request: Request | null): boolean;
  metaData?: Metadata;
}

export interface MetadataReader {
  getConstructorMetadata(constructorFunc: NewableFunction): ConstructorMetadata;
  getPropertiesMetadata(constructorFunc: NewableFunction): MetadataMap;
}

export interface MetadataMap {
  [propertyNameOrArgumentIndex: string | symbol]: Metadata[];
}

export interface ConstructorMetadata {
  compilerGeneratedMetadata: NewableFunction[] | undefined;
  userGeneratedMetadata: MetadataMap;
}
