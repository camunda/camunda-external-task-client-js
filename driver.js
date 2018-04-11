const { Client, logger, Variables, File } = require("./index");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

// configuration for the Client:
//  - 'baseUrl': url to the Workflow Engine
//  - 'logger': utility to automatically log important events
// const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
//
// // create a Client instance with custom configuration
// const client = new Client(config);
//
// // create a handler for the task
// const handler = async ({ task, taskService }) => {
//   const variables = new Variables();
//   variables.set("score", 0);
//   const file =  await new File({ localPath: "package.json" }).load();
//   variables.set("foovar", file);
//
//   // complete the task
//   try {
//     await taskService.complete(task, variables);
//     console.log("I completed my task successfully!!");
//   } catch (e) {
//     console.error(`Failed completing my task, ${e}`);
//   }
// };
//
// // susbscribe to the topic 'creditScoreChecker' & provide the created handler
// client.subscribe("creditScoreChecker", handler);
//
// client.subscribe("requestRejecter", async ({ task, taskService }) => {
//   const foovar = await task.variables.get("foovar").load();
//   const content = foovar.content.toString("base64");
//   console.log("foovar: ", content);
// });
//
//

console.log(logger.error("This is an error message!"))
