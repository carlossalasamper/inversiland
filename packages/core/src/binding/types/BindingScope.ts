export type BindingScope = 'Singleton' | 'Transient' | 'Request';

export const bindingScopeValues: { [TKey in BindingScope]: TKey } = {
  Request: 'Request',
  Singleton: 'Singleton',
  Transient: 'Transient',
};
