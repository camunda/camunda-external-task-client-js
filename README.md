# camunda-external-task-client

A practical JavaScript client for [Camunda External Tasks](https://docs.camunda.org/manual/latest/user-guide/process-engine/external-tasks/).

> NodeJS >= v8.9.4 is required

## Installing

```sh
npm install -s camunda-external-task-client-js
```

Or:

```sh
yarn add camunda-external-task-client-js
```

## Usage

1. Create a simple process model with an External Service Task and define the topic as 'topicName'.
2. Deploy the process to the Camunda BPM engine.
3. In your NodeJS script:

```js
const { Client, logger } = require('camunda-external-task-client-js');

// Create a Client instance and configure it to use a logger and a baseUrl to the Camunda engine Rest API
const client = new Client({ use: logger, baseUrl: 'http://localhost:8080/engine-rest' });

// Susbscribe to the topic: 'topicName'
client.subscribe('topicName', async function({ task, taskService }) {
  // Put your business logic
    
  // Complete the task
  try {
    await taskService.complete(task);
    console.log('I completed my task successfully!!');
  } catch(e) {
    console.error(`Failed completing my task, ${e}`)
  }
});
```
  
> **Note:** Although the examples used in this documentation use _async await_ for handling asynchronous calls, you
can also use Promises to achieve the same results.

## About External Tasks
External Tasks are service tasks whose execution differs particularly from the execution of other service tasks (e.g. Human Tasks).
The execution works in a way that units of work are polled from the engine before being completed.

**camunda-external-task-client.js** allows you to create easily such client in NodeJS. 

## Features
### [Fetch and Lock](https://docs.camunda.org/manual/latest/reference/rest/external-task/fetch/) 
Done through [polling](#about-polling).

### [Complete](https://docs.camunda.org/manual/latest/reference/rest/external-task/post-complete/)
```js
// Susbscribe to the topic: 'topicName'
client.subscribe('topicName', async function({ task, taskService }) {
  // Put your business logic
    
  // Complete the task
  try {
    await taskService.complete(task);
    console.log('I completed my task successfully!!');
  } catch(e) {
    console.error(`Failed completing my task, ${e}`)
  }
});
```
### [Handle Failure](https://docs.camunda.org/manual/latest/reference/rest/external-task/post-failure/) 
```js
// Susbscribe to the topic: 'topicName'
client.subscribe('topicName', async function({ task, taskService }) {
  // Put your business logic
    
  // Handle a Failure
  try {
    await taskService.handleFailure(task, 'some failure message');
    console.log('I handled my failure successfully!!');
  } catch(e) {
    console.error(`Failed to handle my failure, ${e}`)
  }
});
```
### [Handle BPMN Error](https://docs.camunda.org/manual/latest/reference/rest/external-task/post-bpmn-error/)
```js
// Susbscribe to the topic: 'topicName'
client.subscribe('topicName', async function({ task, taskService }) {
  // Put your business logic
    
  // Handle a BPMN Failure
  try {
    await taskService.handleBPMNFailure(task, 'some BPMN failure message');
    console.log('I handled my BPMN failure successfully!!');
  } catch(e) {
    console.error(`Failed to handle my BPMN failure, ${e}`)
  }
});
```

### [Extend Lock](https://docs.camunda.org/manual/latest/reference/rest/external-task/post-extend-lock/) 
```js
// Susbscribe to the topic: 'topicName'
client.subscribe('topicName', async function({ task, taskService }) {
  // Put your business logic
    
  // Extend the lock time
  try {
    await taskService.extendLock(task, 5000);
    console.log('I extended the lock time successfully!!');
  } catch(e) {
    console.error(`Failed to extend the lock time, ${e}`)
  }
});
```

### [Unlock](https://docs.camunda.org/manual/latest/reference/rest/external-task/post-unlock/)
```js
// Susbscribe to the topic: 'topicName'
client.subscribe('topicName', async function({ task, taskService }) {
  // Put your business logic
    
  // Unlock the task
  try {
    await taskService.unlock(task);
    console.log('I unlocked the task successfully!!');
  } catch(e) {
    console.error(`Failed to unlock the task, ${e}`)
  }
});
```

## API

* [Client](#client)
* [new Client([options])](#new-clientoptions)
  * [client.start()](#clientstart)
  * [client.subscribe(topic, [options], handler)](#clientsubscribetopic-options-handler)
  * [client.stop()](#clientstop)
* [BasicAuthInterceptor](#basicauthinterceptor)
  * [new BasicAuthInterceptor([options])](#new-basicauthinterceptoroptions)
* [logger](#logger)

### Client
```js
const { Client } = require('camunda-external-task-handler-js');
```

Client is the core class of the external task client. 
It is used to start/stop the external task client and subscribe to a certain topic.

#### new Client([options])
Options are **mandatory** when creating a _Client_ instance.
Here's a list of the available options:

|        Option        |                                                                             Description                                                                            | Type                   | Required |      Default     |
|:--------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|------------------------|:--------:|:----------------:|
| baseUrl              | Path to the engine api                                                                                                                                             | string                 | ✓        |                  |
| workerId             | The id of the worker on which behalf tasks are fetched. The returned tasks are locked for that worker and can only be completed when providing the same worker id. | string                 |          | 'some-random-id' |
| maxTasks             | The maximum number of tasks to fetch                                                                                                                               | number                 |          | 10               |
| interval             | Interval of time to wait before making a new poll.                                                                                                                 | number                 |          | 300              |
| lockDuration         | The default duration to lock the external tasks for in milliseconds.                                                                                               | number                 |          | 50000            |
| autoPoll             | If true, then polling start automatically as soon as a Client instance is created.                                                                                | boolean                |          | true             |
| asyncResponseTimeout | The Long Polling timeout in milliseconds.                                                                                                                          | number                 |          |                  |
| interceptors         | Function(s) that will be called before a request is sent. Interceptors receive the configuration of the request and return a new configuration.                    | function or [function] |          |                  |
| use                  | Function(s) that have access to the client instance as soon as it is created and before any polling happens.                                                      | function or [function] |          |                  |

#####  _About interceptors_
- Interceptors receive the configuration of the request and return a new configuration. 
- In the case of multiple interceptors, they are piped in the order they are provided. 
- Check out [BasicAuthInterceptor](/lib/BasicAuthInterceptor.js) for a better understanding of the usage of interceptors.   

##### _About use_
Check out [logger](/lib/logger.js) for a better understanding of the usage of middlewares. 

#### client.start()
Triggers polling. 

##### _About Polling_
- Polling tasks from the engine works by performing a fetch & lock operation of tasks that have subscriptions. It then calls the handler registered to each task.
- Polling is done periodically based on the _interval_ configuration.  
- [Long Polling](https://docs.camunda.org/manual/latest/user-guide/process-engine/external-tasks/#long-polling-to-fetch-and-lock-external-tasks) is enabled by configuring the option _asyncResponseTimeout_.
 
#### client.subscribe(topic, [options], handler)
Subscribes a handler to a specific topic and returns a _topic subscription_.
Here's a list of the available parameters:

| Parameter     | Description                                           | Type     | Required | Default |
|---------------|-------------------------------------------------------|----------|----------|---------|
| topic         | topic name for which external tasks should be fetched | string   | ✓        |         |
| options       | options about subscription                            | object   |          |         |
| handler       | handler function                                      | function | ✓        |         |

The only possible options supported now are:

| Option       | Description                                           | Type   | Required | Default                                                |
|--------------|-------------------------------------------------------|--------|----------|--------------------------------------------------------|
| lockDuration | specifies the lock duration for this specific handler.| number |          | global lockDuration configured in the client instance |

##### _About the handler function_

```js
const handler = async function({ task, taskService }) {
  // Put your business logic
};

client.subscribe('bar', handler);
```

The handler function receives an object that has the following parameters:
- _task_: locked task object. For more information about the task object, check out this section of [Camunda Docs](https://docs.camunda.org/manual/develop/reference/rest/external-task/fetch/).
- _taskService_: object that provides methods to perform the following operations on a specific task.
    

##### _About topic subscription_
A topic subscription, which is returned by the **subscribe()** method, is a an object that provides the following:
- **handler:** a function that is executed whenever a task is fetched & locked for the topic subscribed to.
- **unsubscribe():** a function to unsubscribe from a topic.
- **lockDuration:** the configured lockDuration for this specific topic subscription.

```js
const { Client } = require('camunda-external-task-client-js');

const client = new Client({ baseUrl: 'http://localhost:8080/engine-rest' });

const topicSubscription = client.subscribe('foo', async function({ task, taskService }) {
  // Put your business logic
});

// unsubscribe from a topic
topicSubscription.unsubscribe();
```

#### client.stop()
Stops polling.

### Client Events
Here's a list of available client events:

- client.on('subscribe', function(topic, topicSubscription) {})
- client.on('unsubscribe', function(topic, topicSubscription) {})
- client.on('poll:start', function() {})
- client.on('poll:stop', function() {})
- client.on('poll:success', function(tasks) {})
- client.on('poll:error', function(error) {})
- client.on('complete:success', function(task) {})
- client.on('complete:error', function(task, error) {})
- client.on('handleFailure:success', function(task) {})
- client.on('handleFailure:error', function(task, error) {})
- client.on('handleBpmnError:success', function(task) {})
- client.on('handleBpmnError:error', function(task, error) {})
- client.on('extendLock:success', function(task) {})
- client.on('extendLock:error', function(task, error) {})
- client.on('unlock:success', function(task) {})
- client.on('unlock:error', function(task, error) {})

### BasicAuthInterceptor
A BasicAuthInterceptor instance is a simple interceptor that adds basic authentication to all requests.

```js
const { Client, BasicAuthInterceptor } = require('camunda-external-task-client-js');

const basicAuthentication = new BasicAuthInterceptor({ username: 'demo', password: 'demo' });

const client = new Client({ baseUrl: 'http://localhost:8080/engine-rest',  interceptors: basicAuthentication });
```


#### new BasicAuthInterceptor([options])
Here's a list of the available options:

| Option   | Description                           | Type   | Required | Default |
|----------|---------------------------------------|--------|----------|---------|
| username | username used in basic authentication | string | ✓        |         |
| password | password used in basic authentication | string | ✓        |         |

### logger
A logger is a simple middleware that logs various events in the client lifecycle.

```js
const { Client, logger } = require('camunda-external-task-client-js');

const client = new Client({ use: logger, baseUrl: 'http://localhost:8080/engine-rest' });
```

## License
Unless otherwise specified this project is licensed under [Apache License Version 2.0](./LICENSE).
