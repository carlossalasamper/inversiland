/* eslint-disable @typescript-eslint/ban-types */
import { Newable } from "./Newable";

export type ServiceIdentifier<TInstance = unknown> =
  | string
  | symbol
  | Newable<TInstance>
  | Function;
