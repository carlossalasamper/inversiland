import { Container, interfaces } from "inversify";
import { IMPORTED_TAG, PROVIDED_TAG } from "../utils/constants";
import { Provider } from "../types";
import InversifySugar from "./InversifySugar";
import bindProviderToContainer from "../utils/binding/bindProviderToContainer";
import ExportedProviderRef from "../types/ExportedProviderRef";
import bindExportedProviderRef from "../utils/binding/bindExportedProviderRefToContainer";
import { loggerMiddleware } from "../middlewares";

/**
 * @description Wrapper for inversify container to handle meaningful concern of provider.
 */
export default class ModuleContainer {
  private container: Container;

  constructor() {
    this.container = InversifySugar.globalContainer.createChild();
    this.container.applyMiddleware(loggerMiddleware);
  }

  isBound(serviceIdentifier: interfaces.ServiceIdentifier) {
    return this.container.isBound(serviceIdentifier);
  }

  isProvided(serviceIdentifier: interfaces.ServiceIdentifier) {
    return this.container.isBoundTagged(serviceIdentifier, PROVIDED_TAG, true);
  }

  isImported(serviceIdentifier: interfaces.ServiceIdentifier) {
    return this.container.isBoundTagged(serviceIdentifier, IMPORTED_TAG, true);
  }

  bindProvider(provider: Provider) {
    bindProviderToContainer(provider, this.container);
  }

  bindExportedProviderRef(exportedProviderRef: ExportedProviderRef) {
    bindExportedProviderRef(exportedProviderRef, this.container);
  }

  get<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    return this.container.get<T>(serviceIdentifier);
  }

  getAll<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    return this.container.getAll<T>(serviceIdentifier);
  }

  getProvided<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    return this.container.getTagged<T>(serviceIdentifier, PROVIDED_TAG, true);
  }

  getAllProvided<T = unknown>(
    serviceIdentifier: interfaces.ServiceIdentifier<T>
  ) {
    return this.container.getAllTagged<T>(
      serviceIdentifier,
      PROVIDED_TAG,
      true
    );
  }

  getImported<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    return this.container.getTagged<T>(serviceIdentifier, IMPORTED_TAG, true);
  }

  getAllImported<T = unknown>(
    serviceIdentifier: interfaces.ServiceIdentifier<T>
  ) {
    return this.container.getAllTagged<T>(
      serviceIdentifier,
      IMPORTED_TAG,
      true
    );
  }

  async unbindAllAsync() {
    return this.container.unbindAllAsync();
  }
}
