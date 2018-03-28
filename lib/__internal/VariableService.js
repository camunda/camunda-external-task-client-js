const { getVariableType, mapEntries } = require('./utils');


/**
 * Process variable based on provided operation
 * Used when getting initial variables and when ejecting dirtyVariables
 * @param key
 * @param typedValue
 * @param operation
 * @returns sanitized variable
 */
const sanitizeVariable = ({ key, value:typedValue, operation }) => {
  let { value, type } = { ...typedValue };
  type = type.toLowerCase();
  if (type.toLowerCase() === 'json') {
    value = JSON[operation](value);
  }
  return { [key]: { ...typedValue, value, type } };
};

/**
 * Sanitize variable and parse all JSON typed values
 * @param variable
 * @returns {sanitized}
 */
const parseTypedValue = (variable) => sanitizeVariable({ ...variable, operation: 'parse' });

/**
 * Sanitize variable and stringify all JSON typed values
 * @param variable
 * @returns {sanitized}
 */
const stringifyTypedValue = (variable) => sanitizeVariable({ ...variable, operation: 'stringify' });

function VariableService(initialVariables = {}, readOnly) {
  let variables = mapEntries(initialVariables, parseTypedValue);

  let dirtyVariables = {};

  /**
   * @returns the typedValue corresponding to variableName
   * @param variableName
   */
  this.getTyped = (variableName) => {
    let variable = variables[variableName];
    if (!variable) {
      return null;
    }

    let typedValue = { ...variable };
    return typedValue;
  };

  /**
   * @returns the value corresponding to variableName
   * @param variableName
   */
  this.get = (variableName) => {
    const { value } = { ...this.getTyped(variableName) };
    return value;
  };

  /**
   * @returns the values of all variables
   */
  this.getAll = () => (
    mapEntries(variables, ({ key }) => ({ [key]: this.get(key) }))
  );

  /**
   * @returns the typed values of all variables
   */
  this.getAllTyped = () => (
    mapEntries(variables, ({ key }) => ({ [key]: this.getTyped(key) }))
  );

  /**
   * @returns the dirty variables
   */
  this.getDirtyVariables = () => {
    return mapEntries(dirtyVariables, stringifyTypedValue);
  };

  if (!readOnly) {
    /**
     * Sets typed value for variable corresponding to variableName
     * @param variableName
     * @param typedValue
     */
    this.setTyped = (variableName, typedValue) => {
      let { value, type } = { ...typedValue };
      type = type && type.toLowerCase();
      variables[variableName] = dirtyVariables[variableName] = { ...typedValue, value, type };
    };

    /**
     * Sets value for variable corresponding to variableName
     * The type is determined automatically
     * @param variableName
     * @param value
     */
    this.set = (variableName, value) => {
      const type = getVariableType(value);
      this.setTyped(variableName, { value, type, valueInfo: {} });
    };

    /**
     * Sets the values of multiple variables at once
     * The new values are merged with existing ones
     * @param values
     */
    this.setAll = (values) => {
      const self = this;
      Object.entries(values).forEach(([key, value]) => {
        self.set(key, value);
      });
    };

    /**
     * Sets the typed values of multiple variables at once
     * The new typedValues are merged with existing ones
     * @param typedValues
     */
    this.setAllTyped = (typedValues) => {
      const self = this;
      Object.entries(typedValues).forEach(([key, typedValue]) => {
        self.setTyped(key, typedValue);
      });
    };
  }

}

module.exports = VariableService;