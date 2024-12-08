/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "@inversiland/inversify";

export type Factory<
  ParametersType extends any[] = any[],
  ReturnType = unknown
> = (...args: ParametersType) => ReturnType;

export type AsyncFactory<
  ParametersType extends any[] = any[],
  ReturnType = unknown
> = (...args: ParametersType) => Promise<ReturnType>;

export type FactoryWrapper<FactoryType extends Factory> = (
  context: interfaces.Context
) => FactoryType;

export type AsyncFactoryWrapper<AsyncFactoryType extends AsyncFactory> = (
  context: interfaces.Context
) => AsyncFactoryType;
