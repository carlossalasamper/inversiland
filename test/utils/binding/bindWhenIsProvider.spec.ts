import { Container, injectable } from "inversify";
import bindWhenIsProvider from "../../../src/utils/binding/bindWhenIsProvider";
import { PROVIDED_TAG } from "../../../src/utils/constants";

@injectable()
class TestService {}

describe("bindWhenIsProvider", () => {
  const container = new Container();

  afterEach(() => {
    container.unbindAll();
  });

  it("Should bind a service as a provider.", () => {
    bindWhenIsProvider(container.bind(TestService).toSelf());

    expect(container.isBound(TestService)).toBeTruthy();
    expect(
      container.isBoundTagged(TestService, PROVIDED_TAG, true)
    ).toBeTruthy();
  });
});
