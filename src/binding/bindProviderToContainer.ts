import { Container } from "@carlossalasamper/inversify";
import { Provider } from "../types";
import isNewable from "../validation/isNewable";
import bindScope from "./bindScope";
import isClassProvider from "../validation/isClassProvider";
import {
  AsyncFactoryProvider,
  ClassProvider,
  FactoryProvider,
  NewableProvider,
  ValueProvider,
} from "../types/Provider";
import isAsyncFactoryProvider from "../validation/isAsyncFactoryProvider";
import isFactoryProvider from "../validation/isFactoryProvider";
import isValueProvider from "../validation/isValueProvider";
import inversifySugarOptions from "../inversifySugar/inversifySugarOptions";
import providedConstraint from "../constraints/providedConstraint";

export default function bindProviderToContainer(
  provider: Provider,
  container: Container
) {
  if (isNewable(provider)) {
    const newableProvider = provider as NewableProvider;
    const scope = inversifySugarOptions.defaultScope;

    bindScope(container.bind(newableProvider).toSelf(), scope).when(
      providedConstraint
    );
  } else if (isClassProvider(provider)) {
    const classProvider = provider as ClassProvider;
    const scope = classProvider.scope || inversifySugarOptions.defaultScope;
    const bindingOnSyntax = bindScope(
      classProvider.provide
        ? container.bind(classProvider.provide).to(classProvider.useClass)
        : container.bind(classProvider.useClass).toSelf(),
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
      .bind(valueProvider.provide)
      .toConstantValue(valueProvider.useValue)
      .when(providedConstraint);

    valueProvider.onActivation &&
      bindingOnSyntax.onActivation(valueProvider.onActivation);

    valueProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(valueProvider.onDeactivation);
  } else if (isFactoryProvider(provider)) {
    const factoryProvider = provider as FactoryProvider;
    const bindingOnSyntax = container
      .bind(factoryProvider.provide)
      .toFactory(factoryProvider.useFactory)
      .when(providedConstraint);

    factoryProvider.onActivation &&
      bindingOnSyntax.onActivation(factoryProvider.onActivation);

    factoryProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(factoryProvider.onDeactivation);
  } else if (isAsyncFactoryProvider(provider)) {
    const asyncFactoryProvider = provider as AsyncFactoryProvider;
    const bindingOnSyntax = container
      .bind(asyncFactoryProvider.provide)
      .toProvider(asyncFactoryProvider.useAsyncFactory)
      .when(providedConstraint);

    asyncFactoryProvider.onActivation &&
      bindingOnSyntax.onActivation(asyncFactoryProvider.onActivation);

    asyncFactoryProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(asyncFactoryProvider.onDeactivation);
  }
}
