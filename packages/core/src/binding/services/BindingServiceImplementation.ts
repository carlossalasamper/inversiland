import { ServiceIdentifier } from "@inversiland/common";

import { Binding } from "../types/Binding";
import { BindingService } from "../types/BindingService";

export class BindingServiceImplementation implements BindingService {
  readonly #idToBindingMap: Map<ServiceIdentifier, Binding<unknown>[]>;
  readonly #moduleIdToIdToBindingMap: Map<
    number,
    Map<number, Binding<unknown>>
  >;

  constructor() {
    this.#idToBindingMap = new Map();
    this.#moduleIdToIdToBindingMap = new Map();
  }

  public get<TInstance>(
    serviceIdentifier: ServiceIdentifier
  ): Binding<TInstance>[] | undefined {
    return this.#idToBindingMap.get(serviceIdentifier) as
      | Binding<TInstance>[]
      | undefined;
  }

  public remove(serviceIdentifier: ServiceIdentifier): void {
    const serviceBindings: Binding<unknown>[] | undefined =
      this.#idToBindingMap.get(serviceIdentifier);

    this.#idToBindingMap.delete(serviceIdentifier);

    if (serviceBindings !== undefined) {
      this.#removeBindingsFromModuleMap(serviceBindings);
    }
  }

  public removeByModule(moduleId: number): void {
    const moduleBindings: Map<number, Binding<unknown>> | undefined =
      this.#moduleIdToIdToBindingMap.get(moduleId);

    if (moduleBindings === undefined) {
      return;
    }

    this.#moduleIdToIdToBindingMap.delete(moduleId);

    this.#removeBindingsFromIdMap(moduleBindings.values());
  }

  public set<TInstance>(binding: Binding<TInstance>): void {
    this.#setIdToBindingMapBinding(binding);
    this.#setModuleIdToIdToBindingMapBinding(binding);
  }

  #removeBindingsFromIdMap(bindings: Iterable<Binding<unknown>>): void {
    for (const binding of bindings) {
      let serviceBindings: Binding<unknown>[] | undefined =
        this.#idToBindingMap.get(binding.serviceIdentifier);

      if (serviceBindings !== undefined) {
        serviceBindings = serviceBindings.filter(
          (serviceBinding: Binding<unknown>): boolean =>
            serviceBinding.id !== binding.id
        );

        if (serviceBindings.length === 0) {
          this.#idToBindingMap.delete(binding.serviceIdentifier);
        } else {
          this.#idToBindingMap.set(binding.serviceIdentifier, serviceBindings);
        }
      }
    }
  }

  #removeBindingsFromModuleMap(bindings: Iterable<Binding<unknown>>): void {
    for (const binding of bindings) {
      if (binding.moduleId !== undefined) {
        const moduleBindings: Map<number, Binding<unknown>> | undefined =
          this.#moduleIdToIdToBindingMap.get(binding.moduleId);

        if (moduleBindings !== undefined) {
          moduleBindings.delete(binding.id);

          if (moduleBindings.size === 0) {
            this.#moduleIdToIdToBindingMap.delete(binding.moduleId);
          }
        }
      }
    }
  }

  #setIdToBindingMapBinding<TInstance>(binding: Binding<TInstance>): void {
    let serviceBindings: Binding<unknown>[] | undefined =
      this.#idToBindingMap.get(binding.serviceIdentifier);

    if (serviceBindings === undefined) {
      serviceBindings = [];
    }

    serviceBindings.push(binding as Binding<unknown>);

    this.#idToBindingMap.set(binding.serviceIdentifier, serviceBindings);
  }

  #setModuleIdToIdToBindingMapBinding<TInstance>(
    binding: Binding<TInstance>
  ): void {
    if (binding.moduleId === undefined) {
      return;
    }

    let moduleBindingsMap: Map<number, Binding<unknown>> | undefined =
      this.#moduleIdToIdToBindingMap.get(binding.moduleId);

    if (moduleBindingsMap === undefined) {
      moduleBindingsMap = new Map();
      this.#moduleIdToIdToBindingMap.set(binding.moduleId, moduleBindingsMap);
    }

    moduleBindingsMap.set(binding.id, binding as Binding<unknown>);
  }
}
