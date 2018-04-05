const { getVariableType, mapEntries } = require("./__internal/utils");

const File = require("./File");

function VariableService(initialVariables = {}, options = {}) {
  const { readOnly, processInstanceId, engineService } = options;

  /**
   * formats a variable received from the engine or sent to the engine
   * @param variable.key
   * @param variable.typedValue
   * @param options.direction
   */
  const formatVariable = ({ key, value: typedValue }, { direction }) => {
    let { type, value, valueInfo } = typedValue;

    type = type.toLowerCase();

    const remotePath = `/execution/${processInstanceId}/localVariables/${key}/data`;

    if (type === "json") {
      value =
        direction === "fromEngine" ? JSON.parse(value) : JSON.stringify(value);
    } else if (type === "file") {
      direction === "fromEngine"
        ? (value = new File({ typedValue, remotePath, engineService }))
        : ({ value, valueInfo } = value.createTypedValue());
    } else if (type === "date" && value && typeof value === "object") {
      value = value.toISOString().substring(0, value.length - 1);
    }

    return { [key]: { type, value, valueInfo } };
  };

  let dirtyVariables = {};

  let variables = mapEntries(initialVariables, variable =>
    formatVariable(variable, { direction: "fromEngine" })
  );

  /**
   * @returns the typedValue corresponding to variableName
   * @param variableName
   */
  this.getTyped = variableName => {
    let variable = variables[variableName];

    if (!variable) {
      return null;
    }

    return { ...variable };
  };

  /**
   * @returns the value corresponding to variableName
   * @param variableName
   */
  this.get = variableName => {
    const { value } = { ...this.getTyped(variableName) };
    return value;
  };

  /**
   * @returns the values of all variables
   */
  this.getAll = () =>
    mapEntries(variables, ({ key }) => ({ [key]: this.get(key) }));

  /**
   * @returns the typed values of all variables
   */
  this.getAllTyped = () =>
    mapEntries(variables, ({ key }) => ({ [key]: this.getTyped(key) }));

  /**
   * @returns the dirty variables
   */
  this.getDirtyVariables = () => {
    return mapEntries(dirtyVariables, variable =>
      formatVariable(variable, { direction: "toEngine" })
    );
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
      variables[variableName] = dirtyVariables[variableName] = {
        ...typedValue,
        value,
        type
      };
    };

    /**
     * Sets value for variable corresponding to variableName
     * The type is determined automatically
     * @param variableName
     * @param value
     */
    this.set = (variableName, value) => {
      const type = getVariableType(value);
      this.setTyped(variableName, { type, value, valueInfo: {} });
    };

    /**
     * Sets the values of multiple variables at once
     * The new values are merged with existing ones
     * @param values
     */
    this.setAll = values => {
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
    this.setAllTyped = typedValues => {
      const self = this;
      Object.entries(typedValues).forEach(([key, typedValue]) => {
        self.setTyped(key, typedValue);
      });
    };
  }
}

module.exports = VariableService;
