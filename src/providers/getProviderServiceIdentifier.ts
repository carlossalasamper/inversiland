import { interfaces } from "@carlossalasamper/inversify";
import { Provider } from "../types";
import isNewable from "../validation/isNewable";
import isClassProvider from "../validation/isClassProvider";
import {
  AsyncFactoryProvider,
  ClassProvider,
  FactoryProvider,
  NewableProvider,
  ValueProvider,
} from "../types/Provider";
import isValueProvider from "../validation/isValueProvider";
import isFactoryProvider from "../validation/isFactoryProvider";
import isAsyncFactoryProvider from "../validation/isAsyncFactoryProvider";
import messagesMap from "../messages/messagesMap";

export default function getProviderServiceIdentifier(
  provider: Provider
): interfaces.ServiceIdentifier {
  let serviceIdentifier: interfaces.ServiceIdentifier;

  if (isNewable(provider)) {
    const newableProvider = provider as NewableProvider;
    serviceIdentifier = newableProvider;
  } else if (isClassProvider(provider)) {
    const classProvider = provider as ClassProvider;
    serviceIdentifier = classProvider.provide || classProvider.useClass;
  } else if (isValueProvider(provider)) {
    const valueProvider = provider as ValueProvider;
    serviceIdentifier = valueProvider.provide;
  } else if (isFactoryProvider(provider)) {
    const factoryProvider = provider as FactoryProvider;
    serviceIdentifier = factoryProvider.provide;
  } else if (isAsyncFactoryProvider(provider)) {
    const asyncFactoryProvider = provider as AsyncFactoryProvider;
    serviceIdentifier = asyncFactoryProvider.provide;
  } else {
    throw new Error(messagesMap.unknownProviderType);
  }

  return serviceIdentifier;
}
