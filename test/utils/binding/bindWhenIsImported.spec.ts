import { Container, injectable } from "inversify";
import { IMPORTED_TAG } from "../../../src/utils/constants";
import bindWhenIsImported from "../../../src/utils/binding/bindWhenIsImported";

@injectable()
class TestService {}

describe("bindWhenIsImported", () => {
  const container = new Container();

  afterEach(() => {
    container.unbindAll();
  });

  it("Should bind a service as a imported provider.", () => {
    bindWhenIsImported(container.bind(TestService).toSelf());

    expect(container.isBound(TestService)).toBeTruthy();
    expect(
      container.isBoundTagged(TestService, IMPORTED_TAG, true)
    ).toBeTruthy();
  });
});
