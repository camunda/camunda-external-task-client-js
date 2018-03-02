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


module.exports = {
  isFunction,
  andArrayWith,
  isArrayOfFunctions,
  isUndefinedOrNull
};