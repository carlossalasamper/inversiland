import { Container } from "@inversiland/inversify";

import providedConstraint from "../constraints/providedConstraint";
import inversilandOptions from "../inversiland/inversilandOptions";
import { Provider } from "../types";
import {
  AsyncFactoryProvider,
  ClassProvider,
  ExistingProvider,
  FactoryProvider,
  NewableProvider,
  ValueProvider,
} from "../types/Provider";
import isAsyncFactoryProvider from "../validation/isAsyncFactoryProvider";
import isClassProvider from "../validation/isClassProvider";
import isExistingProvider from "../validation/isExistingProvider";
import isFactoryProvider from "../validation/isFactoryProvider";
import isNewable from "../validation/isNewable";
import isValueProvider from "../validation/isValueProvider";
import bindScope from "./bindScope";

export default function bindProviderToContainer(
  provider: Provider,
  container: Container,
  resolutionContainer?: Container
) {
  if (isNewable(provider)) {
    const newableProvider = provider as NewableProvider;
    const scope = inversilandOptions.defaultScope;

    bindScope(
      container.bind(newableProvider, resolutionContainer).toSelf(),
      scope
    ).when(providedConstraint);
  } else if (isClassProvider(provider)) {
    const classProvider = provider as ClassProvider;
    const scope = classProvider.scope || inversilandOptions.defaultScope;
    const bindingOnSyntax = bindScope(
      classProvider.provide
        ? container
            .bind(classProvider.provide, resolutionContainer)
            .to(classProvider.useClass)
        : container.bind(classProvider.useClass, resolutionContainer).toSelf(),
      scope
    ).when(providedConstraint);

    classProvider.onActivation &&
      bindingOnSyntax.onActivation(classProvider.onActivation);

    scope === "Singleton" &&
      classProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(classProvider.onDeactivation);
  } else if (isValueProvider(provider)) {
    const valueProvider = provider as ValueProvider;
    const bindingOnSyntax = container
      .bind(valueProvider.provide, resolutionContainer)
      .toConstantValue(valueProvider.useValue)
      .when(providedConstraint);

    valueProvider.onActivation &&
      bindingOnSyntax.onActivation(valueProvider.onActivation);

    valueProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(valueProvider.onDeactivation);
  } else if (isFactoryProvider(provider)) {
    const factoryProvider = provider as FactoryProvider;
    const bindingOnSyntax = container
      .bind(factoryProvider.provide, resolutionContainer)
      .toFactory(factoryProvider.useFactory)
      .when(providedConstraint);

    factoryProvider.onActivation &&
      bindingOnSyntax.onActivation(factoryProvider.onActivation);

    factoryProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(factoryProvider.onDeactivation);
  } else if (isAsyncFactoryProvider(provider)) {
    const asyncFactoryProvider = provider as AsyncFactoryProvider;
    const bindingOnSyntax = container
      .bind(asyncFactoryProvider.provide, resolutionContainer)
      .toProvider(asyncFactoryProvider.useAsyncFactory)
      .when(providedConstraint);

    asyncFactoryProvider.onActivation &&
      bindingOnSyntax.onActivation(asyncFactoryProvider.onActivation);

    asyncFactoryProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(asyncFactoryProvider.onDeactivation);
  } else if (isExistingProvider(provider)) {
    const existingProvider = provider as ExistingProvider;

    container
      .bind(existingProvider.provide, resolutionContainer)
      .toService(existingProvider.useExisting);
  }
}
