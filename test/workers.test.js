const Workers = require('../lib/workers');

const customWorkersOptions = {
  path: 'http://localhost:8080/engine-rest/external-task',
  workerId: 'foobarId',
  maxTasks: 3,
  interval: 100,
  lockDuration: 30000
};
const workers = new Workers(customWorkersOptions);

test('throw error: api path wasn\'t passed', () => {
  expect(() => { new Workers();}).toThrow();
});

test('overwrite default with custom workers config', () =>{
  expect(workers.options.workerId).toBe(customWorkersOptions.workerId);
  expect(workers.options.maxTasks).toBe(customWorkersOptions.maxTasks);
  expect(workers.options.interval).toBe(customWorkersOptions.interval);
  expect(workers.options.lockDuration).toBe(customWorkersOptions.lockDuration);
});

// Register workers
const fooWork = () => 'foobar';
const customConfig = { lockDuration: 3000 };

test('registered worker without custom config ', () => {
  const barWorker = workers.registerWorker('bar', fooWork);
  expect(barWorker.handler).not.toBeUndefined();
});

test('throw error: work function wasn\'t passed', () => {
  workers.registerWorker('foo', fooWork);
  expect(() => { workers.registerWorker('foo', fooWork); }).toThrow();
});

test('overwrite default with custom worker config', () =>{
  const fooWorker = workers.registerWorker('bar2', customConfig, fooWork);
  expect(fooWorker.workerOptions.lockDuration).toBe(customConfig.lockDuration);
});


// TODO:
// Test regist / unregister a worker with fetch&lock mock.
// unregister workers as soon as it is possible.

