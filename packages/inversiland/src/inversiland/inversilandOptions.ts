import { InversilandOptions } from "../types";

export const defaultInversilandOptions: InversilandOptions = {
  debug: false,
  defaultScope: "Transient",
  onModuleBound: undefined,
};

const inversilandOptions: InversilandOptions = Object.assign(
  {},
  defaultInversilandOptions
);

export default inversilandOptions;
