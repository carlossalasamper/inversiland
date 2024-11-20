import { InversifySugarOptions } from "../types";

export const defaultInversifySugarOptions: InversifySugarOptions = {
  debug: false,
  defaultScope: "Transient",
  onModuleBinded: undefined,
};

const inversifySugarOptions: InversifySugarOptions = Object.assign(
  {},
  defaultInversifySugarOptions
);

export default inversifySugarOptions;
