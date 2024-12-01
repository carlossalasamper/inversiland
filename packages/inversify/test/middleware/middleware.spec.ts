import * as sinon from "sinon";

import { interfaces } from "../../src";
import { injectable } from "../../src/annotation/injectable";
import * as ERROR_MSGS from "../../src/constants/error_msgs";
import { Container } from "../../src/container/container";

describe("Middleware", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Should be able to use middleware as Container configuration", () => {
    const container: Container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware1: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    container.applyMiddleware(middleware1);

    expect(
      (container as unknown as { _middleware: unknown })._middleware
    ).not.toBeNull();
  });

  it("Should support middleware", () => {
    @injectable()
    class Ninja {}

    const container: Container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware1: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    function middleware2(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware2: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    // two middlewares applied at one single point in time
    container.applyMiddleware(middleware1, middleware2);

    container.bind<Ninja>("Ninja").to(Ninja);

    const ninja: Ninja = container.get("Ninja");

    expect(ninja instanceof Ninja).toBe(true);
    expect(log.length).toBe(2);
    expect(log[0]).toBe("Middleware2: Ninja");
    expect(log[1]).toBe("Middleware1: Ninja");
  });

  it("Should allow applyMiddleware at multiple points in time", () => {
    @injectable()
    class Ninja {}

    const container: Container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware1: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    function middleware2(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware2: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    container.applyMiddleware(middleware1); // one point in time
    container.applyMiddleware(middleware2); // another point in time
    container.bind<Ninja>("Ninja").to(Ninja);

    const ninja: Ninja = container.get("Ninja");

    expect(ninja instanceof Ninja).toBe(true);
    expect(log.length).toBe(2);
    expect(log[0]).toBe("Middleware2: Ninja");
    expect(log[1]).toBe("Middleware1: Ninja");
  });

  it("Should use middleware", () => {
    @injectable()
    class Ninja {}

    const container: Container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware1: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    function middleware2(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware2: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    container.applyMiddleware(middleware1, middleware2);
    container.bind<Ninja>("Ninja").to(Ninja);

    const ninja: Ninja = container.get("Ninja");

    expect(ninja instanceof Ninja).toBe(true);
    expect(log.length).toBe(2);
    expect(log[0]).toBe("Middleware2: Ninja");
    expect(log[1]).toBe("Middleware1: Ninja");
  });

  it("Should be able to use middleware to catch errors during pre-planning phase", () => {
    @injectable()
    class Ninja implements Ninja {}

    const container: Container = new Container();

    const log: string[] = [];

    function middleware(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        try {
          return planAndResolve(args);
        } catch (e) {
          log.push((e as Error).message);
          return [];
        }
      };
    }

    container.applyMiddleware(middleware);
    container.bind<Ninja>("Ninja").to(Ninja);
    container.get("SOME_NOT_REGISTERED_ID");
    expect(log.length).toBe(1);
    expect(log[0]).toBe(
      `${ERROR_MSGS.NOT_REGISTERED(container.id)} SOME_NOT_REGISTERED_ID`
    );
  });

  it("Should be able to use middleware to catch errors during planning phase", () => {
    @injectable()
    class Ninja {}

    @injectable()
    class Samurai {}

    const container: Container = new Container();

    const log: string[] = [];

    function middleware(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        try {
          return planAndResolve(args);
        } catch (e) {
          log.push((e as Error).message);
          return [];
        }
      };
    }

    container.applyMiddleware(middleware);
    container.bind("Warrior").to(Ninja);
    container.bind("Warrior").to(Samurai);

    container.get("Warrior");
    expect(log.length).toBe(1);
    expect(log[0]).toContain(
      `${ERROR_MSGS.AMBIGUOUS_MATCH(container.id)} Warrior`
    );
  });

  it("Should be able to use middleware to catch errors during resolution phase", () => {
    const container: Container = new Container();

    const log: string[] = [];

    function middleware(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        try {
          return planAndResolve(args);
        } catch (e) {
          log.push((e as Error).message);
          return [];
        }
      };
    }

    container.applyMiddleware(middleware);
    container.bind("Warrior"); // Invalid binding missing BindingToSyntax

    container.get("Warrior");
    expect(log.length).toBe(1);
    expect(log[0]).toBe(`${ERROR_MSGS.INVALID_BINDING_TYPE} Warrior`);
  });

  it("Should help users to identify problems with middleware", () => {
    const container: Container = new Container();

    function middleware(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        try {
          return planAndResolve(args);
        } catch (_e: unknown) {
          return undefined as unknown as (_: interfaces.NextArgs) => undefined;
        }
      };
    }

    container.applyMiddleware(middleware);
    const throws: () => void = () => {
      container.get("SOME_NOT_REGISTERED_ID");
    };
    expect(throws).toThrow(ERROR_MSGS.INVALID_MIDDLEWARE_RETURN);
  });

  it("Should allow users to intercept a resolution context", () => {
    @injectable()
    class Ninja {}

    const container: Container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        const nextContextInterceptor: (
          contexts: interfaces.Context
        ) => interfaces.Context = args.contextInterceptor;
        args.contextInterceptor = (context: interfaces.Context) => {
          log.push(`contextInterceptor1: ${args.serviceIdentifier.toString()}`);

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          return nextContextInterceptor !== null
            ? nextContextInterceptor(context)
            : context;
        };
        return planAndResolve(args);
      };
    }

    function middleware2(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        const nextContextInterceptor: (
          contexts: interfaces.Context
        ) => interfaces.Context = args.contextInterceptor;
        args.contextInterceptor = (context: interfaces.Context) => {
          log.push(`contextInterceptor2: ${args.serviceIdentifier.toString()}`);
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          return nextContextInterceptor !== null
            ? nextContextInterceptor(context)
            : context;
        };
        return planAndResolve(args);
      };
    }

    container.applyMiddleware(middleware1, middleware2);
    container.bind<Ninja>("Ninja").to(Ninja);

    const ninja: Ninja = container.get("Ninja");

    expect(ninja instanceof Ninja).toBe(true);
    expect(log.length).toBe(2);
    expect(log[0]).toBe("contextInterceptor1: Ninja");
    expect(log[1]).toBe("contextInterceptor2: Ninja");
  });
});
