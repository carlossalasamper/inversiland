import { InversilandOptions } from "../types";

export const defaultInversilandOptions: InversilandOptions = {
  defaultScope: "Transient",
  logLevel: "info",
  onModuleBound: undefined,
};

const inversilandOptions: InversilandOptions = Object.assign(
  {},
  defaultInversilandOptions
);

export default inversilandOptions;
