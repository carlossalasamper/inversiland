import { injectable } from "inversify";
import { InversifySugar, getModuleContainer, module } from "../../src";
import inject from "../../src/decorators/inject";

@injectable()
class TestService {}

@injectable()
class TestController {
  constructor(@inject(TestService) public readonly testService: TestService) {}
}

describe("@inject", () => {
  afterEach(() => {
    InversifySugar.reset();
  });

  it("Should resolve a module provider injected into another provider.", () => {
    @module({
      providers: [TestService, TestController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);

    expect(appModuleContainer.get(TestController).testService).toBeInstanceOf(
      TestService
    );
  });

  it("Should resolve a imported provider injected into another provider.", () => {
    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
      providers: [TestController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);

    expect(appModuleContainer.get(TestController).testService).toBeInstanceOf(
      TestService
    );
  });

  it("Should throw an ambiguity exception if a ServiceIdentifier is provided more than once.", () => {
    @module({
      providers: [TestService, TestService, TestController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);

    expect(() => appModuleContainer.get(TestController)).toThrow();
  });

  it("Should throw an ambiguity exception if a ServiceIdentifier is provided and imported.", () => {
    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
      providers: [TestService, TestController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);

    expect(() => appModuleContainer.get(TestController)).toThrow();
  });
});
