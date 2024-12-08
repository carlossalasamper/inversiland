export type BindingType =
  | 'ConstantValue'
  | 'DynamicValue'
  | 'Factory'
  | 'Instance'
  | 'Provider'
  | 'ServiceRedirection';

export const bindingTypeValues: { [TKey in BindingType]: TKey } = {
  ConstantValue: 'ConstantValue',
  DynamicValue: 'DynamicValue',
  Factory: 'Factory',
  Instance: 'Instance',
  Provider: 'Provider',
  ServiceRedirection: 'ServiceRedirection',
};
