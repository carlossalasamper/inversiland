export function isPromise<T>(object: unknown): object is Promise<T> {
  const isObjectOrFunction: boolean =
    (typeof object === 'object' && object !== null) ||
    typeof object === 'function';

  return (
    isObjectOrFunction && typeof (object as PromiseLike<T>).then === 'function'
  );
}
