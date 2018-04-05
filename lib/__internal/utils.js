/**
 * Checks if parameter is a function
 */
const isFunction = f => typeof f === "function";

/**
 * Applies test function on each element on the array and ANDs the results
 * @param [Array] arr
 * @param [Function] test
 */
const andArrayWith = (arr, test) =>
  arr.reduce((boolean, current) => boolean && test(current), true);

/**
 * Checks if parameter is an array of functions
 */
const isArrayOfFunctions = a =>
  Array.isArray(a) && a.length > 0 && andArrayWith(a, isFunction);

/**
 * Checks if parameter is undefined or null
 */
const isUndefinedOrNull = a => typeof a === "undefined" || a === null;

const typeMatchers = {
  null: isUndefinedOrNull,

  /**
   * @returns {boolean} true if value is Integer
   */
  integer(a) {
    return (
      Number.isInteger(a) && a >= -Math.pow(2, 31) && a <= Math.pow(2, 31) - 1
    );
  },

  /**
   * @returns {boolean} true if value is Long
   */
  long(a) {
    return Number.isInteger(a) && !typeMatchers.integer(a);
  },

  /**
   * @returns {boolean} true if value is Double
   */
  double(a) {
    return typeof a === "number" && !Number.isInteger(a);
  },

  /**
   * @returns {boolean} true if value is Boolean
   */
  boolean(a) {
    return typeof a === "boolean";
  },

  /**
   * @returns {boolean} true if value is String
   */
  string(a) {
    return typeof a === "string";
  },

  },

  /**
   * @returns {boolean} true if value is Date.
   * */
  date(a) {
    return a instanceof Date;
  },

  /**
   * @returns {boolean} true if value is JSON
   */
  json(a) {
    return typeof a === "object";
  }
};

/**
 * @returns the type of the variable
 * @param variable: external task variable
 */
const getVariableType = variable => {
  const match = Object.entries(typeMatchers).filter(
    ([matcherKey, matcherFunction]) => matcherFunction(variable)
  )[0];

  return match[0];
};

/**
 * @returns object mapped by applying mapper to each of its entries
 * @param object
 * @param mapper
 */
const mapEntries = (object, mapper) =>
  Object.entries(object).reduce((accumulator, [key, value]) => {
    return { ...accumulator, ...mapper({ key, value }) };
  }, {});

module.exports = {
  isFunction,
  andArrayWith,
  isArrayOfFunctions,
  isUndefinedOrNull,
  getVariableType,
  mapEntries
};
