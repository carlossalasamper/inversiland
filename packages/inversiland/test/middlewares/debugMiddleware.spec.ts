import { Container, injectable } from "@carlossalasamper/inversify";

import { debugMiddleware } from "../../src";
import inversifySugarOptions from "../../src/inversifySugar/inversifySugarOptions";
import messagesMap from "../../src/messages/messagesMap";

describe("debugMiddleware", () => {
  it("Should log the correct message.", () => {
    @injectable()
    class TestService {}

    inversifySugarOptions.debug = true;

    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const container = new Container();

    container.applyMiddleware(debugMiddleware);
    container.bind(TestService).toSelf();
    container.get(TestService);

    expect(consoleLogMock).toBeCalledWith(
      messagesMap.providerRequested(TestService, container.id)
    );
  });

  it("Should not log the message when debug is false.", () => {
    @injectable()
    class TestService {}

    inversifySugarOptions.debug = false;

    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const container = new Container();

    container.applyMiddleware(debugMiddleware);
    container.bind(TestService).toSelf();
    container.get(TestService);

    expect(consoleLogMock).not.toBeCalledWith(
      messagesMap.providerRequested(TestService, container.id)
    );
  });

  it("Should log a message for each provider resolved.", () => {
    @injectable()
    class TestService1 {}

    @injectable()
    class TestService2 {}

    inversifySugarOptions.debug = true;

    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const container = new Container();

    container.applyMiddleware(debugMiddleware);
    container.bind(TestService1).toSelf();
    container.bind(TestService2).toSelf();
    container.get(TestService1);
    container.get(TestService2);

    expect(consoleLogMock).toBeCalledWith(
      messagesMap.providerRequested(TestService1, container.id)
    );
    expect(consoleLogMock).toBeCalledWith(
      messagesMap.providerRequested(TestService2, container.id)
    );
  });
});
