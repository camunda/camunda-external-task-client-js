const {
  Client,
  logger,
  Variables
} = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Workflow Engine
//  - 'logger': utility to automatically log important events
const config = {
  baseUrl: "http://localhost:8080/engine-rest",
  use: logger
};

// create a Client instance with custom configuration
const client = new Client(config);

// create a handler for the task
const handler = async ({ task, taskService }) => {
  // get task variable 'defaultScore'
  const defaultScore = task.variables.get("defaultScore");

  // set process variable 'creditScores'
  const creditScores = [defaultScore, 9, 1, 4, 10];
  const processVariables = new Variables()
    .set("creditScores", creditScores)
    .set("bar", new Date());

  // complete the task
  try {
    await taskService.complete(task, processVariables);
    console.log("I completed my task successfully!!");
  } catch (e) {
    console.error(`Failed completing my task, ${e}`);
  }
};

// susbscribe to the topic 'creditScoreChecker' & provide the created handler
client.subscribe("creditScoreChecker", handler);

client.subscribe("requestRejecter", async ({ task, taskService }) => {
  console.log(task.variables.get("bar"));
  console.log(task.variables.get("creditScores"));
});
