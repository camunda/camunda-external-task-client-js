const { getVariableType, mapEntries, sanitizeTypedValue } = require('./utils');

function VariableService(initialVariables) {
  let variables = { ...initialVariables };
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
    if (typedValue.type.toLowerCase() === 'json') {
      typedValue.value = JSON.parse(variable.value);
    }
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
   * Sets typed value for variable corresponding to key
   * @throws Error
   * @param key
   * @param typedValue
   */
  this.setTyped = (key, typedValue) => {
    let { value, type } = sanitizeTypedValue(key, typedValue);
    if (type === 'json') {
      value = JSON.stringify(value);
    }
    variables[key] = dirtyVariables[key] = { ...typedValue, value, type };
  };

  /**
   * Sets value for variable corresponding to key
   * The type is determined automatically
   * @param key
   * @param newValue
   */
  this.set = (key, newValue) => {
    const type = getVariableType(newValue);
    this.setTyped(key, { value: newValue, type, valueInfo: {} });
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