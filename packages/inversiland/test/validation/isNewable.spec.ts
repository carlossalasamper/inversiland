import isNewable from "../../src/validation/isNewable";

describe("isNewable", () => {
  it("Should return true if the object is a Newable.", () => {
    const newables = [
      class {},
      class {
        public readonly arg: string;
        constructor(arg: string) {
          this.arg = arg;
        }
      },
    ];

    for (const obj of newables) {
      expect(isNewable(obj)).toBe(true);
    }
  });

  it("Should return false if the object is not a Newable.", () => {
    const notNewable: unknown[] = [[class A {}], undefined, null, 0, "", true];

    for (const obj of notNewable) {
      expect(isNewable(obj)).toBe(false);
    }
  });
});
