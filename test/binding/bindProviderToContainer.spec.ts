import { Container, injectable } from "@carlossalasamper/inversify";
import {
  ClassProvider,
  NewableProvider,
  FactoryProvider,
  ValueProvider,
  AsyncFactoryProvider,
} from "../../src/types/Provider";
import bindProviderToContainer from "../../src/binding/bindProviderToContainer";
import { PROVIDED_TAG } from "../../src/constants";

const TestClassToken = Symbol();

@injectable()
class TestClass {}

describe("bindProviderToContainer", () => {
  it("Should bind a NewableProvider to a container.", () => {
    const provider: NewableProvider = TestClass;
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(container.isBound(TestClass)).toBe(true);
  });

  it("Should bind a ClassProvider without provide to a container.", () => {
    const onActivationMock = jest.fn();
    const provider: ClassProvider = {
      useClass: TestClass,
      onActivation: (_context, injectable) => {
        onActivationMock();

        return injectable;
      },
      onDeactivation: jest.fn(),
    };
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(container.getTagged(TestClass, PROVIDED_TAG, true)).toBeInstanceOf(
      TestClass
    );
    expect(onActivationMock).toBeCalledTimes(1);

    container.unbindAll();

    // Should not call onActivation when scope is not singleton.
    expect(provider.onDeactivation).toBeCalledTimes(0);
  });

  it("Should bind a ClassProvider with provide to a container.", () => {
    const onActivationMock = jest.fn();
    const provider: ClassProvider = {
      provide: TestClassToken,
      useClass: TestClass,
      onActivation: (_context, injectable) => {
        onActivationMock();

        return injectable;
      },
      onDeactivation: jest.fn(),
      scope: "Singleton",
    };
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(
      container.getTagged(TestClassToken, PROVIDED_TAG, true)
    ).toBeInstanceOf(TestClass);
    expect(onActivationMock).toBeCalledTimes(1);

    container.unbindAll();

    expect(provider.onDeactivation).toBeCalledTimes(1);
  });

  it("Should bind a ValueProvider to a container.", () => {
    const onActivationMock = jest.fn();
    const value = new TestClass();
    const provider: ValueProvider = {
      provide: TestClassToken,
      useValue: value,
      onActivation: (_context, injectable) => {
        onActivationMock();

        return injectable;
      },
      onDeactivation: jest.fn(),
    };
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(container.getTagged(TestClassToken, PROVIDED_TAG, true)).toBe(value);
    expect(onActivationMock).toBeCalledTimes(1);

    container.unbindAll();

    expect(provider.onDeactivation).toBeCalledTimes(1);
  });

  it("Should bind a FactoryProvider to a container.", () => {
    const onActivationMock = jest.fn();
    const provider: FactoryProvider = {
      provide: TestClassToken,
      useFactory: () => () => new TestClass(),
      onActivation: (_context, injectable) => {
        onActivationMock();

        return injectable;
      },
      onDeactivation: jest.fn(),
    };
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(
      container.getTagged<() => TestClass>(TestClassToken, PROVIDED_TAG, true)()
    ).toBeInstanceOf(TestClass);
    expect(onActivationMock).toBeCalledTimes(1);

    container.unbindAll();

    expect(provider.onDeactivation).toBeCalledTimes(1);
  });

  it("Should bind a AsyncFactoryProvider to a container.", () => {
    const onActivationMock = jest.fn();
    const provider: AsyncFactoryProvider = {
      provide: TestClassToken,
      useAsyncFactory: () => async () => new TestClass(),
      onActivation: (_context, injectable) => {
        onActivationMock();

        return injectable;
      },
      onDeactivation: jest.fn(),
    };
    const container = new Container();

    bindProviderToContainer(provider, container);

    expect(
      container.isBoundTagged(TestClassToken, PROVIDED_TAG, true)
    ).toBeTruthy();
    expect(
      container.getTagged<() => Promise<TestClass>>(
        TestClassToken,
        PROVIDED_TAG,
        true
      )()
    ).resolves.toBeInstanceOf(TestClass);
    expect(onActivationMock).toBeCalledTimes(1);

    container.unbindAll();

    expect(provider.onDeactivation).toBeCalledTimes(1);
  });

  it("Should bind a ExistingProvider to a container.", () => {
    const container = new Container();

    bindProviderToContainer(
      {
        provide: TestClassToken,
        useClass: TestClass,
      },
      container
    );
    bindProviderToContainer(
      {
        provide: "TestServiceAlias",
        useExisting: TestClassToken,
      },
      container
    );

    expect(
      container.getTagged("TestServiceAlias", PROVIDED_TAG, true)
    ).toBeInstanceOf(TestClass);
  });
});
