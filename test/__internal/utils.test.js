const {
  isFunction,
  andArrayWith,
  isArrayOfFunctions,
  isUndefinedOrNull,
  getVariableType,
  mapEntries
} = require('../../lib/__internal/utils');

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
    test('getVariableType(null) should be Null', () => {
      expect(getVariableType(null)).toBe('Null');
    });

    test('getVariableType() should be Null', () => {
      expect(getVariableType()).toBe('Null');
    });

    test('getVariableType(1) should be Integer', () => {
      expect(getVariableType(1)).toBe('Integer');
    });

    test('getVariableType(2^32) should be Long', () => {
      expect(getVariableType(Math.pow(2, 32))).toBe('Long');
    });

    test('getVariableType(2.32) should be Double', () => {
      expect(getVariableType(2.32)).toBe('Double');
    });

    test('getVariableType(true) should be Boolean', () => {
      expect(getVariableType(true)).toBe('Boolean');
    });

    test('getVariableType(\'foo\') should be String', () => {
      expect(getVariableType('foo')).toBe('String');
    });

    test('getVariableType({"x": 2}) should be Json', () => {
      expect(getVariableType({ 'x': 2 })).toBe('Json');
    });

    test('getVariableType({ x: 2 }) should be Json', () => {
      expect(getVariableType({ x: 2 })).toBe('Json');
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
});