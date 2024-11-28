import { DynamicModule } from "../types";

export default function getDynamicModuleName(
  dynamicModule: DynamicModule
): string {
  return `DynamicModule(${dynamicModule.module.name})`;
}
