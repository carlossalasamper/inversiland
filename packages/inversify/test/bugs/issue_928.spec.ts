import { Container, inject, injectable, optional } from "../../src";

describe("Issue 928", () => {
  it("should inject the right instances", () => {
    let injectedA: unknown;
    let injectedB: unknown;
    let injectedC: unknown;

    // some dependencies
    @injectable()
    class DepA {
      public a = 1;
    }
    @injectable()
    class DepB {
      public b = 1;
    }
    @injectable()
    class DepC {
      public c = 1;
    }

    @injectable()
    abstract class AbstractCls {
      constructor(
        @inject(DepA) a: DepA,
        @inject(DepB) @optional() b: DepB = { b: 0 }
      ) {
        injectedA = a;
        injectedB = b;
      }
    }

    @injectable()
    class Cls extends AbstractCls {
      constructor(
        @inject(DepC) c: DepC,
        @inject(DepB) @optional() b: DepB = { b: 0 },
        @inject(DepA) a: DepA
      ) {
        super(a, b);

        injectedC = c;
      }
    }

    const container: Container = new Container();
    [DepA, DepB, DepC, Cls].forEach((i: NewableFunction) =>
      container.bind(i).toSelf().inSingletonScope()
    );

    container.get(Cls);

    expect(injectedA).toEqual(new DepA());
    expect(injectedB).toEqual(new DepB());
    expect(injectedC).toEqual(new DepC());
  });
});
