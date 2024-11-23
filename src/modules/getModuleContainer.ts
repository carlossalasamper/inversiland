import { Newable } from "../types";
import ModuleContainer from "./ModuleContainer";
import { getModuleMetadata } from "../metadata/getModuleMetadata";

export default function getModuleContainer(Module: Newable): ModuleContainer {
  const metadata = getModuleMetadata(Module);

  return metadata.container;
}
