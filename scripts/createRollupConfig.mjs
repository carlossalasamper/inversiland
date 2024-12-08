import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
const defaultOptions = {
  sourcemap: false,
};

/**
 * @param {{
 *    name: string,
 *    main: string,
 *    module: string,
 *    browser: string,
 *    types: string,
 * }} packageJson
 * @param {{
 *   sourcemap?: boolean
 * }} options
 * @returns {import("rollup").MergedRollupOptions[]}
 * */
export default function createRollupConfig(
  packageJson,
  { sourcemap } = defaultOptions
) {
  return [
    {
      input: "src/index.ts",
      output: [
        {
          file: packageJson.main,
          format: "cjs",
          sourcemap,
        },
        {
          file: packageJson.module,
          format: "esm",
          sourcemap,
        },
        {
          file: packageJson.browser,
          format: "umd",
          name: packageJson.name,
          sourcemap,
        },
      ],
      plugins: [
        resolve(), // Resolve Node.js modules
        typescript({
          tsconfig: "tsconfig.build.json",
        }), // Transpile TypeScript to JavaScript
        terser(), // Minify JavaScript,
      ],
    },
    {
      input: "src/index.ts",
      output: [{ file: "dist/index.d.ts", format: "es" }],
      plugins: [
        dts({
          tsconfig: "tsconfig.build.json",
        }),
      ],
    },
  ];
}
