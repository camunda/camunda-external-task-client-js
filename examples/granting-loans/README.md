# Example
> NodeJS >= v8.9.4 is required

<img alt="A Workflow for Granting Loans" src="assets/loan-process.svg" />

## Running the example

1. First, download the following [model](assets/loan-process.bpmn) and deploy it using the Camunda Modeler.

<img alt="Deploying from Camunda Modeler" src="assets/deploy.gif" />

2. Install Dependencies:

```sh
npm install
```

Or:

```sh
yarn
```

3. Run the example:
```sh
node example.js
```

### Output
The output should be:

```
polling
✓ subscribed to topic creditScoreChecker
polling
✓ polled 10 tasks
✓ completed task 897ce191-2dea-11e8-a9c0-66b11439c29a
```
