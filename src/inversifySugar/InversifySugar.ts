import { Newable } from "../types";
import ModuleMetadata from "../types/ModuleMetadata";
import InversifySugarState from "../types/InversifySugarState";
import { Container } from "@carlossalasamper/inversify";
import inversifySugarOptions, {
  defaultInversifySugarOptions,
} from "./inversifySugarOptions";
import { debugMiddleware } from "../middlewares";
import messagesMap from "../messages/messagesMap";
import importModule from "../importing/importModule";
import unbindModule from "../binding/unbindModule";
import ModuleContainer from "../modules/ModuleContainer";
import { NewableModule } from "../types/Module";

/**
 * @description InversifySugar is a utility class that helps you to bootstrap inversify and configure it.
 */
export default class InversifySugar {
  private static readonly state: InversifySugarState = {
    isRunning: false,
    globalContainer: new Container(),
    rootModule: undefined,
  };

  public static get globalContainer() {
    return InversifySugar.state.globalContainer;
  }

  public static readonly options = inversifySugarOptions;

  /**
   * @description This method is used to bootstrap inversify and import the AppModule.
   */
  public static run(AppModule: NewableModule) {
    if (InversifySugar.state.isRunning) {
      throw new Error(messagesMap.alreadyRunning);
    }

    InversifySugar.state.isRunning = true;
    InversifySugar.state.rootModule = AppModule;

    importModule(AppModule, true);
  }

  /**
   * @description This method is used to reset the options and state of the dependency system.
   * It is useful for testing purposes.
   */
  static async reset() {
    InversifySugar.state.rootModule &&
      (await unbindModule(InversifySugar.state.rootModule));

    await InversifySugar.globalContainer.unbindAllAsync();

    Object.assign(InversifySugar.state, {
      isRunning: false,
      rootModule: undefined,
    });

    Object.assign(InversifySugar.options, defaultInversifySugarOptions);
  }

  static onModuleBinded(
    container: ModuleContainer,
    metadata: ModuleMetadata,
    Module: NewableModule
  ) {
    inversifySugarOptions.onModuleBinded?.(container, metadata, Module);

    if (inversifySugarOptions.debug) {
      console.log(messagesMap.moduleProvidersBinded(Module.name));
    }
  }

  static setOnModuleBinded(
    value: (
      container: ModuleContainer,
      metadata: ModuleMetadata,
      Module: Newable
    ) => void
  ) {
    inversifySugarOptions.onModuleBinded = value;
  }
}

InversifySugar.globalContainer.applyMiddleware(debugMiddleware);