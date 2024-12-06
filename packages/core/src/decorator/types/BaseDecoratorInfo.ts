/* eslint-disable @typescript-eslint/ban-types */
export interface BaseDecoratorInfo<TKind> {
  kind: TKind;
  targetClass: Function;
}
