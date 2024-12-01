import { injectable } from "@inversiland/inversify";

import {
  getModuleContainer,
  injectProvided,
  Inversiland,
  module,
} from "../../src";

describe("@injectProvided", () => {
  afterAll(() => {
    Inversiland.reset();
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

    Inversiland.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);

    expect(appModuleContainer.get(TestController).testService).toBeInstanceOf(
      TestService
    );
  });
});
