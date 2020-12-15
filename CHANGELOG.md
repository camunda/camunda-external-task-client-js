# Changelog

## 2.1.0
### Features
- Allow manual locking of a Task

## 2.0.0
### Features
- Support for Keycloak auth secured rest API

### Deprecations
- Removed support for Node v8 and v9. Please use node version 10 or higher.

## 1.3.1
### Features
- support localVariables when fetching Tasks

### Changes to the logging behavior
- Not every Action will be logged by default. For example, polling will no longer be logged if it is successful. 
You can define the log level as described in the [docs](https://github.com/camunda/camunda-external-task-client-js/blob/master/docs/logger.md#loggerlevelloglevel). To emulate >=1.3.0 bahaviour, use `logger.level('debug')`

## 1.3.0
### Features
- Use priority when fetching Tasks
- Filter tasks by version tag

## 1.2.0
### Features
- Set maximum number of executed tasks using `maxParallelExecutions`

## 1.1.1
### Features
- Filter tasks by tenant
- Filter tasks by process definition

## 1.1.0-alpha1
### Features
- Make it possible to pass error message and variables when handling a bpmn error.

## 1.0.0
### Features
- Filter tasks by business key

### Bug Fixes
- Setting typed date variable with a string value causes serialization issue

## 0.2.0
### Features
- Setting Local Variables
- Support for File & Date Variables

## 0.1.1

### Features
- Exchange Process Variables

## 0.1.0

### Features
- Fetch and Lock
- Complete
- Handle Failure
- Handle BPMN Error
- Extend Lock
- Unlock
