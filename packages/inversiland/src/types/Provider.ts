/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "@carlossalasamper/inversify";
import {
  AsyncFactory,
  AsyncFactoryWrapper,
  Factory,
  FactoryWrapper,
  Newable,
} from ".";

interface WithProvide {
  /**
   * @description ServiceIdentifier / InjectionToken
   */
  provide: interfaces.ServiceIdentifier;
}

export interface WithIsGlobal {
  /**
   * @description Flag that indicates if the provider is bound to the global container.
   */
  isGlobal?: boolean;
}

interface WithHandlers<T = any> {
  onActivation?: (context: interfaces.Context, injectable: T) => T;
  onDeactivation?: (injectable: T) => void;
}

/**
 * @description Shorthand to define a *Class* provider to self in singleton scope.
 */
export type NewableProvider<T = any> = Newable<T>;

/**
 * @description Interface defining a *Class* type provider.
 */
export interface ClassProvider<T = any>
  extends Partial<WithProvide>,
    WithIsGlobal,
    WithHandlers<T> {
  /**
   * @description Instance of a provider to be injected.
   */
  useClass: T;
  useValue?: never;
  /**
   * @description Binding scope of a provider.
   * @default 'Transient'
   */
  scope?: interfaces.BindingScope;
}

/**
 * @description Interface defining a *Value* type provider.
 */
export interface ValueProvider<T = any>
  extends WithProvide,
    WithIsGlobal,
    WithHandlers<T> {
  /**
   * @description Instance of a provider to be injected.
   */
  useValue: T;
  useClass?: never;
}

/**
 * @description Interface defining a *Factory* type provider. The scope of a factory provider is always singleton.
 */
export interface FactoryProvider<T = any, FactoryType extends Factory = Factory>
  extends WithProvide,
    WithIsGlobal,
    WithHandlers<T> {
  /**
   * @description Factory function to be injected.
   */
  useFactory: FactoryWrapper<FactoryType>;
  useValue?: never;
  useClass?: never;
}

/**
 * @description Interface defining a *AsyncFactory* type provider. The scope of a async factory provider is always singleton.
 * AsyncFactory is an alias of the Inversify Provider.
 */
export interface AsyncFactoryProvider<
  T = any,
  AsyncFactoryType extends AsyncFactory = AsyncFactory
> extends WithProvide,
    WithIsGlobal,
    WithHandlers<T> {
  /**
   * @description Factory function to be injected.
   */
  useAsyncFactory: AsyncFactoryWrapper<AsyncFactoryType>;
  useValue?: never;
  useClass?: never;
}

/**
 * @description Interface defining an *Existing* type provider.
 */
export interface ExistingProvider<T = any> extends WithProvide, WithIsGlobal {
  useExisting: interfaces.ServiceIdentifier<T>;
}

type Provider<T = any> =
  | NewableProvider<T>
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>
  | AsyncFactoryProvider<T>
  | ExistingProvider<T>;

export default Provider;
