import { injectable } from "inversify";
import {
  InversifySugar,
  getModuleContainer,
  multiInjectImported,
  module,
} from "../../src";

describe("@multiInjectImported", () => {
  afterAll(() => {
    InversifySugar.reset();
  });

  it("Should resolve a multiple imported provider injected into another provider", () => {
    @injectable()
    class TestService {}

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

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);
    const testServices = appModuleContainer.get(AppController).testServices;

    expect(testServices).toHaveLength(3);
  });
});
