import { Container, injectable } from "../../src";
import * as ERROR_MSGS from "../../src/constants/error_msgs";

describe("Error message when resolving fails", () => {
  @injectable()
  class Katana {}

  @injectable()
  class Shuriken {}

  @injectable()
  class Bokken {}

  it("Should contain correct message and the serviceIdentifier in error message", () => {
    const container: Container = new Container();

    container.bind("Weapon").to(Katana);

    const tryWeapon: () => void = () => {
      container.get("Ninja");
    };

    expect(tryWeapon).toThrow(
      `${ERROR_MSGS.NOT_REGISTERED(container.id)} Ninja`
    );
  });

  it("Should contain the provided name in error message when target is named", () => {
    const container: Container = new Container();
    const tryGetNamedWeapon: (name: string | number | symbol) => void = (
      name: string | number | symbol
    ) => {
      container.getNamed("Weapon", name);
    };

    expect(() => {
      tryGetNamedWeapon("superior");
    }).toThrow(`No matching bindings found for serviceIdentifier: Weapon
 Weapon - {"key":"named","value":"superior"}`);
    expect(() => {
      tryGetNamedWeapon(Symbol.for("Superior"));
    }).toThrow(`No matching bindings found for serviceIdentifier: Weapon
 Weapon - {"key":"named","value":"Symbol(Superior)"}`);
    expect(() => {
      tryGetNamedWeapon(0);
    }).toThrow(`No matching bindings found for serviceIdentifier: Weapon
 Weapon - {"key":"named","value":"0"}`);
  });

  it("Should contain the provided tag in error message when target is tagged", () => {
    const container: Container = new Container();
    const tryGetTaggedWeapon: (tag: string | number | symbol) => void = (
      tag: string | number | symbol
    ) => {
      container.getTagged("Weapon", tag, true);
    };

    expect(() => {
      tryGetTaggedWeapon("canShoot");
    }).toThrow(/.*\bWeapon\b.*\bcanShoot\b.*\btrue\b/g);
    expect(() => {
      tryGetTaggedWeapon(Symbol.for("Can shoot"));
    }).toThrow(/.*\bWeapon\b.*Symbol\(Can shoot\).*\btrue\b/g);
    expect(() => {
      tryGetTaggedWeapon(0);
    }).toThrow(/.*\bWeapon\b.*\b0\b.*\btrue\b/g);
  });

  it("Should list all possible bindings in error message if no matching binding found", () => {
    const container: Container = new Container();
    container.bind("Weapon").to(Katana).whenTargetNamed("strong");
    container.bind("Weapon").to(Shuriken).whenTargetTagged("canThrow", true);
    container.bind("Weapon").to(Bokken).whenTargetNamed("weak");

    try {
      container.getNamed("Weapon", "superior");
    } catch (error) {
      expect((error as Error).message).toMatch(
        /.*\bKatana\b.*\bnamed\b.*\bstrong\b/
      );
      expect((error as Error).message).toMatch(
        /.*\bBokken\b.*\bnamed\b.*\bweak\b/
      );
      expect((error as Error).message).toMatch(
        /.*\bShuriken\b.*\btagged\b.*\bcanThrow\b.*\btrue\b/
      );
    }
  });

  it("Should list all possible bindings in error message if ambiguous matching binding found", () => {
    const container: Container = new Container();
    container.bind("Weapon").to(Katana).whenTargetNamed("strong");
    container.bind("Weapon").to(Shuriken).whenTargetTagged("canThrow", true);
    container.bind("Weapon").to(Bokken).whenTargetNamed("weak");

    try {
      container.get("Weapon");
    } catch (error) {
      expect((error as Error).message).toMatch(
        /.*\bKatana\b.*\bnamed\b.*\bstrong\b/
      );
      expect((error as Error).message).toMatch(
        /.*\bBokken\b.*\bnamed\b.*\bweak\b/
      );
      expect((error as Error).message).toMatch(
        /.*\bShuriken\b.*\btagged\b.*\bcanThrow\b.*\btrue\b/
      );
    }
  });
});
