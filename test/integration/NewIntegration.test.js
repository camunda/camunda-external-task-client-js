const path = require("path");

const got = require("got");
const fetch = require("node-fetch");

const { Client, logger } = require("../../index.js");

const {
  MISSING_TASK,
  MISSING_ERROR_CODE,
  MISSING_NEW_DURATION
} = require("../../lib/__internal/errors");

// const TaskService = require("../../../lib/TaskService");
// const EngineService = require("../../../lib/__internal/EngineService");
// const VariableService = require("../../../lib/VariableService");

const deployProcess = require("./deploy");
const startProcess = require("./start");

const baseUrl = "http://localhost:8080/engine-rest";
const externalURL = baseUrl + "/external-task";

describe("test basic features", () => {
  const diagramPath = path.join(__dirname, "processes/testProcess.bpmn");
  const config = { baseUrl };
  let client;

  // Process start related;
  const processName = "testProcess";
  const processId = "testProcessId";

  beforeAll(async () => {
    await deployProcess(diagramPath, processName, baseUrl);
  });

  beforeEach(async () => {
    // start a test process;
    await startProcess(processName, processId, baseUrl);
    client = new Client(config);
  });

  afterEach(async () => {
    if (client) {
      client.stop;
    }
  });

  describe("fetch and lock ", () => {
    it("should call fetchAndLock with specified params", () => {
      // spy on fetch a and lock

      const fetchAnLockSpy = jest.spyOn(client.engineService, "fetchAndLock");
      // given
      const handler = async ({ task, taskService }) => {
        console.log("handler function has been called");
      };

      // when
      client.subscribe("foo", handler);
      client.poll();

      // then
      const args = fetchAnLockSpy.mock.calls[0];
      expect(args).toMatchSnapshot();

      //expect the engine service to call fetch&lock and
    });

    it("should return sucess from engine", async () => {
      let externalTaskId;
      const workerId = "someWorker";

      const payload = {
        workerId,
        maxTasks: 10,
        topics: [{ topicName: "foo", lockDuration: 50000 }]
      };

      const response = await fetch(externalURL + "/fetchAndLock", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });
      expect(response.status).toBe(200);
    });

    describe(" extend lock and unlock ", () => {
      it("should extend the lock", async () => {
        const extendLockSpy = jest.spyOn(client.engineService, "extendLock");
        // given
        const handler = async ({ task, taskService }) => {
          const response = await taskService.extendLock(task, 6000);
          expect(response).toMatchSnapshot();
        };

        // when
        client.subscribe("foo", handler);
        client.poll();
        // then
        // const args = extendLockSpy.mock.calls[0];
        // expect(args).toMatchSnapshot();
      });
    });
  });
});
