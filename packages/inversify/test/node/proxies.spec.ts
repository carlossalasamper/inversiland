import { Container, inject, injectable } from "../../src";
import { interfaces } from "../../src";

describe("InversifyJS", () => {
  it("Should support the injection of proxied objects", () => {
    const weaponId = "Weapon";
    const warriorId = "Warrior";

    interface Weapon {
      use(): void;
    }

    @injectable()
    class Katana implements Weapon {
      public use() {
        return "Used Katana!";
      }
    }

    interface Warrior {
      weapon: Weapon;
    }

    @injectable()
    class Ninja implements Warrior {
      public weapon: Weapon;
      constructor(@inject(weaponId) weapon: Weapon) {
        this.weapon = weapon;
      }
    }

    const container: Container = new Container();
    container.bind<Warrior>(warriorId).to(Ninja);
    const log: string[] = [];

    container
      .bind<Weapon>(weaponId)
      .to(Katana)
      .onActivation((_context: interfaces.Context, weapon: Weapon) => {
        const handler: ProxyHandler<() => void> = {
          apply(
            target: () => void,
            thisArgument: unknown,
            argumentsList: []
          ): void {
            log.push(`Starting: ${new Date().getTime().toString()}`);
            target.apply(thisArgument, argumentsList);
            log.push(`Finished: ${new Date().getTime().toString()}`);
          },
        };
        weapon.use = new Proxy(weapon.use, handler);
        return weapon;
      });

    const ninja: Warrior = container.get(warriorId);
    ninja.weapon.use();

    expect(log.length).toBe(2);
    expect(log[0]?.indexOf("Starting: ")).not.toBe(-1);
    expect(log[1]?.indexOf("Finished: ")).not.toBe(-1);
  });
});
