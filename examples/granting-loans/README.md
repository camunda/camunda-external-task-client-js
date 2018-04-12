# Example
> NodeJS >= v8.9.4 is required

<img alt="A Workflow for Granting Loans" src="assets/loan-process.svg" />

## Running the example

1. First, make sure to have [Camunda](https://camunda.com/download/) running.
 
2. Download the following [model](assets/loan-process.bpmn) and deploy it using the Camunda Modeler.

<img alt="Deploying from Camunda Modeler" src="assets/deploy.gif" />

3. Install Dependencies:

```sh
npm install
```

Or:

```sh
yarn
```

4. Run the example:
```sh
node index.js
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
