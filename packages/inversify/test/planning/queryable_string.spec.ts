import { QueryableString } from "../../src/planning/queryable_string";

describe("QueryableString", () => {
  it("Should be able to set its own properties", () => {
    const queryableString: QueryableString = new QueryableString("some_text");
    expect(queryableString.value()).toBe("some_text");
  });

  it("Should be able to return its value", () => {
    const queryableString: QueryableString = new QueryableString("some_text");
    expect(queryableString.value()).toBe("some_text");
    expect(queryableString.value() === "some_other_text").toBe(false);
  });

  it('Should be able to identify if it"s value starts with certain text', () => {
    const queryableString: QueryableString = new QueryableString("some_text");
    expect(queryableString.startsWith("some")).toBe(true);
    expect(queryableString.startsWith("s")).toBe(true);
    expect(queryableString.startsWith("me")).toBe(false);
    expect(queryableString.startsWith("_text")).toBe(false);
  });

  it('Should be able to identify if it"s value ends with certain text', () => {
    const queryableString: QueryableString = new QueryableString("some_text");
    expect(queryableString.endsWith("_text")).toBe(true);
    expect(queryableString.endsWith("ext")).toBe(true);
    expect(queryableString.endsWith("_tex")).toBe(false);
    expect(queryableString.endsWith("some")).toBe(false);
  });

  it('Should be able to identify if it"s value is equals to certain text', () => {
    const queryableString: QueryableString = new QueryableString("some_text");
    expect(queryableString.equals("some_text")).toBe(true);
    expect(queryableString.contains("some_text ")).toBe(false);
    expect(queryableString.contains("som_text")).toBe(false);
  });
});
