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
const EngineError = require("./EngineError");

describe("EngineError", () => {
  test("construct an error from a Camunda REST API error", () => {
    //given
    const httpError = new got.HTTPError(
      {
        body: { type: "SomeExceptionClass", message: "a detailed message" },
        statusCode: 400,
        statusMessage: "Bad request"
      },
      {}
    );
    const expectedPayload =
      "Response code 400 (Bad request); Error: a detailed message; Type: SomeExceptionClass";

    //when
    const engineError = new EngineError(httpError);

    //then
    expect(engineError.message).toEqual(expectedPayload);
  });

  test("construct an error with an unexpected response body", () => {
    //given
    const httpError = new got.HTTPError(
      {
        body: "Some unexpected error message",
        statusCode: 400,
        statusMessage: "Bad request"
      },
      {}
    );
    const expectedPayload =
      "Response code 400 (Bad request); Error: Some unexpected error message; Type: undefined";

    //when
    const engineError = new EngineError(httpError);

    //then
    expect(engineError.message).toEqual(expectedPayload);
  });
});
