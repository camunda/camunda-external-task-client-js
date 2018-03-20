const {
  isFunction,
  andArrayWith,
  isArrayOfFunctions,
  isUndefinedOrNull,
  getVariableType,
  mapEntries,
  sanitizeTypedValue
} = require('../../lib/__internal/utils');

const { WRONG_TYPED_FORMAT, UNSUPPORTED_VARIABLE_TYPE } = require('../../lib/__internal/errors');

describe('utils', () => {
  describe('isFunction', () => {
    it('should return false if param is not a function', () => {
      expect(isFunction()).toBe(false);
      expect(isFunction(2)).toBe(false);
    });

    it('should return true if param is a function', () => {
      expect(isFunction(() => {})).toBe(true);
    });
  });

  describe('andArrayWith', () => {
    it('should apply test function on each element on the array and AND the results', () => {
      const biggerThan5 = (a) => a > 5;
      const arr1 = [1,2,3,4];
      const arr2 = [6,7,8,9];
      const arr3 = [6,7,2,8,9];

      expect(andArrayWith(arr1, biggerThan5)).toBe(false);
      expect(andArrayWith(arr2, biggerThan5)).toBe(true);
      expect(andArrayWith(arr3, biggerThan5)).toBe(false);
    });
  });

  describe('isArrayOfFunctions', () => {
    it('should return false for non array', () => {
      expect(isArrayOfFunctions(3)).toBe(false);
    });

    it('should return false for non array of functions', () => {
      expect(isArrayOfFunctions([1, 2])).toBe(false);
    });

    it('should return true for an array of functions', () => {
      expect(isArrayOfFunctions([() => {}, () => {}])).toBe(true);
    });
  });

  describe('isUndefinedOrNull', () => {
    it('should return false for non undefined or null', () => {
      expect(isUndefinedOrNull(1)).toBe(false);
      expect(isUndefinedOrNull('foo')).toBe(false);
      expect(isUndefinedOrNull([])).toBe(false);
      expect(isUndefinedOrNull(() => {})).toBe(false);
    });

    it('should return true for undefined', () => {
      expect(isUndefinedOrNull(undefined)).toBe(true);
    });

    it('should return true for null', () => {
      expect(isUndefinedOrNull(null)).toBe(true);
    });
  });

  describe('getVariableType', () => {
    test('getVariableType(null) should be null', () => {
      expect(getVariableType(null)).toBe('null');
    });

    test('getVariableType() should be null', () => {
      expect(getVariableType()).toBe('null');
    });

    test('getVariableType(1) should be integer', () => {
      expect(getVariableType(1)).toBe('integer');
    });

    test('getVariableType(2^32) should be long', () => {
      expect(getVariableType(Math.pow(2, 32))).toBe('long');
    });

    test('getVariableType(2.32) should be double', () => {
      expect(getVariableType(2.32)).toBe('double');
    });

    test('getVariableType(true) should be boolean', () => {
      expect(getVariableType(true)).toBe('boolean');
    });

    test('getVariableType(\'foo\') should be string', () => {
      expect(getVariableType('foo')).toBe('string');
    });

    test('getVariableType(new Date()) should be date', () => {
      expect(getVariableType(new Date())).toBe('date');
    });

    test('getVariableType({"x": 2}) should be json', () => {
      expect(getVariableType({ 'x': 2 })).toBe('json');
    });

    test('getVariableType({ x: 2 }) should be json', () => {
      expect(getVariableType({ x: 2 })).toBe('json');
    });
  });

  describe('mapEntries', () => {
    it('should map entries with mapper: entry -> entry × 2', () => {
      // given
      const initialObject = { a: 2, b: 3, c: 4 };
      const expectedObject = { a: 4, b: 6, c: 8 };
      const mapper = ({ key, value }) => ({ [key]: value * 2 });

      // then
      expect(mapEntries(initialObject, mapper)).toEqual(expectedObject);
    });
  });

  describe('sanitizeTypedValue', () => {
    let key, type;
    beforeAll(() => {
      key = 'some_key';
      type = 'some_unsupported_type';
    });

    it('should throw an error for undefined/null typedValue', () => {
      expect(() => sanitizeTypedValue(key, null)).toThrowError(WRONG_TYPED_FORMAT(key));
    });

    it('should throw an error for typedValue = { value: 1, type: \'integer\' }', () => {
      // given
      const typedValue = { value: 1, type: 'integer' };

      // then
      expect(() => sanitizeTypedValue(key, typedValue)).toThrowError(WRONG_TYPED_FORMAT(key));
    });

    it('should throw an error for typedValue = { a: 1, b: \'integer\' }', () => {
      // given
      const typedValue = { a: 1, b: 'integer' };

      // then
      expect(() => sanitizeTypedValue(key, typedValue)).toThrowError(WRONG_TYPED_FORMAT(key));
    });

    it('should throw an error for typedValue = { value: 1, type: \'integer\', valueInfo: null }', () => {
      // given
      const typedValue = { value: 1, type: 'integer', valueInfo: null };

      // then
      expect(() => sanitizeTypedValue(key, typedValue)).toThrowError(WRONG_TYPED_FORMAT(key));
    });

    it('should throw an error for typedValue = { value: 1, type: \'some_unsupported_type\', valueInfo: null }', () => {
      // given
      const typedValue = { value: 1, type, valueInfo: {} };

      // then
      expect(() => sanitizeTypedValue(key, typedValue)).toThrowError(UNSUPPORTED_VARIABLE_TYPE(key));
    });

    it('should return typedValue with lowercase type', () => {
      // given
      const typedValue = { value: 1, type: 'Integer', valueInfo: {} };
      const expectedTypedValue = { value: 1, type: 'integer', valueInfo: {} };

      // then
      expect(sanitizeTypedValue(key, typedValue)).toEqual(expectedTypedValue);
    });
  });
});