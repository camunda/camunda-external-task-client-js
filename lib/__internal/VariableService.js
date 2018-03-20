const { getVariableType, mapEntries } = require('./utils');

function VariableService(initialVariables) {
  let variables = { ...initialVariables };
  let dirtyVariables = {};

  /**
   * @returns the value of the variable
   * @param variableName
   */
  this.get = (variableName) => {
    let variable = { ...variables[variableName] };
    if (variable.type === 'Json') {
      variable.value = JSON.parse(variable.value);
    }
    return variable.value;
  };

  /**
   * @returns the full variable including type and valueInfo
   * @param variableName
   */
  this.getTyped = (variableName) => {
    let variable = { ...variables[variableName] };
    if (variable && variable.type === 'Json') {
      variable.value = JSON.parse(variable.value);
    }
    return variable;
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
   * Sets value for variable corresponding to key
   * The type is determined automatically
   * @param key
   * @param newValue
   */
  this.set = (key, newValue) => {
    const type = getVariableType(newValue);
    const value = type === 'Json' ?
      JSON.stringify(newValue):
      newValue;

    variables[key] = dirtyVariables[key] = { value, type, valueInfo: {} };
  };

  /**
   * Sets typed value for variable corresponding to key
   * @throws Error
   * @param key
   * @param typedValue
   */
  this.setTyped = (key, typedValue) => {
    let { value, type } = { ...typedValue };
    if (type === 'Json') {
      value = JSON.stringify(value);
    }
    variables[key] = dirtyVariables[key] = { ...typedValue, value };
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

  /**
   * @returns the dirty variables
   */
  this.getDirtyVariables = () => {
    return { ...dirtyVariables };
  };
}

module.exports = VariableService;