const { Client, logger, Variables } = require("../index");

describe("integration", () => {
  let client, expectedScore, expectedUser;

  beforeAll(() => {
    const config = {
      baseUrl: "http://localhost:8080/engine-rest",
      use: logger
    };

    expectedScore = 6;
    expectedUser = { name: "Jean Pierre", balance: "$2000" };
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
          const processVariables = new Variables()
            .set("score", expectedScore)
            .set("user", expectedUser);
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
          const { score, user } = task.variables.getAll();
          expect(score).toBe(expectedScore);
          expect(user).toEqual(expectedUser);
          await taskService.handleFailure(task, {
            errorMessage: "something failed"
          });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  });
});
