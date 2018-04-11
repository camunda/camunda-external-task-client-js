const { Client, logger, Variables } = require("../index");

describe("integration", () => {
  let client, expectedScore;

  beforeAll(() => {
    const config = {
      baseUrl: "http://localhost:8080/engine-rest",
      use: logger
    };

    expectedScore = 6;
    // create a Client instance with custom configuration
    client = new Client(config);
  });

  test("should subscribe client and complete with process variables", () => {
    // susbscribe to the topic: 'creditScoreChecker'
    return new Promise((resolve, reject) => {
      client.subscribe("creditScoreChecker", async function({
        task,
        taskService
      }) {
        try {
          const processVariables = new Variables().set("score", expectedScore);
          await taskService.complete(task, processVariables);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  });

  test("should subscribe client, receive process variables and handle failure", () => {
    // susbscribe to the topic: 'creditScoreChecker'
    return new Promise((resolve, reject) => {
      client.subscribe("loanGranter", async function({ task, taskService }) {
        try {
          const score = task.variables.get("score");
          expect(score).toBe(expectedScore);
          await taskService.handleFailure(task, { errorMessage: "something failed" });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  });
});
