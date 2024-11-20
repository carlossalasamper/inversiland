import { injectable } from "inversify";
import {
  InversifySugar,
  getModuleContainer,
  module,
  injectProvided,
} from "../../src";

describe("@injectProvided", () => {
  afterAll(() => {
    InversifySugar.reset();
  });

  it("Should resolve a module provider injected into another provider", () => {
    @injectable()
    class TestService {}

    @injectable()
    class TestController {
      constructor(
        @injectProvided(TestService) public readonly testService: TestService
      ) {}
    }

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
});
