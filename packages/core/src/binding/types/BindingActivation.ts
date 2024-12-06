export type BindingActivation<T = unknown> = (injectable: T) => T | Promise<T>;
