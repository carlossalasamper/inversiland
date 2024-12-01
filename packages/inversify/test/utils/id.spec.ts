import { id } from "../../src/utils/id";

describe("ID", () => {
  it("Should be able to generate an id", () => {
    const id1: number = id();
    expect(typeof id1).toBe("number");
  });
});
