import { Container, injectable, interfaces } from "../../src";

describe("Container.prototype.resolve", () => {
  it("Should be able to resolve a class that has not binded", () => {
    @injectable()
    class Katana {
      public hit() {
        return "cut!";
      }
    }

    @injectable()
    class Ninja implements Ninja {
      public katana: Katana;
      constructor(katana: Katana) {
        this.katana = katana;
      }
      public fight() {
        return this.katana.hit();
      }
    }

    const container: Container = new Container();
    container.bind(Katana).toSelf();

    const tryGet: () => Ninja = () => container.get(Ninja);
    expect(tryGet).toThrow(
      "No matching bindings found for serviceIdentifier: Ninja"
    );

    const ninja: Ninja = container.resolve(Ninja);
    expect(ninja.fight()).toBe("cut!");
    expect(container.isBound(Ninja)).toBe(false);
  });

  it("Should be able to resolve a class that has already been bound", () => {
    @injectable()
    class Katana {
      public hit() {
        return "cut!";
      }
    }

    @injectable()
    class Ninja implements Ninja {
      public katana: Katana;
      constructor(katana: Katana) {
        this.katana = katana;
      }
      public fight() {
        return this.katana.hit();
      }
    }

    const container: Container = new Container();
    container.bind(Katana).toSelf();
    container.bind(Ninja).toSelf();

    const ninja: Ninja = container.resolve(Ninja);
    expect(ninja.fight()).toBe("cut!");
  });
  describe("Should use middleware", () => {
    interface TestMiddlewareAppliedInCorrectOrder {
      description: string;
      applyMiddleware: (
        container: interfaces.Container,
        middleware1: interfaces.Middleware,
        middleware2: interfaces.Middleware,
        middleware3: interfaces.Middleware,
        middleware4: interfaces.Middleware
      ) => void;
    }
    const middlewareOrderTests: TestMiddlewareAppliedInCorrectOrder[] = [
      {
        applyMiddleware: (
          container: interfaces.Container,
          middleware1: interfaces.Middleware,
          middleware2: interfaces.Middleware,
          middleware3: interfaces.Middleware,
          middleware4: interfaces.Middleware
        ) => {
          container.applyMiddleware(
            middleware1,
            middleware2,
            middleware3,
            middleware4
          );
        },
        description: "All at once",
      },
      {
        applyMiddleware: (
          container: interfaces.Container,
          middleware1: interfaces.Middleware,
          middleware2: interfaces.Middleware,
          middleware3: interfaces.Middleware,
          middleware4: interfaces.Middleware
        ) => {
          container.applyMiddleware(middleware1, middleware2);
          container.applyMiddleware(middleware3, middleware4);
        },
        description: "Two calls",
      },
    ];
    middlewareOrderTests.forEach((t: TestMiddlewareAppliedInCorrectOrder) => {
      testApplyMiddlewareSameOrder(t);
    });
    function testApplyMiddlewareSameOrder(
      test: TestMiddlewareAppliedInCorrectOrder
    ) {
      it(test.description, () => {
        @injectable()
        class Katana {
          public hit() {
            return "cut!";
          }
        }

        @injectable()
        class Ninja implements Ninja {
          public katana: Katana;
          constructor(katana: Katana) {
            this.katana = katana;
          }
          public fight() {
            return this.katana.hit();
          }
        }
        const middlewareOrder: number[] = [];
        const middleware1: interfaces.Middleware = (next: interfaces.Next) => {
          return (args: interfaces.NextArgs) => {
            middlewareOrder.push(1);
            return next(args);
          };
        };
        const middleware2: interfaces.Middleware = (next: interfaces.Next) => {
          return (args: interfaces.NextArgs) => {
            middlewareOrder.push(2);
            return next(args);
          };
        };
        const middleware3: interfaces.Middleware = (next: interfaces.Next) => {
          return (args: interfaces.NextArgs) => {
            middlewareOrder.push(3);
            return next(args);
          };
        };
        const middleware4: interfaces.Middleware = (next: interfaces.Next) => {
          return (args: interfaces.NextArgs) => {
            middlewareOrder.push(4);
            return next(args);
          };
        };
        const resolveContainer: Container = new Container();
        resolveContainer.bind(Katana).toSelf();
        test.applyMiddleware(
          resolveContainer,
          middleware1,
          middleware2,
          middleware3,
          middleware4
        );

        const getContainer: Container = new Container();
        getContainer.bind(Katana).toSelf();
        getContainer.bind(Ninja).toSelf();
        test.applyMiddleware(
          getContainer,
          middleware1,
          middleware2,
          middleware3,
          middleware4
        );

        resolveContainer.resolve(Ninja);
        getContainer.get(Ninja);

        expect(middlewareOrder.length).toBe(8);
        expect(middlewareOrder[0]).toBe(middlewareOrder[4]);
        expect(middlewareOrder[1]).toBe(middlewareOrder[5]);
        expect(middlewareOrder[2]).toBe(middlewareOrder[6]);
        expect(middlewareOrder[3]).toBe(middlewareOrder[7]);
      });
    }
  });
});
