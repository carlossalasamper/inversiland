import { Container } from "../../src";

describe("Issue 1518", () => {
  it("should not throw on deactivating undefined singleton values", () => {
    const container: Container = new Container();
    const symbol: symbol = Symbol.for("foo");

    container.bind(symbol).toConstantValue(undefined);

    const value = container.get(symbol);

    expect(value).toBeUndefined();
    expect(() => container.unbindAll()).not.toThrow();
  });
});
