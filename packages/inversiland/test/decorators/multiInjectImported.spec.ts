import { injectable } from "@inversiland/inversify";

import {
  getModuleContainer,
  Inversiland,
  module,
  multiInjectImported,
} from "../../src";

describe("@multiInjectImported", () => {
  afterAll(() => {
    Inversiland.reset();
  });

  it("Should resolve a multiple imported provider injected into another provider", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService, TestService, TestService],
      exports: [
        {
          provide: TestService,
        },
      ],
    })
    class TestModule {}

    @injectable()
    class AppController {
      constructor(
        @multiInjectImported(TestService)
        public readonly testServices: TestService[]
      ) {}
    }

    @module({
      imports: [TestModule],
      providers: [AppController],
    })
    class AppModule {}

    Inversiland.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);
    const testServices = appModuleContainer.get(AppController).testServices;

    expect(testServices).toHaveLength(3);
  });
});
