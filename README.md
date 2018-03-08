# camunda-external-task-worker-js

A practical JavaScript client for Camunda external tasks.

> NodeJS >= v8.9.4 is required


## Installing

```sh
npm install -s camunda-external-task-worker-js
```

Or:

```sh
yarn add camunda-external-task-worker-js
```

## Getting Started

```js
const { Workers, Logger } = require('camunda-external-task-worker-js');

const logger = new Logger();

const workers = new Workers({ use: logger, path: 'http://localhost:8080/engine-rest' });

workers.subscribe('foo', ({ task, taskClient }) => {
  // do some work then complete task after 2 seconds
  setTimeout(() => taskClient.complete(task), 2000);
});
```

## API

### Workers
```js
const { Workers } = require('camunda-external-task-worker-js');
```

#### new Workers([options])
Options are mandatory when creating a _Workers_ instance.
Here's a list of the available options:

|        Option        |                                                                             Description                                                                            | Type                   | Required |      Default     |
|:--------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|------------------------|:--------:|:----------------:|
| path                 | Path to the engine api                                                                                                                                             | string                 | ✓        |                  |
| workerId             | The id of the worker on which behalf tasks are fetched. The returned tasks are locked for that worker and can only be completed when providing the same worker id. | string                 |          | 'some-random-id' |
| maxTasks             | The maximum number of tasks to fetch                                                                                                                               | number                 |          | 10               |
| interval             | Interval of time to wait before making a new poll.                                                                                                                 | number                 |          | 300              |
| lockDuration         | The default duration to lock the external tasks for in milliseconds.                                                                                               | number                 |          | 50000            |
| autoPoll             | If true, then polling start automatically as soon as a Workers instance is created.                                                                                | boolean                |          | true             |
| asyncResponseTimeout | The Long Polling timeout in milliseconds.                                                                                                                          | number                 |          |                  |
| interceptors         | Function(s) that will be called before a request is sent. Interceptors receive the configuration of the request and return a new configuration.                    | function or [function] |          |                  |
| use                  | Function(s) that have access to the workers instance as soon as it is created and before any polling happens.                                                      | function or [function] |          |                  |

> **About interceptors**
- Interceptors receive the configuration of the request and return a new configuration. 
- In the case of multiple interceptors, they are piped in the order they are provided. 
- Check out [BasicAuthInterceptor](/lib/BasicAuthInterceptor.js) for a better understanding of the usage of interceptors.   

> **About use**
Check out [Logger](/lib/Logger.js) for a better understanding of the usage of middlewares. 

#### start()
Triggers polling. 

> **About Polling**  
- Polling tasks from the engine works by performing a fetch & lock operation of tasks that have registered workers
  to them. It then calls the worker registered to each task.
- Polling is done periodically based on the _interval_ configuration.  
- **Long Polling** is enabled by configuring the option _asyncResponseTimeout_.
 
#### subscribe(topic, [options], work)
Subscribes a worker to a specific topic. 
Here's a list of the available parameters:

| Parameter     | Description                                           | Type     | Required | Default |
|---------------|-------------------------------------------------------|----------|----------|---------|
| topic         | topic name for which external tasks should be fetched | string   | ✓        |         |
| options       | options about subscription                            | object   |          |         |
| worker        | worker function                                       | function | ✓        |         |

The only possible options supported now are:

| Option       | Description                                           | Type   | Required | Default                                                |
|--------------|-------------------------------------------------------|--------|----------|--------------------------------------------------------|
| lockDuration | specifies the lock duration for this specific worker. | number |          | global lockDuration configured in the workers instance |

> **About the worker function** 
```js
const worker = ({ task, taskClient }) => {
  // doing some work
  // 1- worker can complete a task:
  taskClient.complete(task);
  // 2- worker can handleFailure of a task:
  taskClient.handleFailure(task, 'some failure message');
  // 3- worker can handleBPMNFailure of a task:
  taskClient.handleBPMNFailure(task, 'some BPMN failure message');
  // 4- worker can handleExtendLock of a task:
  taskClient.handleExtendLock(task, 5000);
};
workers.subscribe('bar', worker);
```
The worker function receives an object that has the following parameters:
- _task_: task object locked by the worker. For more information about the task object, check out this section of [Camunda Docs](https://docs.camunda.org/manual/develop/reference/rest/external-task/fetch/).
- _taskClient_: object that provides methods to perform the following operations on a specific task.
    
 > For more information about external tasks operations, check out this section of [Camunda Docs](https://docs.camunda.org/manual/develop/reference/rest/external-task/).

#### stop()
Stops polling.

### BasicAuthInterceptor
A BasicAuthInterceptor instance is a simple interceptor that adds basic authentication to all requests.

```js
const { Workers, BasicAuthInterceptor } = require('camunda-external-task-worker-js');

const basicAuthentication = new BasicAuthInterceptor({ username: 'demo', password: 'demo' });

const workers = new Workers({ path: 'http://localhost:8080/engine-rest',  interceptors: basicAuthentication });
```


#### new BasicAuthInterceptor([options])
Here's a list of the available options:

| Option   | Description                           | Type   | Required | Default |
|----------|---------------------------------------|--------|----------|---------|
| username | username used in basic authentication | string | ✓        |         |
| password | password used in basic authentication | string | ✓        |         |

### Logger
A Logger instance is a simple middleware that logs various events in the workers lifecycle.

```js
const { Workers, Logger } = require('camunda-external-task-worker-js');

const logger = new Logger();

const workers = new Workers({ path: 'http://localhost:8080/engine-rest', logger });
```

#### new Logger()
There are no available options for now.

## License
Unless otherwise specified this project is licensed under [Apache License Version 2.0](./LICENSE).
