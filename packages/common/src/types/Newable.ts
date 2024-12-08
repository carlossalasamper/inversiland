/* eslint-disable @typescript-eslint/no-explicit-any */
export type Newable<
  TInstance = unknown,
  TArgs extends unknown[] = any[]
> = new (...args: TArgs) => TInstance;
