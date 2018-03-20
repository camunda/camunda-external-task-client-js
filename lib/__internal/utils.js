const { WRONG_TYPED_FORMAT, UNSUPPORTED_VARIABLE_TYPE } = require('./errors');

/**
 * Checks if parameter is a function
 */
const isFunction = (f) => typeof f === 'function';

/**
 * Applies test function on each element on the array and ANDs the results
 * @param [Array] arr
 * @param [Function] test
 */
const andArrayWith = (arr, test) => (
  arr.reduce((boolean, current) => (
    boolean && test(current)
  ), true)
);

/**
 * Checks if parameter is an array of functions
 */
const isArrayOfFunctions = (a) => Array.isArray(a) && a.length > 0 && andArrayWith(a, isFunction);

/**
 * Checks if parameter is undefined or null
 */
const isUndefinedOrNull = a => typeof a === 'undefined' || a === null;

const typeMatchers = {
  Null: isUndefinedOrNull,

  /**
   * @returns {boolean} true if value is Integer
   */
  Integer(a) {
    return Number.isInteger(a) &&
      a >= -Math.pow(2, 31) &&
      a <= Math.pow(2, 31) - 1;
  },

  /**
   * @returns {boolean} true if value is Long
   */
  Long(a) {
    return Number.isInteger(a) &&
      !typeMatchers.Integer(a);
  },

  /**
   * @returns {boolean} true if value is Double
   */
  Double(a) {
    return typeof a === 'number' &&
      !Number.isInteger(a);
  },

  /**
   * @returns {boolean} true if value is Boolean
   */
  Boolean(a) {
    return typeof a === 'boolean';
  },

  /**
   * @returns {boolean} true if value is String
   */
  String(a) {
    return typeof a === 'string';
  },

  /**
   * @returns {boolean} true if value is Date
   */
  Date(a) {
    return a instanceof Date;
  },

  /**
   * @returns {boolean} true if value is JSON
   */
  Json(a) {
    return typeof a === 'object';
  }
};

/**
 * @returns the type of the variable
 * @param variable: external task variable
 */
const getVariableType = (variable) => {
  const match = Object.entries(typeMatchers)
    .filter(([matcherKey, matcherFunction]) => matcherFunction(variable))[0];

  return match[0].toLowerCase();
};

const SUPPORTED_VARIABLE_TYPES = [
  'boolean',
  'bytes',
  'short',
  'integer',
  'long',
  'double',
  'date',
  'string',
  'null',
  'file',
  'object',
  'json',
  'xml'
];

/**
 * Validates the typedValue and reformats it
 * @param key
 * @param typedValue
 * @returns typedValue with lowercase type
 */
const sanitizeTypedValue = (key, typedValue) => {
  // 1- Check if format of typedValue is valid
  const isValidFormat = (
    typedValue &&
    Object.keys(typedValue).length === 3 &&
    typedValue.value &&
    typedValue.type &&
    typedValue.valueInfo &&
    typeof typedValue.valueInfo === 'object');

  if (!isValidFormat) {
    throw new Error(WRONG_TYPED_FORMAT(key));
  }

  // 2- Check if the type is supported
  const type = (typedValue.type || '').toLowerCase();
  if (SUPPORTED_VARIABLE_TYPES.indexOf(type) === -1) {
    throw new Error(UNSUPPORTED_VARIABLE_TYPE(key));
  }

  // 3- return typedValue with lowercase type
  return { ...typedValue, type };
};


/**
 *  @returns object mapped by applying mapper to each of its entries
 * @param object
 * @param mapper
 */
const mapEntries = (object, mapper) => (
  Object.entries(object).reduce(
    (accumulator, [key, value]) => {
      return { ...accumulator, ...mapper({ key, value }) };
    },
    {}
  )
);

module.exports = {
  isFunction,
  andArrayWith,
  isArrayOfFunctions,
  isUndefinedOrNull,
  getVariableType,
  mapEntries,
  sanitizeTypedValue
};