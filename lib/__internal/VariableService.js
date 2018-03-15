const { getVariableType } = require('./utils');

function VariableService(initialVariables) {
  let variables = { ...initialVariables };
  let dirtyVariables = {};

  /**
   * @returns the value of the variable
   * @param variableName
   */
  this.get = (variableName) => {
    const variable = variables[variableName];
    return variable && variable.value;
  };

  /**
   * @returns the full variable including type and valueInfo
   * @param variableName
   */
  this.getTyped = variableName => variables[variableName];

  /**
   * @returns the values of all variables
   */
  this.getAll = () => {
    return Object.entries(variables).reduce((accumulator, [variableKey, variableValue]) => (
      { ...accumulator, [variableKey]: variableValue.value }
    ), {});
  };

  /**
   * @returns the typed values of all variables
   */
  this.getAllTyped = () => variables;

  /**
   * Sets value for variable corresponding to key
   * The type is determined automatically
   * @param key
   * @param value
   */
  this.set = (key, value) => {
    const type = getVariableType(value);
    variables[key] = dirtyVariables[key] = { value, type, valueInfo: {} };
  };

  /**
   * Sets typed value for variable corresponding to key
   * @param key
   * @param typedValue
   */
  this.setTyped = (key, typedValue) => {
    variables[key] = dirtyVariables[key] = typedValue;
  };

  /**
   * Sets the values of multiple variables at once
   * The new values are merged with existing ones
   * @param values
   */
  this.setAll = (values) => {
    const self = this;
    Object.entries(values).map(([key, value]) => {
      self.set(key, value);
    });
  };

  /**
   * Sets the typed values of multiple variables at once
   * The new typedValues are merged with existing ones
   * @param typedValues
   */
  this.setAllTyped = (typedValues) => {
    dirtyVariables = { ...dirtyVariables, ...typedValues };
    variables = { ...variables, ...typedValues };
  };

  /**
   * @returns the dirty variables
   */
  this.getDirtyVariables = () => {
    return { ...dirtyVariables };
  };
}

module.exports = VariableService;