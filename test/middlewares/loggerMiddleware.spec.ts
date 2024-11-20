import { Container, injectable } from "inversify";
import { InversifySugar, loggerMiddleware } from "../../src";
import messagesMap from "../../src/utils/messages/messagesMap";

describe("loggerMiddleware", () => {
  beforeAll(async () => {
    await InversifySugar.reset();
    InversifySugar.options.debug = true;
  });

  it("Should log the correct message.", () => {
    @injectable()
    class TestService {}

    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const container = new Container();

    container.applyMiddleware(loggerMiddleware);
    container.bind(TestService).toSelf();
    container.get(TestService);

    expect(consoleLogMock).toBeCalledWith(
      messagesMap.resolveProvider(TestService, container.id)
    );
  });
});
