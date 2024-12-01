/* eslint-disable @typescript-eslint/no-explicit-any */

import { SCOPE_KEYS } from "../constants";

const isValidScope = (data: any) => {
  return SCOPE_KEYS.includes(data);
};

export default isValidScope;
