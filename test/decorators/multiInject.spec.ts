import { injectable } from "inversify";
import { InversifySugar, getModuleContainer, module } from "../../src";
import multiInject from "../../src/decorators/multiInject";

@injectable()
class TestService {}

@injectable()
class TestController {
  constructor(
    @multiInject(TestService) public readonly testServices: TestService[]
  ) {}
}

describe("@multiInject", () => {
  afterEach(() => {
    InversifySugar.reset();
  });

  it("Should inject all the services provided with the same identifier.", () => {
    @module({
      providers: [TestService, TestService, TestService, TestController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);
    const testServices = appModuleContainer.get(TestController).testServices;

    expect(testServices).toHaveLength(3);
  });

  it("Should inject all the services imported with the same identifier.", () => {
    @module({
      providers: [TestService, TestService, TestService],
      exports: [
        {
          provide: TestService,
          multiple: true,
        },
      ],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
      providers: [TestController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);
    const testServices = appModuleContainer.get(TestController).testServices;

    expect(testServices[0]).toBeInstanceOf(TestService);
    expect(testServices[1]).toBeInstanceOf(TestService);
    expect(testServices[2]).toBeInstanceOf(TestService);
    expect(testServices).toHaveLength(3);
  });

  it("Should inject all the services provided and imported with the same identifier.", () => {
    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
      providers: [TestService, TestService, TestController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);
    const testServices = appModuleContainer.get(TestController).testServices;

    expect(testServices).toHaveLength(3);
    expect(testServices[0]).toBeInstanceOf(TestService);
    expect(testServices[1]).toBeInstanceOf(TestService);
    expect(testServices[2]).toBeInstanceOf(TestService);
  });
});
