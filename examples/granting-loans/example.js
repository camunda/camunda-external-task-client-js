const { Client, logger } = require('camunda-external-task-client-js');

// configuration for the Client:
//  - 'baseUrl': url to the Workflow Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

// create a handler for the task
const handler = async({ task, taskService }) => {
  // get task variable 'defaultScore'
  const defaultScore = task.variables.get('defaultScore');

  // set task variable 'creditScores'
  task.variables.set('creditScores', [defaultScore, 9, 1, 4, 10]);

  // complete the task
  try {
    await taskService.complete(task);
    console.log('I completed my task successfully!!');
  } catch (e) {
    console.error(`Failed completing my task, ${e}`);
  }
};

// susbscribe to the topic 'creditScoreChecker' & provide the created handler
client.subscribe('creditScoreChecker', handler);