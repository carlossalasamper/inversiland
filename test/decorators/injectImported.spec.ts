import { injectable } from "inversify";
import {
  InversifySugar,
  getModuleContainer,
  injectImported,
  module,
} from "../../src";

describe("@injectImported", () => {
  afterAll(() => {
    InversifySugar.reset();
  });

  it("Should resolve a imported provider injected into another provider", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class TestModule {}

    @injectable()
    class AppController {
      constructor(
        @injectImported(TestService) public readonly testService: TestService
      ) {}
    }

    @module({
      imports: [TestModule],
      providers: [AppController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);

    expect(appModuleContainer.get(AppController).testService).toBeInstanceOf(
      TestService
    );
  });
});
