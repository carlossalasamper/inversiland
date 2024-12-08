import { Container, injectable } from "@inversiland/inversify";

import { debugMiddleware } from "../../src";
import inversilandOptions from "../../src/inversiland/inversilandOptions";
import messagesMap from "../../src/messages/messagesMap";

describe("debugMiddleware", () => {
  it("Should log the correct message when logLevel = 'debug'.", () => {
    @injectable()
    class TestService {}

    inversilandOptions.logLevel = "debug";

    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const container = new Container();

    container.applyMiddleware(debugMiddleware);
    container.bind(TestService).toSelf();
    container.get(TestService);

    expect(consoleLogMock).toHaveBeenCalledWith(
      messagesMap.providerRequested(TestService, container.id)
    );
  });

  it("Should not log the message when logLevel is 'info'.", () => {
    @injectable()
    class TestService {}

    inversilandOptions.logLevel = "info";

    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const container = new Container();

    container.applyMiddleware(debugMiddleware);
    container.bind(TestService).toSelf();
    container.get(TestService);

    expect(consoleLogMock).not.toHaveBeenCalledWith(
      messagesMap.providerRequested(TestService, container.id)
    );
  });

  it("Should not log the message when logLevel is 'none'.", () => {
    @injectable()
    class TestService {}

    inversilandOptions.logLevel = "none";

    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const container = new Container();

    container.applyMiddleware(debugMiddleware);
    container.bind(TestService).toSelf();
    container.get(TestService);

    expect(consoleLogMock).not.toHaveBeenCalledWith(
      messagesMap.providerRequested(TestService, container.id)
    );
  });

  it("Should log a message for each provider resolved when logLevel is 'debug'.", () => {
    @injectable()
    class TestService1 {}

    @injectable()
    class TestService2 {}

    inversilandOptions.logLevel = "debug";

    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const container = new Container();

    container.applyMiddleware(debugMiddleware);
    container.bind(TestService1).toSelf();
    container.bind(TestService2).toSelf();
    container.get(TestService1);
    container.get(TestService2);

    expect(consoleLogMock).toHaveBeenCalledWith(
      messagesMap.providerRequested(TestService1, container.id)
    );
    expect(consoleLogMock).toHaveBeenCalledWith(
      messagesMap.providerRequested(TestService2, container.id)
    );
  });
});
