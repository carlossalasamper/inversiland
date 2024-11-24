import { InversifySugarOptions } from "../types";

export const defaultInversifySugarOptions: InversifySugarOptions = {
  debug: false,
  defaultScope: "Transient",
  onModuleBound: undefined,
};

const inversifySugarOptions: InversifySugarOptions = Object.assign(
  {},
  defaultInversifySugarOptions
);

export default inversifySugarOptions;
