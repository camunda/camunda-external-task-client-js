const VariableService = require('../../lib/__internal/VariableService');
const { getVariableType } = require('../../lib/__internal/utils');

describe('VariableService', () => {
  let expectedVariables, expectedVariableValues, variableService;
  beforeEach(() => {
    expectedVariableValues = { foo: 'FooValue', bar: 2 };
    expectedVariables = {
      foo:  { type: 'String', value: expectedVariableValues.foo, valueInfo: {} },
      bar:  { type: 'Integer', value: expectedVariableValues.bar, valueInfo: {} }
    };
    variableService = new VariableService(expectedVariables);
  });

  describe('getters', () => {
    it('getAllTyped() should return all variables', () => {
      expect(variableService.getAllTyped()).toEqual(expectedVariables);
    });

    it('getAll() should return values of all variables', () => {
      expect(variableService.getAll()).toEqual(expectedVariableValues);
    });

    it('get(\'foo\') should return value of key foo', () => {
      expect(variableService.get('foo')).toBe(expectedVariableValues.foo);
    });

    it('getTyped(\'foo\') should return the typed value of key foo', () => {
      expect(variableService.getTyped('foo')).toEqual(expectedVariables.foo);
    });
  });

  describe('setters', () => {
    it('setTyped(key,typedValue) should set typed value of dirty variable with key to typedValue', () => {
      // given
      const key = 'foo', typedValue = { value: 'fooValue', type: 'String', valueInfo: {} };
      // when
      variableService.setTyped(key, typedValue);

      // then
      expect(variableService.getTyped(key)).toEqual(typedValue);
      expect(variableService.getDirtyVariables()[key]).toEqual(typedValue);
    });

    it('setAllTyped(typedValues) should merge dirty variables with typedValues', () => {
      // given
      const typedValues = {
        foo: { value: 'fooValue', type: 'String', valueInfo: {} }
      };
      variableService.set('bar', 'barValue');

      // when
      variableService.setAllTyped(typedValues);

      // then
      expect(variableService.getDirtyVariables()).toMatchObject(typedValues);
      expect(variableService.getAllTyped()).toMatchObject(typedValues);
    });

    it('set(key, value) should set value of dirty variable with key to typed value', () => {
      // given
      const expectedValue = 'fooValue';
      const expectedType = getVariableType(expectedValue);
      const expectedTypedValue = { value: expectedValue, type: expectedType, valueInfo: {} };

      // when
      variableService.set('foo', expectedValue);

      // then
      expect(variableService.getTyped('foo')).toEqual(expectedTypedValue);
    });

    it('setAll(values) should merge dirty variables with values', () => {
      // given
      const newValues = {
        foo: 'fooValue'
      };
      const expectedTypedValue = {
        foo: { value: 'fooValue', type: 'String', valueInfo: {} }
      };

      variableService.set('bar', 'barValue');

      // when
      variableService.setAll(newValues);

      // then
      expect(variableService.getDirtyVariables()).toMatchObject(expectedTypedValue);
      expect(variableService.getAllTyped()).toMatchObject(expectedTypedValue);
    });
  });
});