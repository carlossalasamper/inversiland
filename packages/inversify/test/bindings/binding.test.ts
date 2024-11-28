import { expect } from 'chai';

import { Binding } from '../../src/bindings/binding';
import {
  BindingScopeEnum,
  BindingTypeEnum,
} from '../../src/constants/literal_types';
import * as Stubs from '../utils/stubs';

describe('Binding', () => {
  it('Should set its own properties correctly', () => {
    const fooIdentifier = 'FooInterface';
    const fooBinding: Binding<Stubs.FooInterface> =
      new Binding<Stubs.FooInterface>(
        fooIdentifier,
        BindingScopeEnum.Transient,
      );

    expect(fooBinding.serviceIdentifier).eql(fooIdentifier);
    expect(fooBinding.implementationType).eql(null);
    expect(fooBinding.cache).eql(null);
    expect(fooBinding.dynamicValue).eql(null);
    expect(fooBinding.factory).eql(null);
    expect(fooBinding.provider).eql(null);
    expect(fooBinding.onActivation).eql(null);
    expect(fooBinding.onDeactivation).eql(null);
    expect(fooBinding.container).eql(null);
    expect(fooBinding.activated).eql(false);
    expect(fooBinding.type).eql(BindingTypeEnum.Invalid);
    expect(fooBinding.scope).eql(BindingScopeEnum.Transient);
    expect(fooBinding.id).to.be.a('number');
  });
});
