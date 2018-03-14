const VariableService = require('../../lib/__internal/VariableService');

describe('VariableService', () => {
  let expectedVariables, expectedVariableValues, variableService;
  beforeAll(() => {
    expectedVariableValues = { foo: 'FooValue', bar: 2 };
    expectedVariables = {
      foo:  { type: 'String', value: expectedVariableValues.foo, valueInfo: {} },
      bar:  { type: 'Integer', value: expectedVariableValues.bar, valueInfo: {} }
    };
    variableService = new VariableService(expectedVariables);
  });

  it('getAllTyped() should return all variables', () => {
    expect(variableService.getAllTyped()).toEqual(expectedVariables);
  });

  it('getAll() should return all variables values', () => {
    expect(variableService.getAll()).toEqual(expectedVariableValues);
  });

  it('get(\'foo\') should return value of foo', () => {
    expect(variableService.get('foo')).toBe(expectedVariableValues.foo);
  });

  it('getTyped(\'foo\') should return full variable of foo', () => {
    expect(variableService.getTyped('foo')).toEqual(expectedVariables.foo);
  });
});