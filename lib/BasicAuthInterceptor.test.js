const BasicAuthInterceptor = require("./BasicAuthInterceptor");
const { MISSING_AUTH_PARAMS } = require("./__internal/errors");

describe("BasicAuthInterceptor", () => {
  test("should throw error if username or password are missing", () => {
    expect(() => new BasicAuthInterceptor()).toThrowError(MISSING_AUTH_PARAMS);
    expect(
      () => new BasicAuthInterceptor({ username: "some username" })
    ).toThrowError(MISSING_AUTH_PARAMS);
    expect(
      () => new BasicAuthInterceptor({ password: "some password" })
    ).toThrowError(MISSING_AUTH_PARAMS);
  });

  test("should add basic auth header to intercepted config", () => {
    // given
    const basicAuthInterceptor = new BasicAuthInterceptor({
      username: "some username",
      password: "some password"
    });
    const config = { key: "some value" };
    const headers = basicAuthInterceptor(config);

    //then
    expect(headers).toMatchSnapshot();
  });
});
