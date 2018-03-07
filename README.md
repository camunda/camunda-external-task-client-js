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
These are the available options:

|        Option        |                                                                             Description                                                                            | Type                   | Required |      Default     |
|:--------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|------------------------|:--------:|:----------------:|
| path                 | Path to the engine api                                                                                                                                             | string                 | ✓        |                  |
| workerId             | The id of the worker on which behalf tasks are fetched. The returned tasks are locked for that worker and can only be completed when providing the same worker id. | string                 |          | 'some-random-id' |
| maxTasks             | The maximum number of tasks to fetch                                                                                                                               | number                 |          | 10               |
| interval             | Interval of time to wait before making a new poll.                                                                                                                 | number                 |          | 300              |
| lockDuration         | The default duration to lock the external tasks for in milliseconds.                                                                                               | number                 |          | 50000            |
| autoPoll             | If true, then polling start automatically as soon as a Workers instance is created.                                                                                | boolean                |          | true             |
| asyncResponseTimeout | The Long Polling timeout in milliseconds.                                                                                                                          | number                 |          |                  |
| interceptors         | Function(s) that will be called before a request is sent. Intercepts receive the configuration of the request and return a new configuration.                      | function or [function] |          |                  |
| use                  | Function(s) that have access to the workers instance as soon as it is created and before any polling happens.                                                      | function or [function] |          |                  |

#### start()
Triggers polling. 

Polling tasks from the engine works by performing a fetch & lock operation of tasks that have registered workers
to them. It then calls the worker registered to each task.

If the parameter _asyncResponseTimeout_ is specified, then this method performs a long polling.

> Polling is done in a periodic based on the interval configuration.  
 
#### subscribe(topic, [options], work)
Subscribes a worker to a specific topic. 

| Parameter     | Description                                           | Type     | Required | Default |
|---------------|-------------------------------------------------------|----------|----------|---------|
| topic         | topic name for which external tasks should be fetched | string   | ✓        |         |
| options       | options about subscription                            | object   |          |         |
| worker        | worker function                                       | function | ✓        |         |

The only possible options supported now are:

| Option       | Description                                           | Type   | Required | Default                                                |
|--------------|-------------------------------------------------------|--------|----------|--------------------------------------------------------|
| lockDuration | specifies the lock duration for this specific worker. | number |          | global lockDuration configured in the workers instance |

#### worker function
```js
const worker = ({ task, taskClient }) => {
  // doing some work
 
 // 1- worker can complete a task
 taskClient()
};

workers.subscribe('bar', worker);
```

The worker function receives an object that has the following parameters:
- task: task object locked by the worker. For more information about the task object, check out this section of [Camunda Docs](https://docs.camunda.org/manual/develop/reference/rest/external-task/fetch/).
- taskClient: object that provides methods to perform the following operations on a
specific task:
    - complete
    - handleFailure
    - handleBPMNFailure
    - handleExtendLock
    
 > For more information about the external tasks operations, check out this section of [Camunda Docs](https://docs.camunda.org/manual/develop/reference/rest/external-task/).

#### stop()
Stops polling.

### BasicAuthInterceptor

### Logger

Unless otherwise specified this project is licensed under [Apache License Version 2.0](./LICENSE).
