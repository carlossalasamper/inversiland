/* eslint-disable @typescript-eslint/no-explicit-any */
import Provider, {
  ClassProvider,
  NewableProvider,
  FactoryProvider,
  ValueProvider,
  AsyncFactoryProvider,
} from "../types/Provider";
import isNewable from "./validation/isNewable";
import isClassProvider from "./validation/isClassProvider";
import isValueProvider from "./validation/isValueProvider";
import isFactoryProvider from "./validation/isFactoryProvider";
import setScope from "./setScope";
import { Container } from "inversify";
import { PROVIDED_TAG } from "./constants";
import isAsyncFactoryProvider from "./validation/isAsyncFactoryProvider";

export const bindProviderToContainer = (
  provider: Provider,
  container: Container
) => {
  if (isNewable(provider)) {
    const newableProvider = provider as NewableProvider;

    container
      .bind(newableProvider)
      .toSelf()
      .inSingletonScope()
      .whenTargetTagged(PROVIDED_TAG, true);
  } else if (isClassProvider(provider)) {
    const classProvider = provider as ClassProvider;
    setScope(
      classProvider.provide
        ? container.bind(classProvider.provide).to(classProvider.useClass)
        : container.bind(classProvider.useClass).toSelf(),
      classProvider.scope
    ).whenTargetTagged(PROVIDED_TAG, true);
  } else if (isValueProvider(provider)) {
    const valueProvider = provider as ValueProvider;

    container
      .bind(valueProvider.provide)
      .toConstantValue(valueProvider.useValue)
      .whenTargetTagged(PROVIDED_TAG, true);
  } else if (isFactoryProvider(provider)) {
    const factoryProvider = provider as FactoryProvider;

    container
      .bind(factoryProvider.provide)
      .toFactory(factoryProvider.useFactory)
      .whenTargetTagged(PROVIDED_TAG, true);
  } else if (isAsyncFactoryProvider(provider)) {
    const asyncFactoryProvider = provider as AsyncFactoryProvider;

    container
      .bind(asyncFactoryProvider.provide)
      .toProvider(asyncFactoryProvider.useAsyncFactory)
      .whenTargetTagged(PROVIDED_TAG, true);
  }
};
