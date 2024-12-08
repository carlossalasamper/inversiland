import { Container } from "@inversiland/inversify";

import unbindModule from "../binding/unbindModule";
import importModule from "../importing/importModule";
import messagesMap from "../messages/messagesMap";
import { getModuleMetadata } from "../metadata/getModuleMetadata";
import { debugMiddleware } from "../middlewares";
import InversilandState from "../types/InversilandState";
import { NewableModule } from "../types/Module";
import ModuleMetadata from "../types/ModuleMetadata";
import inversilandOptions, {
  defaultInversilandOptions,
} from "./inversilandOptions";

/**
 * @description Inversiland is a utility class that helps you to bootstrap and configure the framework.
 */
export default class Inversiland {
  private static readonly state: InversilandState = {
    isRunning: false,
    globalContainer: new Container(),
    rootModule: undefined,
  };

  public static get globalContainer() {
    return Inversiland.state.globalContainer;
  }

  public static readonly options = inversilandOptions;

  /**
   * @description This method is used to bootstrap inversify and import the AppModule.
   */
  public static run(AppModule: NewableModule) {
    if (Inversiland.state.isRunning) {
      throw new Error(messagesMap.alreadyRunning);
    }

    Inversiland.state.isRunning = true;
    Inversiland.state.rootModule = AppModule;

    importModule(AppModule, true);

    if (
      Inversiland.options.logLevel === "info" ||
      Inversiland.options.logLevel === "debug"
    ) {
      console.log(
        messagesMap.globalProvidersBound(
          Inversiland.globalContainer.id,
          Inversiland.options.logLevel
        )
      );
    }
  }

  /**
   * @description This method is used to reset the options and state of the dependency system.
   * It is useful for testing purposes.
   */
  static async reset() {
    Inversiland.state.rootModule &&
      (await unbindModule(Inversiland.state.rootModule));

    await Inversiland.globalContainer.unbindAllAsync();

    Object.assign(Inversiland.state, {
      isRunning: false,
      rootModule: undefined,
    });

    Object.assign(Inversiland.options, defaultInversilandOptions);
  }

  static onModuleBound(Module: NewableModule) {
    const metadata = getModuleMetadata(Module);

    Inversiland.options.onModuleBound?.(metadata);

    if (
      Inversiland.options.logLevel === "info" ||
      Inversiland.options.logLevel === "debug"
    ) {
      console.log(
        messagesMap.moduleBound(
          Module.name,
          metadata.container.innerContainer.id,
          Inversiland.options.logLevel
        )
      );
    }
  }

  static setOnModuleBound(value: (metadata: ModuleMetadata) => void) {
    inversilandOptions.onModuleBound = value;
  }
}

Inversiland.globalContainer.applyMiddleware(debugMiddleware);
