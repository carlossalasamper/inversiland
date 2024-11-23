import {
  AsyncFactoryProvider,
  ClassProvider,
  FactoryProvider,
  NewableProvider,
  ValueProvider,
} from "../../src/types/Provider";
import getProviderServiceIdentifier from "../../src/providers/getProviderServiceIdentifier";

describe("getProviderServiceIdentifier", () => {
  it("Should get ServiceIdentifier of a NewableProvider.", () => {
    const newableProvider: NewableProvider = class TestService {};
    const serviceIdentifier = getProviderServiceIdentifier(newableProvider);

    expect(serviceIdentifier).toEqual(newableProvider);
  });

  it("Should get ServiceIdentifier of a ClassProvider without provide property.", () => {
    const classProvider: ClassProvider = {
      useClass: class TestService {},
    };
    const serviceIdentifier = getProviderServiceIdentifier(classProvider);

    expect(serviceIdentifier).toEqual(classProvider.useClass);
  });

  it("Should get ServiceIdentifier of a ClassProvider with provide property.", () => {
    const classProvider: ClassProvider = {
      provide: "TestService",
      useClass: class TestService {},
    };
    const serviceIdentifier = getProviderServiceIdentifier(classProvider);

    expect(serviceIdentifier).toEqual(classProvider.provide);
  });

  it("Should get ServiceIdentifier of a ValueProvider.", () => {
    const classProvider: ValueProvider = {
      provide: "TestService",
      useValue: "TestValue",
    };
    const serviceIdentifier = getProviderServiceIdentifier(classProvider);

    expect(serviceIdentifier).toEqual(classProvider.provide);
  });

  it("Should get ServiceIdentifier of a FactoryProvider.", () => {
    const factoryProvider: FactoryProvider = {
      provide: "TestService",
      useFactory: () => () => "TestValue",
    };
    const serviceIdentifier = getProviderServiceIdentifier(factoryProvider);

    expect(serviceIdentifier).toEqual(factoryProvider.provide);
  });

  it("Should get ServiceIdentifier of a AsyncFactoryProvider.", () => {
    const asyncFactoryProvider: AsyncFactoryProvider = {
      provide: "TestService",
      useAsyncFactory: () => async () => "TestValue",
    };
    const serviceIdentifier =
      getProviderServiceIdentifier(asyncFactoryProvider);

    expect(serviceIdentifier).toEqual(asyncFactoryProvider.provide);
  });

  it("Should throw an error when the provider is not known.", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = {} as any;

    expect(() => getProviderServiceIdentifier(provider)).toThrow();
  });
});
