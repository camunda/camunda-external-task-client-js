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

const got = jest.requireActual('got');

const handleRequest = (url, { testResult }) => {
  if (testResult instanceof Error) {
     return Promise.reject(testResult);
  }
  return {
    body: testResult instanceof Object ? JSON.stringify(testResult) : Buffer.from(testResult || "", "utf-8"),
    headers : { "content-type": testResult instanceof Object
      ? "application/json" : "application/octet-stream"},
    headers: {}
  }
};

const gotMock = handleRequest;
gotMock.json = () => {};

const myModule = module.exports = jest.fn().mockImplementation(gotMock);
myModule.GotError = got.GotError;
myModule.HTTPError = got.HTTPError;
myModule.RequestError = got.RequestError;
