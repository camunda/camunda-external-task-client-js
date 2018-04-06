const { VariableService, File } = require("../index");

describe("VariableService", () => {
  describe("read-only", () => {
    it("should only have getters if readOnly is true", () => {
      // given
      const readOnlyVariables = new VariableService({}, { readOnly: true });

      // then
      expect(Object.keys(readOnlyVariables)).toMatchSnapshot();
    });

    it("should have getters and setters if readOnly is not true", () => {
      // given
      const readOnlyVariables = new VariableService({});

      // then
      expect(Object.keys(readOnlyVariables)).toMatchSnapshot();
    });
  });

  describe("getters", () => {
    let variables, variableService;
    beforeEach(() => {
      variables = {
        foo: { type: "string", value: "FooValue", valueInfo: {} },
        bar: { type: "integer", value: 2, valueInfo: {} },
        baz: { type: "json", value: '{"name":"baz"}', valueInfo: {} },
        qux: {
          type: "date",
          value: new Date("2018-01-23T14:42:45.435+0200"),
          valueInfo: {}
        },
        zex: {
          type: "file",
          value: null,
          valueInfo: {}
        }
      };

      variableService = new VariableService(variables);

      const file = new File({ localPath: "some/local/path" });
      file.content = Buffer.from("some content");

      variableService.setTyped("blax", {
        type: "file",
        value: file,
        valueInfo: {}
      });
    });

    it("getAllTyped() should return all variables", () => {
      expect(variableService.getAllTyped()).toMatchSnapshot();
    });

    it("getAll() should return values of all variables", () => {
      expect(variableService.getAll()).toMatchSnapshot();
    });

    it("getDirtyVariables() should return all dirty variables", () => {
      expect(variableService.getDirtyVariables()).toMatchSnapshot();
    });

    it("get('foo') should return value of key foo", () => {
      expect(variableService.get("foo")).toMatchSnapshot();
    });

    it("getTyped('non_existing_key') should return null", () => {
      expect(variableService.getTyped("non_existing_key")).toBeNull();
    });

    it("getTyped('foo') should return the typed value of key foo", () => {
      expect(variableService.getTyped("foo")).toMatchSnapshot();
    });
  });

  describe("setters", () => {
    let variableService;
    beforeEach(() => {
      variableService = new VariableService();
    });

    it('setTyped("baz",someTypeValue) should set typed value with key "baz"', () => {
      // given
      expect(variableService.getAllTyped()).toMatchSnapshot("variables");
      expect(variableService.getDirtyVariables()).toMatchSnapshot(
        "dirty variables"
      );
      const key = "baz";
      const typedValue = {
        type: "json",
        value: { name: "bazname" },
        valueInfo: {}
      };

      // when
      variableService.setTyped(key, typedValue);

      // then
      expect(variableService.getAllTyped()).toMatchSnapshot("variables");
      expect(variableService.getDirtyVariables()).toMatchSnapshot(
        "dirty variables"
      );
    });

    it("setAllTyped(someTypedValues) should add someTypedValues to variables", () => {
      // given
      expect(variableService.getAllTyped()).toMatchSnapshot("variables");
      expect(variableService.getDirtyVariables()).toMatchSnapshot(
        "dirty variables"
      );
      const typedValues = {
        foo: { value: "fooValue", type: "string", valueInfo: {} }
      };
      variableService.set("bar", "barValue");

      // when
      variableService.setAllTyped(typedValues);

      // then
      expect(variableService.getAllTyped()).toMatchSnapshot("variables");
      expect(variableService.getDirtyVariables()).toMatchSnapshot(
        "dirty variables"
      );
    });

    it('set("foo", "fooValue")) should set variable with key "foo" and value "fooValue"', () => {
      // given
      expect(variableService.getAllTyped()).toMatchSnapshot("variables");
      expect(variableService.getDirtyVariables()).toMatchSnapshot(
        "dirty variables"
      );
      variableService.set("foo", "fooValue");

      // then
      expect(variableService.getAllTyped()).toMatchSnapshot("variables");
      expect(variableService.getDirtyVariables()).toMatchSnapshot(
        "dirty variables"
      );
    });

    it("setAll(someValues)  should add someValues to variables", () => {
      // given
      expect(variableService.getAllTyped()).toMatchSnapshot("variables");
      expect(variableService.getDirtyVariables()).toMatchSnapshot(
        "dirty variables"
      );
      const someValues = {
        foo: "FooValue",
        bar: 2
      };

      // when
      variableService.setAll(someValues);

      // then
      // given
      expect(variableService.getAllTyped()).toMatchSnapshot("variables");
      expect(variableService.getDirtyVariables()).toMatchSnapshot(
        "dirty variables"
      );
    });
  });
});
