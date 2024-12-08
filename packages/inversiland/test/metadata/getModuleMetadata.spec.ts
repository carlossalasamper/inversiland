import { injectable } from "@inversiland/inversify";

import { module } from "../../src";
import { MODULE_METADATA_KEYS } from "../../src/constants";
import { getModuleMetadata } from "../../src/metadata/getModuleMetadata";

describe("getModuleMetadata", () => {
  it("Should log the correct message.", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
    })
    class TestModule {}

    const moduleMetadata = getModuleMetadata(TestModule);

    expect(moduleMetadata).toMatchObject({
      providers: [TestService],
    });

    MODULE_METADATA_KEYS.forEach((key) => {
      expect(moduleMetadata).toHaveProperty(key);
    });
  });
});
