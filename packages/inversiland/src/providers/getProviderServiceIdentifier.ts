import { interfaces } from "@carlossalasamper/inversify";

import messagesMap from "../messages/messagesMap";
import { Provider } from "../types";
import {
  AsyncFactoryProvider,
  ClassProvider,
  FactoryProvider,
  NewableProvider,
  ValueProvider,
} from "../types/Provider";
import isAsyncFactoryProvider from "../validation/isAsyncFactoryProvider";
import isClassProvider from "../validation/isClassProvider";
import isFactoryProvider from "../validation/isFactoryProvider";
import isNewable from "../validation/isNewable";
import isValueProvider from "../validation/isValueProvider";

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
