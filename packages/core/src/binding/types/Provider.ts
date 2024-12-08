// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider<TActivated, in TArgs extends unknown[] = any[]> = (
  ...args: TArgs[]
) => Promise<TActivated>;
