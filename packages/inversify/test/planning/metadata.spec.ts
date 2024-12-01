import { Metadata } from "../../src/planning/metadata";

describe("Metadata", () => {
  it("Should set its own properties correctly", () => {
    const m: Metadata = new Metadata("power", 5);
    expect(m.key).toBe("power");
    expect(m.value).toBe(5);
  });
});
