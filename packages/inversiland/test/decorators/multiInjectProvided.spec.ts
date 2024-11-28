import { injectable } from "@carlossalasamper/inversify";
import {
  InversifySugar,
  getModuleContainer,
  module,
  multiInjectProvided,
} from "../../src";

@injectable()
class TestService {}

@injectable()
class TestController {
  constructor(
    @multiInjectProvided(TestService)
    public readonly testServices: TestService[]
  ) {}
}

describe("@multiInjectProvided", () => {
  beforeEach(() => {
    InversifySugar.reset();
  });

  it("Should inject all the services provided with the same identifier.", () => {
    @module({
      providers: [TestService, TestService, TestService, TestController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);

    expect(
      appModuleContainer.getProvided(TestController).testServices
    ).toHaveLength(3);
  });
});
