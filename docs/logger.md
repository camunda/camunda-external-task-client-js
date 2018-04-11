# logger

A logger is a simple middleware that logs various events in the client lifecycle.

```js
const { Client, logger } = require("camunda-external-task-client-js");

const client = new Client({
  use: logger,
  baseUrl: "http://localhost:8080/engine-rest"
});
```

## `logger.success(text)`

Receives a text and produces a success message out of it.

```js
console.log(logger.success("This is a success message!"));
```

![logger.success](./logger-success.png)



## `logger.error(text)`
Receives a text and produces an error message out of it.

```js
console.log(logger.error("This is an error message!"));
```

![logger.error](./logger-error.png)
