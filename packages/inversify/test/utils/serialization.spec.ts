import {
  ClassElementMetadataKind,
  LegacyTargetImpl as TargetImpl,
} from "@inversiland/core";

import { TargetTypeEnum } from "../../src/constants/literal_types";
import {
  getFunctionName,
  getServiceIdentifierAsString,
  getSymbolDescription,
  listMetadataForTarget,
} from "../../src/utils/serialization";

describe("serialization", () => {
  it("Should return identifier as string with the correct format.", () => {
    const classServiceIdentifier = class Foo {};
    const serviceIdentifier = "StringServiceIdentifier";
    const symbolServiceIdentifier = Symbol("SymbolServiceIdentifier");

    expect(getServiceIdentifierAsString(classServiceIdentifier)).toBe(
      classServiceIdentifier.name
    );
    expect(getServiceIdentifierAsString(serviceIdentifier)).toBe(
      serviceIdentifier
    );
    expect(getServiceIdentifierAsString(symbolServiceIdentifier)).toBe(
      symbolServiceIdentifier.toString()
    );
  });

  it("Should return a good function name", () => {
    function testFunction() {
      return false;
    }

    expect(getFunctionName(testFunction)).toBe("testFunction");
  });

  it("Should return a good function name by using the regex", () => {
    const testFunction: {
      name: null;
    } = { name: null };
    testFunction.toString = () => "function testFunction";

    expect(getFunctionName(testFunction)).toBe("testFunction");
  });

  it("Should not fail when target is not named or tagged", () => {
    const serviceIdentifier = "SomeTypeId";

    const target: TargetImpl = new TargetImpl(
      "",
      {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: serviceIdentifier,
      },
      TargetTypeEnum.Variable
    );

    const list: string = listMetadataForTarget(serviceIdentifier, target);
    expect(list).toBe(` ${serviceIdentifier}`);
  });

  it("Should extract symbol description", () => {
    const symbolWithDescription = Symbol("description");
    expect(getSymbolDescription(symbolWithDescription)).toBe("description");

    const symbolWithoutDescription = Symbol();
    expect(getSymbolDescription(symbolWithoutDescription)).toBe("");
  });
});
