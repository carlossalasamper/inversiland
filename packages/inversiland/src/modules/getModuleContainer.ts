import { getModuleMetadata } from "../metadata/getModuleMetadata";
import { Newable } from "../types";
import ModuleContainer from "./ModuleContainer";

export default function getModuleContainer(Module: Newable): ModuleContainer {
  const metadata = getModuleMetadata(Module);

  return metadata.container;
}
