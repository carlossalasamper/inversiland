import createRollupConfig from "../../scripts/createRollupConfig.mjs";
import packageJson from "./package.json" with { type: "json" };

export default createRollupConfig(packageJson);
