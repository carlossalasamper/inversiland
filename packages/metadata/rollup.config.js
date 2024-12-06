import createRollupConfig from "../../scripts/createRollupConfig.js";
import packageJson from "./package.json" with { type: "json" };

export default createRollupConfig(packageJson);
