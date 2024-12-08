import { injectable } from "@inversiland/inversify";

import { getModuleContainer, module } from "../../src";
import { bindProviderToModule } from "../../src/binding/bindProviderToModule";
import {
  AsyncFactoryProvider,
  ClassProvider,
  FactoryProvider,
  NewableProvider,
  ValueProvider,
} from "../../src/types/Provider";

const TestClassToken = Symbol();

@injectable()
class TestClass {}

@module({})
class TestModule {}

describe("bindProviderToModule", () => {
  beforeEach(async () => {
    await getModuleContainer(TestModule).unbindAllAsync();
  });

  it("Should bind a NewableProvider.", () => {
    const provider: NewableProvider = TestClass;

    @module({})
    class TestModule {}

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isProvided(TestClass)).toBe(true);
  });

  it("Should bind a ClassProvider without provide.", () => {
    const provider: ClassProvider = { useClass: TestClass };

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isProvided(TestClass)).toBe(true);
  });

  it("Should bind a ClassProvider with provide.", () => {
    const provider: ClassProvider = {
      provide: TestClassToken,
      useClass: TestClass,
    };

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isProvided(TestClassToken)).toBe(true);
  });

  it("Should bind a ValueProvider.", () => {
    const provider: ValueProvider = {
      provide: TestClassToken,
      useValue: new TestClass(),
    };

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isProvided(TestClassToken)).toBe(true);
  });

  it("Should bind a FactoryProvider.", () => {
    const provider: FactoryProvider = {
      provide: TestClassToken,
      useFactory: () => () => new TestClass(),
    };

    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isProvided(TestClassToken)).toBe(true);
  });

  it("Should bind a AsyncFactoryProvider.", () => {
    const provider: AsyncFactoryProvider = {
      provide: TestClassToken,
      useAsyncFactory: () => async () => new TestClass(),
    };
    bindProviderToModule(provider, TestModule);

    const container = getModuleContainer(TestModule);

    expect(container.isProvided(TestClassToken)).toBe(true);
    expect(
      container.getProvided<() => Promise<TestClass>>(TestClassToken)()
    ).resolves.toBeInstanceOf(TestClass);
  });
});
