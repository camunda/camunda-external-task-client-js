const VariableService = require('../../lib/__internal/VariableService');
const { getVariableType } = require('../../lib/__internal/utils');

describe('VariableService', () => {
  let variables, expectedVariables, variableValues, expectedVariableValues, variableService;
  beforeEach(() => {
    variableValues = { foo: 'FooValue', bar: 2, baz: '{"name":"baz"}' };
    expectedVariableValues = { ...variableValues, baz: { name: 'baz' } };

    variables = {
      foo:  { type: 'string', value: variableValues.foo, valueInfo: {} },
      bar:  { type: 'integer', value: variableValues.bar, valueInfo: {} },
      baz: { type: 'json', value: variableValues.baz, valueInfo: {} }
    };

    expectedVariables = {
      ...variables,
      baz: { ...variables.baz, value: expectedVariableValues.baz }
    };

    variableService = new VariableService(variables);
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

    it('getTyped(\'non_existing_key\') should return null', () => {
      expect(variableService.getTyped('non_existing_key')).toBe(null);
    });

    it('getTyped(\'foo\') should return the typed value of key foo', () => {
      expect(variableService.getTyped('foo')).toEqual(expectedVariables.foo);
    });
  });

  describe('setters', () => {
    it('setTyped(key,typedValue) should set typed value of dirty variable with key to typedValue', () => {
      // given
      const key = 'baz';

      // when
      variableService.setTyped(key, expectedVariables[key]);

      // then
      expect(variableService.getTyped(key)).toEqual(expectedVariables[key]);
      expect(variableService.getDirtyVariables()[key]).toEqual(variables[key]);
    });

    it('setAllTyped(typedValues) should merge dirty variables with typedValues', () => {
      // given
      const typedValues = {
        foo: { value: 'fooValue', type: 'string', valueInfo: {} }
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
        foo: { value: 'fooValue', type: 'string', valueInfo: {} }
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