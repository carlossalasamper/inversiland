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
import { NewableModule } from "../types/Module";
import { getModuleMetadata } from "../metadata/getModuleMetadata";

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

    console.log(
      messagesMap.globalProvidersBound(InversifySugar.globalContainer.id)
    );
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

  static onModuleBound(Module: NewableModule) {
    const metadata = getModuleMetadata(Module);

    inversifySugarOptions.onModuleBound?.(metadata);

    if (inversifySugarOptions.debug) {
      console.log(
        messagesMap.moduleBound(
          Module.name,
          metadata.container.innerContainer.id
        )
      );
    }
  }

  static setOnModuleBound(value: (metadata: ModuleMetadata) => void) {
    inversifySugarOptions.onModuleBound = value;
  }
}

InversifySugar.globalContainer.applyMiddleware(debugMiddleware);
