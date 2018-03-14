function VariableService(variables) {

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

  this.getAllTyped = () => variables;
}

module.exports = VariableService;