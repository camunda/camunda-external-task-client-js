const logger = require("./logger");
const events = require("events");

describe("logger", () => {
  let client;

  beforeAll(() => {
    client = new events();
    logger(client);
  });

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    console.log.mockClear();
  });

  it("should log subscribe event", () => {
    // when
    client.emit("subscribe", "some topic");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log unsubscribe event", () => {
    // when
    client.emit("unsubscribe", "some topic");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log poll:start event", () => {
    // when
    client.emit("poll:start");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log poll:stop event", () => {
    // when
    client.emit("poll:stop");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log poll:success event", () => {
    // when
    client.emit("poll:success", ["task1", "task2"]);

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log poll:error event", () => {
    // when
    client.emit("poll:error");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log complete:success", () => {
    // when
    client.emit("complete:success", { id: "some task id" });

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log complete:error", () => {
    // when
    client.emit("complete:error", { id: "some task id" }, "some error");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log handleFailure:success", () => {
    // when
    client.emit("handleFailure:success", { id: "some task id" });

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log handleFailure:error", () => {
    // when
    client.emit("handleFailure:error", { id: "some task id" }, "some error");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log handleBpmnError:success", () => {
    // when
    client.emit("handleBpmnError:success", { id: "some task id" });

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log handleBpmnError:error", () => {
    // when
    client.emit("handleBpmnError:error", { id: "some task id" }, "some error");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log extendLock:success", () => {
    // when
    client.emit("extendLock:success", { id: "some task id" });

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log extendLock:error", () => {
    // when
    client.emit("extendLock:error", { id: "some task id" }, "some error");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log unlock:success", () => {
    // when
    client.emit("unlock:success", { id: "some task id" });

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });

  it("should log unlock:error", () => {
    // when
    client.emit("unlock:error", { id: "some task id" }, "some error");

    // then
    expect(console.log.mock.calls[0][0]).toMatchSnapshot();
  });
});
