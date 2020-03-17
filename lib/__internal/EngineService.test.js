/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership. Camunda licenses this file to you under the Apache License,
 * Version 2.0; you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const got = require("got");

const EngineService = require("./EngineService");
const EngineError = require("./EngineError");

describe("EngineService", () => {
  let engineService, postSpy, requestSpy;
  beforeEach(() => {
    engineService = new EngineService({
      workerId: "someWorker",
      baseUrl: "some/baseUrl"
    });
    postSpy = jest.spyOn(engineService, "post");
    requestSpy = jest.spyOn(engineService, "request");
  });

  test("post should call request with url and payload", () => {
    //given
    const expectedUrl = "some/url";
    const expectedPayload = { key: "some value" };

    //when
    engineService.post(expectedUrl, expectedPayload);

    //then
    expect(requestSpy).toBeCalledWith("POST", expectedUrl, expectedPayload);
  });

  test("get should call request with url and payload", () => {
    //given
    const expectedUrl = "some/url";
    const expectedPayload = { key: "some value" };

    //when
    engineService.get(expectedUrl, expectedPayload);

    //then
    expect(requestSpy).toBeCalledWith("GET", expectedUrl, expectedPayload);
  });

  test("fetchAndLock", () => {
    //given
    const expectedUrl = "/external-task/fetchAndLock";
    const expectedReqBody = { someKey: "some value" };
    const expectedPayload = {
      json: { ...expectedReqBody, workerId: engineService.workerId }
    };

    // when
    engineService.fetchAndLock(expectedReqBody);

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);
  });

  test("complete", () => {
    // given
    const expectedTaskId = "foo";
    const expectedUrl = `/external-task/${expectedTaskId}/complete`;
    const expectedVariables = { someVariable: "some variable value" };
    const expectedLocalVariables = {
      someLocalVariable: "some local variable value"
    };
    const expectedPayload = {
      json: {
        workerId: engineService.workerId,
        variables: expectedVariables,
        localVariables: expectedLocalVariables
      }
    };

    // when
    engineService.complete({
      id: expectedTaskId,
      variables: expectedVariables,
      localVariables: expectedLocalVariables
    });

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);
  });

  test("handleFailure", () => {
    // given
    const expectedTaskId = "foo";
    const expectedUrl = `/external-task/${expectedTaskId}/failure`;
    const expectedRequestBody = { errorMessage: "some error message" };
    const expectedPayload = {
      json: { ...expectedRequestBody, workerId: engineService.workerId }
    };

    // when
    engineService.handleFailure({ id: expectedTaskId }, expectedRequestBody);

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);
  });

  test("handleBpmnError", () => {
    // given
    const expectedTaskId = "foo";
    const expectedUrl = `/external-task/${expectedTaskId}/bpmnError`;
    const expectedErrorCode = "some error code";
    const expectedErrorMessage = "some error message";
    const expectedPayload = {
      json: {
        errorCode: expectedErrorCode,
        errorMessage: expectedErrorMessage,
        workerId: engineService.workerId
      }
    };

    // when
    engineService.handleBpmnError(
      { id: expectedTaskId },
      expectedErrorCode,
      expectedErrorMessage
    );

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);
  });

  test("extendLock", () => {
    // given
    const expectedTaskId = "foo";
    const expectedUrl = `/external-task/${expectedTaskId}/extendLock`;
    const expectedNewDuration = 100;
    const expectedPayload = {
      json: {
        newDuration: expectedNewDuration,
        workerId: engineService.workerId
      }
    };

    // when
    engineService.extendLock({ id: expectedTaskId }, expectedNewDuration);

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);
  });

  test("unlock", () => {
    // given
    const expectedTaskId = "foo";
    const expectedUrl = `/external-task/${expectedTaskId}/unlock`;
    const expectedPayload = {};

    // when
    engineService.unlock({ id: expectedTaskId });

    // then
    expect(postSpy).toBeCalledWith(expectedUrl, expectedPayload);
  });

  describe("request", () => {
    it("should send request with given options", () => {
      //given
      const method = "POST";
      const path = "/some/url";
      const expectedUrl = `${engineService.baseUrl}${path}`;
      const expectedPayload = { method, key: "some value" };

      //when
      engineService.request(method, path, expectedPayload);

      //then
      expect(got).toBeCalledWith(expectedUrl, expectedPayload);
    });

    it("should get request options from interceptors", () => {
      //given
      const method = "POST";
      const path = "/some/url";
      const expectedUrl = `${engineService.baseUrl}${path}`;
      const expectedInitialPayload = { key: "some value" };
      const someExpectedAddedPayload = { someNewKey: "some new value" };
      const anotherExpectedAddedPayload = {
        anotherNewKey: "another new value"
      };
      const someInterceptor = config => ({
        ...config,
        ...someExpectedAddedPayload
      });
      const anotherInterceptor = config => ({
        ...config,
        ...anotherExpectedAddedPayload
      });
      engineService.interceptors = [someInterceptor, anotherInterceptor];
      const expectedPayload = {
        method,
        ...expectedInitialPayload,
        ...someExpectedAddedPayload,
        ...anotherExpectedAddedPayload
      };

      //when
      engineService.request(method, path, expectedPayload);

      //then
      expect(got).toBeCalledWith(expectedUrl, expectedPayload);
    });

    it("should throw error if request fails with HTTPError", async () => {
      // given
      const error = new got.HTTPError(
        {
          body: { type: "SomeExceptionClass", message: "a detailed message" },
          statusCode: 400,
          statusMessage: "Bad request"
        },
        {}
      );

      // then
      let thrownError;

      try {
        await engineService.request("GET", "", { testResult: error });
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toEqual(new EngineError(error));
    });

    it("should throw error if request fails with other that HTTPError", async () => {
      // given
      const error = new got.RequestError(new Error("Some HTTP error"), {});

      // then
      let thrownError;

      try {
        await engineService.request("GET", "", { testResult: error });
      } catch (e) {
        thrownError = e;
      }

      expect(thrownError).toBe(error);
    });
  });
});
